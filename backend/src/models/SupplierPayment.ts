import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Purchase from './Purchase';

class SupplierPayment extends Model {
  public payment_id!: number;
  public purchase_id!: number;
  public payment_date!: Date;
  public amount_paid!: number;
  public payment_method!: string;
  public reference_number?: string;
  public notes?: string;
  public created_at!: Date;
  public updated_at!: Date;
  public created_by?: number;
  public updated_by?: number;
}

SupplierPayment.init({
  payment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  purchase_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Purchase,
      key: 'purchase_id'
    },
    allowNull: false
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  amount_paid: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  payment_method: {
    type: DataTypes.ENUM('bank_transfer', 'credit_card', 'cash'),
    allowNull: false
  },
  reference_number: DataTypes.STRING(50),
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
  modelName: 'SupplierPayment',
  tableName: 'supplier_payments',
  timestamps: false
});

export default SupplierPayment; 