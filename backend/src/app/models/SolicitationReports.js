import Sequelize, { Model } from 'sequelize';

class SolicitationReports extends Model {
  static init(sequelize) {
    super.init({
        description: Sequelize.STRING,
      },
      {
        sequelize,
      } );
    return this;
  }
  static associate(models) {
        this.belongsTo(models.Document, {
      foreignKey: 'document_id',
      as: 'document',
    });
     }}
export default SolicitationReports;