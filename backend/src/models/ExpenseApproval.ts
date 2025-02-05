import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Expense from './Expense';

class ExpenseApproval extends Model {
  public approval_id!: number;
  public expense_id!: number;
  public approver_id!: number;
  public status!: string;
  public comment!: string | null;
  public created_at!: Date;
  public updated_at!: Date;

  // 承認者情報を取得するための関連付けメソッド
  public getApprover!: () => Promise<User>;
}

ExpenseApproval.init(
  {
    approval_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    expense_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'expenses',
        key: 'expense_id',
      },
    },
    approver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    status: {
      type: DataTypes.ENUM('承認済', '否認'),
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
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
  },
  {
    sequelize,
    tableName: 'expense_approvals',
    modelName: 'ExpenseApproval',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// 関連付けの設定
ExpenseApproval.belongsTo(Expense, {
  foreignKey: 'expense_id',
  as: 'RelatedExpense',
});

ExpenseApproval.belongsTo(User, {
  foreignKey: 'approver_id',
  as: 'Approver',
  // 承認者の情報を取得する際に必要なフィールドを指定
  scope: {
    attributes: ['user_id', 'username', 'email']
  }
});

export default ExpenseApproval; 