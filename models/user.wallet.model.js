module.exports = (sequelize, type) => {
  return sequelize.define(
    "user_wallet",
    {
      user_id: {
        allowNull: false,
        type: type.BIGINT,
        references: {
          model: "user_profile",
          key: "id",
        },
      },
      nonce: {
        allowNull: true,
        type: type.BIGINT,
        defaultValue: () => Math.floor(Math.random() * 10000), // Initialize with a random nonce
      },
      public_address: {
        allowNull: true,
        type: type.STRING,
        validate: { isLowercase: true },
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
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "user_wallet",
    }
  );
};
