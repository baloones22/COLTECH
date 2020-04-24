import Sequelize, { Model } from 'sequelize';
import crypto from 'crypto';

class ShopKeeper extends Model {
  static init(sequelize) {
    super.init(
      {
        employee: Sequelize.STRING,
        company: Sequelize.STRING,
        email: Sequelize.STRING,
        phone: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    if (!this.password_hash === null) {
      this.addHook('beforeSave', async shopkeeper => {
        if (shopkeeper.password) {
          shopkeeper.password_hash = await crypto.randomBytes(4).toString('HEX');
        }
      });
    }

    return this;
  }

  // eslint-disable-next-line consistent-return
  checkPassword(password) {
    if (password === this.password_hash) {
      return password;
    }
  }
}

export default ShopKeeper;
