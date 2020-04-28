import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        key: Sequelize.STRING,
        size: Sequelize.INTEGER,
        url: {
          type: Sequelize.STRING,
          get() {
            return `${process.env.APP_URL}/files/${this.key}`;
          }
        }
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
