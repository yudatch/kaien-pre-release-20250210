import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Product extends Model {
  public product_id!: number;
  public product_code!: string;
  public name!: string;
  public description?: string;
  public price!: number;
  public cost?: number;
  public category?: string;
  public current_stock!: number;
  public minimum_stock!: number;
  public tax_rate!: number;
  public is_active!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
  public created_by?: number;
  public updated_by?: number;
  public category_id?: number;
}

Product.init({
  product_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  product_code: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: DataTypes.TEXT,
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  cost: DataTypes.DECIMAL(12, 2),
  category: DataTypes.STRING(50),
  current_stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  minimum_stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tax_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 10.0
  },
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
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'product_categories',
      key: 'category_id'
    }
  }
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products',
  timestamps: false
});

export default Product; 