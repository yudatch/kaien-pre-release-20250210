import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Project from './Project';
import Supplier from './Supplier';

class PurchaseOrder extends Model {
  public order_id!: number;
  public order_number!: string;
  public supplier_id!: number;
  public project_id!: number;
  public order_date!: Date;
  public delivery_date?: Date;
  public subtotal!: number;
  public tax_amount!: number;
  public total_amount!: number;
  public status!: string;
  public approval_status!: string;
  public approved_by?: number;
  public approved_at?: Date;
  public notes?: string;
  public created_at!: Date;
  public updated_at!: Date;
  public created_by?: number;
  public updated_by?: number;
}

PurchaseOrder.init({
  order_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  order_number: {
    type: DataTypes.STRING(20),
    unique: true,
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
  project_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Project,
      key: 'project_id'
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
  approval_status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending'
  },
  approved_by: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  approved_at: DataTypes.DATE,
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
  modelName: 'PurchaseOrder',
  tableName: 'purchase_orders',
  timestamps: false
});

export default PurchaseOrder; 