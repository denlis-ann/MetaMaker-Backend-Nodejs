var express = require('express');
var router = express.Router();
require("dotenv").config();
const { recoverPersonalSignature } = require("eth-sig-util");
const { bufferToHex } = require("ethereumjs-util");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const config = require("../config/jwt.config");
const { User, UserWallet } = require("../config/db.config");
const { SuccessRes, ErrorRes } = require("../common/response");
const logger = require("../logger");
const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

/**Validate wallet signing */
const validateMetamaskSign = (wallet) => {
  const schema = Joi.object({
    publicAddress: Joi.string().trim().required().messages({
      "string.base": `Public Address should be a type of string`,
      "string.empty": `Public Address cannot be an empty field`,
      "any.required": `Public Address is required.`,
    }),
    signature: Joi.string().trim().required().messages({
      "string.base": `Signature should be a type of string`,
      "string.empty": `Signature cannot be an empty field`,
      "any.required": `Signature is required.`,
    }),
  });
  return schema.validate(wallet);
};

/**Authenticate using wallet */
router.get('/', async (req, res, next) => {
  let { signature, publicAddress } = req.body;
  const { error } = validateMetamaskSign(req.body);
  if (error) {
    logger.error(
      `400 - ${error.details[0].message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    return res
      .status(400)
      .send(ErrorRes(error.details[0].message, error.details[0]));
  }

  publicAddress = publicAddress ? publicAddress.trim().toLowerCase() : null;
  signature = signature ? signature.trim() : null;
  const user = await User.findOne({
    where: { user_id: `wallet-${publicAddress}` },
  });

  if (!user) {
    logger.error(
      `400 - User with wallet ${publicAddress} is not found in the database - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    return res.status(400).send(
      ErrorRes(
        `User with wallet ${publicAddress} is not found in the database`,
        {
          message: `User with wallet ${publicAddress} is not found in the database`,
        }
      )
    );
  } else {
    const { id } = user;
    const wallet = await UserWallet.findOne({
      where: { user_id: id, public_address: publicAddress },
    });
    const msg = `I am signing my one-time nonce: ${wallet["nonce"]}`;
    const msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));
    try {
      const address = recoverPersonalSignature({
        data: msgBufferHex,
        sig: signature,
      });
      if (address.toLowerCase() === publicAddress) {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        user["access_token"] = accessToken;
        user["refresh_token"] = refreshToken;
        user["modified"] = new Date();
        const newUser = await user.save();

        wallet["nonce"] = Math.floor(Math.random() * 10000);
        wallet["modified"] = new Date();
        await wallet.save();
        logger.info(
          `200 - Tokens generated successfully - ${req.originalUrl} - ${req.method} - ${req.ip}`
        );
        res.status(200).send(
          SuccessRes("Tokens generated successfully", {
            access_token: newUser["access_token"],
            refresh_token: newUser["refresh_token"],
            id: newUser["id"],
          })
        );
      } else {
        logger.error(
          `400 - Signature verification failed - ${req.originalUrl} - ${req.method} - ${req.ip}`
        );
        return res.status(400).send(
          ErrorRes("Signature verification failed", {
            message: "Signature verification failed",
          })
        );
      }
    } catch (err) {
      const message = err.message
        ? err.message
        : "Something went wrong while generating tokens";
      logger.error(
        `400 - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      res.status(400).send(ErrorRes(message, err));
    }
  }
});

/**Generate Access Token */
const generateAccessToken = (user) => {
  const accessToken = jwt.sign(
    {
      payload: {
        id: user["id"],
      },
    },
    JWT_SECRET,
    {
      algorithm: config.algorithms[0],
      expiresIn: "7d",
    }
  );
  return accessToken;
};

/**Generate Refresh Token */
const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    {
      payload: {
        id: user["id"],
      },
    },
    JWT_REFRESH_SECRET,
    {
      algorithm: config.algorithms[0],
    }
  );
  return refreshToken;
};

module.exports = router;