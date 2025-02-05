import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Customer extends Model {
  public customer_id!: number;
  public customer_code!: string;
  public name!: string;
  public contact_person!: string | null;
  public phone!: string | null;
  public email!: string | null;
  public address!: string | null;
  public postal_code!: string | null;
  public tax_id!: string | null;
  public payment_terms!: number | null;
  public payment_due_days!: number | null;
  public notes!: string | null;
  public is_active!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
  public created_by!: number | null;
  public updated_by!: number | null;
}

Customer.init(
  {
    customer_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_code: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    contact_person: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    postal_code: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    tax_id: {
      type: DataTypes.STRING(13),
      allowNull: true,
    },
    payment_terms: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isIn: [[1, 2, 3, 4, 5]]
      }
    },
    payment_due_days: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isIn: [[0, 30, 60, 90]]
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
  },
  {
    sequelize,
    tableName: 'customers',
    modelName: 'Customer',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// ユーザーとの関連付け
Customer.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Customer.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

export default Customer; 