var express = require('express');
var router = express.Router();
const { User, UserWallet } = require("../config/db.config");
const { SuccessRes, ErrorRes } = require("../common/response");
const logger = require("../logger");

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let { publicAddress } = req.query;
  publicAddress = publicAddress ? publicAddress.trim().toLowerCase() : null;
  if (!publicAddress) {
    logger.error(
      `400 - Wallet Address is not provided! - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    return res.status(400).send(
      ErrorRes("Wallet Address is not provided!", {
        message: "Wallet Address is not provided!",
      })
    );
  }

  const whereClause = publicAddress
    ? {
        where: { user_id: `wallet-${publicAddress}` },
      }
    : undefined;

  try {
    const user = await User.findOne({ ...whereClause, raw: true });
    if (user) {
      const { id, user_id } = user;
      const wallet = await UserWallet.findOne({
        where: {
          user_id: id,
          public_address: publicAddress,
        },
        raw: true,
      });
      logger.info(
        `200 - User fetched Successfully - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      return res.status(200).send(
        SuccessRes("User fetched Successfully", {
          id,
          user_id,
          public_address: publicAddress,
          nonce: wallet["nonce"],
        })
      );
    } else {
      logger.info(
        `200 - User fetched Successfully - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      return res.status(200).send(SuccessRes("User fetched Successfully", {}));
    }
  } catch (err) {
    const message = err.message
      ? err.message
      : "Something went wrong while fetching users!";
    logger.error(
      `400 - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    res.status(400).send(ErrorRes(message, err));
  }
});

/* POST users. */
router.post('/', async function(req, res, next) {
  let { publicAddress } = req.body;
  publicAddress = publicAddress ? publicAddress.trim().toLowerCase() : null;
  if (!publicAddress) {
    logger.error(
      `400 - Wallet Address is not provided! - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    return res.status(400).send(
      ErrorRes("Wallet Address is not provided!", {
        message: "Wallet Address is not provided!",
      })
    );
  }

  try {
    const existingUser = await User.findOne({
      where: { user_id: `wallet-${publicAddress}` },
      raw: true,
    });
    if (existingUser) {
      logger.error(
        `400 - User with wallet ${publicAddress} already exists! - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      return res.status(400).send(
        ErrorRes(`User with wallet ${publicAddress} already exists!`, {
          message: `User with wallet ${publicAddress} already exists!`,
        })
      );
    } else {
      const newUser = await User.create({ user_id: `wallet-${publicAddress}` });
      const { id } = newUser;
      const newWallet = await UserWallet.create({
        user_id: id,
        public_address: publicAddress,
      });
      const { nonce } = newWallet;
      logger.info(
        `201 - A new user created with the wallet ${publicAddress} - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      return res.status(201).send(
        SuccessRes(`A new user created with the wallet ${publicAddress}`, {
          id,
          public_address: publicAddress,
          user_id: `wallet-${publicAddress}`,
          nonce,
        })
      );
    }
  } catch (err) {
    const message = err.message
      ? err.message
      : "Something went wrong while creating user!";
    logger.error(
      `400 - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    return res.status(400).send(ErrorRes(message, err));
  }
});

module.exports = router;

