import path from 'path';
import fs from 'fs';
import { Sequelize, SequelizeOptions, DataType } from 'sequelize-typescript';
import { v4 } from 'uuid';
import { config } from '@/packages/core/config';
import rolesSeed from '@/database/seeds/20220522120587-FillRolesAndPermissions';
import superAdminRoleSeed from '@/database/seeds/20220522140572-FillSuperAdminRole';
import superAdminSeed from '@/database/seeds/20220510161938-FillSuperAdmin';

let dbName: string;

export const createDatabaseConnection = async (): Promise<Sequelize> => {
  if (config.db.type === 'sqlite') {
    const hash = v4();
    dbName = `./${hash}.sqlite3`;
  } else {
    dbName = config.db.database as any;
  }

  const options: SequelizeOptions = {
    dialect: config.db.type as any,
    storage: dbName,
    pool: {
      min: 0,
      max: 1000,
      idle: 10000
    },
    logging: false,
    models: [config.app.dirs.entitiesDir]
  };

  const connection = new Sequelize(options);
  return connection;
};

export const createTables = async (connection: Sequelize) => {
  const queryInterface = await connection.getQueryInterface();

  await queryInterface.createTable('users', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataType.STRING,
      allowNull: false,
      unique: true
    },
    password: DataType.STRING,
    payload: {
      type: DataType.JSON,
      defaultValue: '{}'
    },
    created_at: {
      type: DataType.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataType.DATE,
      allowNull: false
    },
    deleted_at: DataType.DATE
  });

  await queryInterface.createTable('pets', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataType.STRING,
      allowNull: false
    },
    age: {
      type: DataType.INTEGER,
      allowNull: false
    },
    payload: {
      type: DataType.JSON,
      defaultValue: '{}'
    },
    created_at: {
      type: DataType.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataType.DATE,
      allowNull: false
    },
    deleted_at: DataType.DATE,
    user_id: {
      type: DataType.INTEGER,
      references: {
        model: {
          tableName: 'users'
        },
        key: 'id'
      }
    }
  });

  await queryInterface.createTable('roles', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
      unique: true
    },
    description: DataType.STRING,
    created_at: {
      type: DataType.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataType.DATE,
      allowNull: false
    },
    deleted_at: DataType.DATE
  });

  await queryInterface.createTable('permissions', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
      unique: true
    },
    description: DataType.STRING,
    created_at: {
      type: DataType.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataType.DATE,
      allowNull: false
    },
    deleted_at: DataType.DATE
  });

  await queryInterface.createTable('roles_permissions', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role_id: {
      type: DataType.INTEGER,
      references: {
        model: {
          tableName: 'roles'
        },
        key: 'id'
      }
    },
    permission_id: {
      type: DataType.INTEGER,
      references: {
        model: {
          tableName: 'permissions'
        },
        key: 'id'
      }
    },
    created_at: {
      type: DataType.DATE,
      allowNull: false
    }
  });

  await queryInterface.createTable('users_roles', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataType.INTEGER,
      references: {
        model: {
          tableName: 'users'
        },
        key: 'id'
      }
    },
    role_id: {
      type: DataType.INTEGER,
      references: {
        model: {
          tableName: 'roles'
        },
        key: 'id'
      }
    },
    created_at: {
      type: DataType.DATE,
      allowNull: false
    }
  });
};

export const createRoles = async (connection: Sequelize) => {
  const queryInterface = await connection.getQueryInterface();

  // @ts-ignore
  await rolesSeed.up(queryInterface);
};

export const createSuperAdmin = async (connection: Sequelize) => {
  const queryInterface = await connection.getQueryInterface();

  // @ts-ignore
  await superAdminSeed.up(queryInterface);
  // @ts-ignore
  await superAdminRoleSeed.up(queryInterface);
};

export const synchronizeDatabase = async (connection: Sequelize) => {
  await connection.getQueryInterface().dropDatabase(config.db.database);
  return await connection.sync();
};

export const closeDatabase = async (connection: Sequelize) => {
  await fs.promises.unlink(path.resolve(process.cwd(), dbName));
  return await connection.close();
};
