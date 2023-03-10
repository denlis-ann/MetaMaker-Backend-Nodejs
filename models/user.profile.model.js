module.exports = (sequelize, type) => {
  return sequelize.define(
    "user_profile",
    {
      user_id: {
        allowNull: false,
        type: type.STRING,
        unique: true,
      },
      nick_name: {
        type: type.STRING,
        unique: true,
      },
      profile_pic: {
        type: type.STRING,
      },
      access_token: {
        type: type.STRING,
      },
      refresh_token: {
        type: type.STRING,
      },
      thumbnail: {
        type: type.STRING,
      },
      is_active: {
        allowNull: false,
        type: type.BOOLEAN,
        defaultValue: () => true,
      },
      created: {
        allowNull: false,
        type: type.DATE,
        defaultValue: () => new Date(),
      },
      modified: {
        allowNull: false,
        type: type.DATE,
        defaultValue: () => new Date(),
      },
      fcm_token: {
        type: type.STRING,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "user_profile",
    }
  );
};
