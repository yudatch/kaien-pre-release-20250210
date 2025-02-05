import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Supplier extends Model {
  public supplier_id!: number;
  public supplier_code!: string;
  public name!: string;
  public contact_person?: string;
  public phone?: string;
  public email?: string;
  public address?: string;
  public postal_code?: string;
  public tax_id?: string;
  public payment_terms?: number;
  public is_active!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
  public created_by?: number;
  public updated_by?: number;
}

Supplier.init({
  supplier_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  supplier_code: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  contact_person: DataTypes.STRING(50),
  phone: DataTypes.STRING(20),
  email: DataTypes.STRING(100),
  address: DataTypes.TEXT,
  postal_code: DataTypes.STRING(8),
  tax_id: DataTypes.STRING(13),
  payment_terms: DataTypes.INTEGER,
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
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
  modelName: 'Supplier',
  tableName: 'suppliers',
  timestamps: false
});

export default Supplier;