'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/weblist-dev'
  },
  sequelize: {
    uri: 'sqlite://',
    options: {
      logging: false,
      storage: 'dev.sqlite',
      define: {
        timestamps: false
      }
    }
  },
  sql: {
    host: 'localhost',
    dialect: 'postgres',
    protocol: 'postgres',
    database: 'weblist',
    username: 'postgres',
    password: 'peregrine',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  },
  seedDB: true
};
