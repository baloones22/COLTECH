import Sequelize from 'sequelize';

import User from '../app/models/User';
import Document from '../app/models/Document';
import File from '../app/models/File';
import ShopKeeper from '../app/models/ShopKeeper';
import Report from '../app/models/Report';

import dataBaseConfig from '../config/database';

const models = [User, Document, File, ShopKeeper, Report];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(dataBaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
