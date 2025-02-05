import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import PurchaseOrder from './PurchaseOrder';
import Product from './Product';
import { DeliveryStatus, DELIVERY_STATUSES } from '../types/enums';

class PurchaseOrderDetail extends Model {
  public detail_id!: number;
  public order_id!: number;
  public product_id!: number;
  public description?: string;
  public quantity!: number;
  public unit_price!: number;
  public tax_rate!: number;
  public amount!: number;
  public delivery_status!: DeliveryStatus;
  public received_quantity!: number;
  public received_date?: Date;
  public created_at!: Date;
  public created_by?: number;
}

PurchaseOrderDetail.init({
  detail_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    references: {
      model: PurchaseOrder,
      key: 'order_id'
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
  delivery_status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending',
    validate: {
      isIn: [DELIVERY_STATUSES]
    }
  },
  received_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  received_date: DataTypes.DATE,
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
  modelName: 'PurchaseOrderDetail',
  tableName: 'purchase_order_details',
  timestamps: false
});

export default PurchaseOrderDetail; 