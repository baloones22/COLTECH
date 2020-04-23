import Sequelize, { Model } from 'sequelize';
import { isBefore, isAfter } from 'date-fns';

class Report extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        active: {
          type: Sequelize.VIRTUAL(Sequelize.BOOLEAN, [
            'start_date',
            'end_date',
          ]),
          get() {
            return (
              isBefore(this.get('start_date'), new Date()) &&
              isAfter(this.get('end_date'), new Date())
            );
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.ShopKeeper, {
      foreignKey: 'shopkeeper_id',
      as: 'shopkeeper',
    });

    this.belongsTo(models.Document, {
      foreignKey: 'document_id',
      as: 'document',
    });
  }
}

export default Report;
