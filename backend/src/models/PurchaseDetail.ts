import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Purchase from './Purchase';
import Product from './Product';

class PurchaseDetail extends Model {
  public detail_id!: number;
  public purchase_id!: number;
  public product_id!: number;
  public description?: string;
  public quantity!: number;
  public unit_price!: number;
  public tax_rate!: number;
  public amount!: number;
  public created_at!: Date;
  public created_by?: number;
}

PurchaseDetail.init({
  detail_id: {
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
  modelName: 'PurchaseDetail',
  tableName: 'purchase_details',
  timestamps: false
});

export default PurchaseDetail; 