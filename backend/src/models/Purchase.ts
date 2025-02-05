import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Project from './Project';
import Supplier from './Supplier';

class Purchase extends Model {
  public purchase_id!: number;
  public purchase_number!: string;
  public project_id!: number;
  public supplier_id!: number;
  public order_date!: Date;
  public delivery_date?: Date;
  public subtotal!: number;
  public tax_amount!: number;
  public total_amount!: number;
  public status!: string;
  public notes?: string;
  public created_at!: Date;
  public updated_at!: Date;
  public created_by?: number;
  public updated_by?: number;
}

Purchase.init({
  purchase_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  purchase_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  project_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Project,
      key: 'project_id'
    },
    allowNull: false
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Supplier,
      key: 'supplier_id'
    },
    allowNull: false
  },
  order_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  delivery_date: DataTypes.DATE,
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  tax_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'approved', 'ordered', 'received', 'cancelled'),
    defaultValue: 'draft'
  },
  notes: DataTypes.TEXT,
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  updated_by: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id'
    }
  }
}, {
  sequelize,
  modelName: 'Purchase',
  tableName: 'purchases',
  timestamps: false
});

export default Purchase; 