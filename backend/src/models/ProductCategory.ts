import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class ProductCategory extends Model {
  public category_id!: number;
  public name!: string;
  public tax_rate!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

ProductCategory.init({
  category_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  tax_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 10.0
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
  modelName: 'ProductCategory',
  tableName: 'product_categories',
  timestamps: false
});

export default ProductCategory; 