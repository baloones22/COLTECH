import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

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

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default ShopKeeper;
