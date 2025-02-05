import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Invoice from './Invoice';

class Payment extends Model {
  public payment_id!: number;
  public invoice_id!: number;
  public payment_date!: Date;
  public amount_received!: number;
  public payment_method!: string;
  public reference_number?: string;
  public notes?: string;
  public created_at!: Date;
  public updated_at!: Date;
  public created_by?: number;
  public updated_by?: number;
}

Payment.init({
  payment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  invoice_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Invoice,
      key: 'invoice_id'
    },
    allowNull: false
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  amount_received: {
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
  modelName: 'Payment',
  tableName: 'payments',
  timestamps: false
});

export default Payment; 