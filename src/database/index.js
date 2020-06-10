import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));

    User.belongsTo(File, {
      foreignKey: 'avatar_id',
      as: 'avatar',
    }); /** pertence a */

    Appointment.belongsTo(User, {
      foreignKey: 'user_id',
      as: 'user',
    }); /** pertence a */

    Appointment.belongsTo(User, {
      foreignKey: 'provider_id',
      as: 'provider',
    }); /** pertence a */
  }

  mongo() {
    this.mongoConnection = mongoose.createConnection(
      'mongodb://localhost/gobarber',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
