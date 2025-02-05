import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class ContactHistory extends Model {
  public contact_id!: number;
  public customer_id!: number;
  public contact_date!: Date;
  public contact_method!: string;
  public notes?: string;
  public Customer!: { name: string };
}

ContactHistory.init({
  contact_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  contact_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  contact_method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  notes: DataTypes.TEXT
}, {
  sequelize,
  modelName: 'ContactHistory',
  tableName: 'contact_histories',
  timestamps: false
});

export default ContactHistory; 