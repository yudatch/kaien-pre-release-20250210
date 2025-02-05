import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Project from './Project';
import InvoiceDetail from './InvoiceDetail';
import Quotation from './Quotation';

// ENUMの型定義を追加
export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'cancelled' | 'overdue';

class Invoice extends Model {
  public invoice_id!: number;
  public invoice_number!: string;
  public project_id!: number;
  public quotation_id!: number;
  public issue_date!: Date;
  public due_date!: Date;
  public subtotal!: number;
  public tax_amount!: number;
  public total_amount!: number;
  public status!: InvoiceStatus;
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
  public InvoiceDetails?: InvoiceDetail[];
  public Quotation?: Quotation;
}

Invoice.init({
  invoice_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  invoice_number: {
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
  quotation_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  issue_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  due_date: {
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
    type: DataTypes.ENUM('draft', 'issued', 'paid', 'cancelled', 'overdue'),
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
  modelName: 'Invoice',
  tableName: 'invoices',
  timestamps: false
});

export default Invoice; 