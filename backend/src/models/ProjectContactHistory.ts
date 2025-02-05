import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import sequelize from '../config/database';
import Project from './Project';
import User from './User';

class ProjectContactHistory extends Model<InferAttributes<ProjectContactHistory>, InferCreationAttributes<ProjectContactHistory>> {
  declare contact_id: CreationOptional<number>;
  declare project_id: ForeignKey<Project['project_id']>;
  declare contact_date: Date;
  declare contact_time: string;
  declare contact_method: string;
  declare contact_person: string;
  declare contact_content: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare created_by: ForeignKey<User['user_id']> | null;
  declare updated_by: ForeignKey<User['user_id']> | null;

  // 関連プロパティ
  declare Project?: NonAttribute<Project>;
  declare CreatedBy?: NonAttribute<User>;
  declare UpdatedBy?: NonAttribute<User>;
}

ProjectContactHistory.init(
  {
    contact_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'project_id',
      },
    },
    contact_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    contact_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    contact_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    contact_person: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    contact_content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    updated_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
  },
  {
    sequelize,
    modelName: 'ProjectContactHistory',
    tableName: 'project_contact_histories',
    timestamps: true,
    underscored: true,
  }
);

export default ProjectContactHistory; 