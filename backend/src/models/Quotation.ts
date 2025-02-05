import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Project from './Project';
import QuotationDetail from './QuotationDetail';

// ENUMの型定義を追加
export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

class Quotation extends Model {
  public quotation_id!: number;
  public quotation_number!: string;
  public project_id!: number;
  public issue_date!: Date;
  public valid_until!: Date;
  public subtotal!: number;
  public tax_amount!: number;
  public total_amount!: number;
  public status!: QuotationStatus;
  public notes?: string;
  public created_at!: Date;
  public updated_at!: Date;
  public created_by?: number;
  public updated_by?: number;

  // 関連付けの型定義を追加
  public Project?: Project & {
    Customer?: {
      name: string;
      address: string;
    }
  };
  public QuotationDetails?: QuotationDetail[];
}

Quotation.init({
  quotation_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  quotation_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  project_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Project,
      key: 'project_id'
    },
    allowNull: false
  },
  issue_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  tax_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'accepted', 'rejected', 'expired'),
    defaultValue: 'draft'
  },
  notes: DataTypes.TEXT,
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
  modelName: 'Quotation',
  tableName: 'quotations',
  timestamps: false
});

export default Quotation; 