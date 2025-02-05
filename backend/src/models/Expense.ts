import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Expense extends Model {
  public expense_id!: number;
  public expense_number!: string;
  public invoice_number!: string | null;
  public applicant_id!: number;
  public department!: string;
  public expense_date!: Date;
  public receipt_date!: Date;
  public amount!: number;
  public category!: string;
  public payment_method!: string;
  public description!: string | null;
  public purpose!: string;
  public receipt_image_url!: string | null;
  public status!: string;
  public created_at!: Date;
  public updated_at!: Date;
  public created_by!: number | null;
  public updated_by!: number | null;
}

Expense.init(
  {
    expense_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    expense_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    invoice_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    applicant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    department: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    expense_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    receipt_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('transportation', 'meals', 'supplies', 'books', 'others'),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM('bank_transfer', 'credit_card', 'cash', 'cashless'),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    purpose: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    receipt_image_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', '申請中', '承認済', '否認', '精算済'),
      allowNull: false,
      defaultValue: 'draft',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
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
    tableName: 'expenses',
    modelName: 'Expense',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Expense; 