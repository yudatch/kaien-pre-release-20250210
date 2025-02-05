import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Project from './Project';
import Supplier from './Supplier';
import { ConstructionStatus } from '../types/enums';

class ConstructionDetail extends Model {
  public construction_id!: number;
  public project_id?: number;
  public contractor_id?: number;
  public construction_date!: Date;
  public completion_date?: Date;
  public unit_price!: number;
  public progress?: number;
  public status?: ConstructionStatus;
  public notes?: string;
  public created_at!: Date;
  public created_by?: number;
  public updated_at!: Date;
  public updated_by?: number;

  // 関連付けの型定義
  public Project?: Project;
  public Contractor?: Supplier;
  public ConstructionCreator?: User;
  public ConstructionUpdater?: User;
}

ConstructionDetail.init({
  construction_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  project_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Project,
      key: 'project_id'
    },
    allowNull: false
  },
  contractor_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Supplier,
      key: 'supplier_id'
    },
    allowNull: false
  },
  construction_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completion_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  unit_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  status: {
    type: DataTypes.ENUM('planned', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'planned',
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id'
    },
    allowNull: true
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  updated_by: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id'
    },
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'ConstructionDetail',
  tableName: 'construction_details',
  timestamps: false,
  indexes: [
    {
      name: 'idx_construction_project',
      fields: ['project_id']
    },
    {
      name: 'idx_construction_date',
      fields: ['construction_date']
    }
  ]
});

export default ConstructionDetail; 