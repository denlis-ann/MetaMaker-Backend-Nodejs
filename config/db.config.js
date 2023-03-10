const { Sequelize } = require("sequelize");
require('dotenv').config()
const UserProfileModel = require("../models/user.profile.model");
// const UserExpModel = require("../models/user.experience.model");
const UserWalletModel = require("../models/user.wallet.model");
// const nftMetadataModel = require("../models/nft.metadata.model");
const logger = require("../logger");
const { PG_DATABASE, PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, PG_DIALECT } =
  process.env;
console.log('qqqqqqqqq',PG_DATABASE)
const sequelize = new Sequelize(PG_DATABASE, PG_USER, PG_PASSWORD, {
  host: PG_HOST,
  port: PG_PORT,
  dialect: PG_DIALECT,
});

sequelize
  .authenticate()
  .then(() => {
    logger.info("200 - Database connection has been established successfully");
  })
  .catch((err) => {
    logger.error(`400 - Unable to connect to the database: ${err}`);
  });

const User = UserProfileModel(sequelize, Sequelize);
// const UserExp = UserExpModel(sequelize, Sequelize);
const UserWallet = UserWalletModel(sequelize, Sequelize);
// const nftMetadata = nftMetadataModel(sequelize,Sequelize);

User.hasMany(UserWallet, { foreignKey: "user_id" });
UserWallet.belongsTo(User, { foreignKey: "user_id" });

sequelize.sync();

module.exports = {
  User,
  // UserExp,
  UserWallet,
  // nftMetadata
};
