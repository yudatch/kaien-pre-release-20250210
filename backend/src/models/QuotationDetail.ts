import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Quotation from './Quotation';
import Product from './Product';

class QuotationDetail extends Model {
  public detail_id!: number;
  public quotation_id!: number;
  public product_id!: number;
  public description?: string;
  public quantity!: number;
  public unit!: string;
  public unit_price!: number;
  public tax_rate!: number;
  public amount!: number;
  public created_at!: Date;
  public created_by?: number;
}

QuotationDetail.init({
  detail_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  quotation_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Quotation,
      key: 'quotation_id'
    },
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'product_id'
    },
    allowNull: false
  },
  description: DataTypes.TEXT,
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unit: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: '個'
  },
  unit_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  tax_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id'
    }
  }
}, {
  sequelize,
  modelName: 'QuotationDetail',
  tableName: 'quotation_details',
  timestamps: false
});

export default QuotationDetail; 