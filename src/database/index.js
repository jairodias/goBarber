import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';
import Notification from '../app/models/Notification';

import databaseConfig from '../config/database';

const models = [User, File, Appointment, Notification];

class Database {
  constructor() {
    this.init();
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
}

export default new Database();
