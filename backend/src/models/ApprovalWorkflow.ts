import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Seal from './Seal';
import { ApprovalStatus, APPROVAL_STATUSES } from '../types/enums';

class ApprovalWorkflow extends Model {
  public workflow_id!: number;
  public document_type!: string;
  public document_id!: number;
  public approver_id!: number;
  public status!: ApprovalStatus;
  public approved_at?: Date;
  public seal_id?: number;
  public created_at!: Date;
  public updated_at!: Date;
}

ApprovalWorkflow.init({
  workflow_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  document_type: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  document_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  approver_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id'
    },
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending',
    validate: {
      isIn: [APPROVAL_STATUSES]
    }
  },
  approved_at: DataTypes.DATE,
  seal_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Seal,
      key: 'seal_id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'ApprovalWorkflow',
  tableName: 'approval_workflows',
  timestamps: false
});

export default ApprovalWorkflow; 