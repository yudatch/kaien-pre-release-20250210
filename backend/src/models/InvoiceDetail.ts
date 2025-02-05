import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Invoice from './Invoice';
import Product from './Product';

class InvoiceDetail extends Model {
  public detail_id!: number;
  public invoice_id!: number;
  public product_id!: number;
  public description!: string;
  public quantity!: number;
  public unit!: string;
  public unit_price!: number;
  public tax_rate!: number;
  public amount!: number;
  public created_at!: Date;
  public created_by!: number;
}

InvoiceDetail.init(
  {
    detail_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'product_id',
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: '個'
    },
    unit_price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    tax_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
  },
  {
    sequelize,
    tableName: 'invoice_details',
    timestamps: false,
  }
);

// リレーションの設定
InvoiceDetail.belongsTo(Invoice, {
  foreignKey: 'invoice_id',
  as: 'Invoice',
  constraints: false
});

InvoiceDetail.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'Product',
});

export default InvoiceDetail; 