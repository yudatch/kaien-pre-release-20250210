import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import sequelize from '../config/database';
import Customer from './Customer';
import Quotation from './Quotation';
import ProjectContactHistory from './ProjectContactHistory';
import { ProjectStatus } from '../types/project';

class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
  declare project_id: CreationOptional<number>;
  declare project_code: string;
  declare customer_id: ForeignKey<Customer['customer_id']>;
  declare project_name: string;
  declare description: string | null;
  declare start_date: Date | null;
  declare end_date: Date | null;
  declare expected_completion_date: Date | null;
  declare status: ProjectStatus;
  declare total_amount: number | null;
  declare contract_amount: number | null;
  declare profit_margin: number | null;
  declare construction_status: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  // 関連プロパティを追加
  declare Customer?: NonAttribute<Customer>;
  declare Quotations?: NonAttribute<Quotation[]>;
  declare contact_histories?: NonAttribute<ProjectContactHistory[]>;
}

Project.init(
  {
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_code: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'customer_id',
      },
    },
    project_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    expected_completion_date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ProjectStatus)),
      defaultValue: ProjectStatus.DRAFT,
    },
    total_amount: {
      type: DataTypes.DECIMAL(12, 2),
    },
    contract_amount: {
      type: DataTypes.DECIMAL(12, 2),
    },
    profit_margin: {
      type: DataTypes.DECIMAL(5, 2),
    },
    construction_status: {
      type: DataTypes.ENUM('planned', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'planned',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    sequelize,
    modelName: 'Project',
    tableName: 'projects',
    timestamps: true,
    underscored: true,
  }
);

export default Project;