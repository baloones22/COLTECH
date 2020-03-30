import Sequelize, { Model } from 'sequelize';

class ShopKeeper extends Model {
  static init(sequelize) {
    super.init(
      {
        employee: Sequelize.STRING,
        company: Sequelize.STRING,
        email: Sequelize.STRING,
        phone: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default ShopKeeper;
