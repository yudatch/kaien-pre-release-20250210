import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Seal extends Model {
  public seal_id!: number;
  public user_id!: number;
  public seal_image_path!: string;
  public seal_type!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

Seal.init({
  seal_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id'
    },
    allowNull: false
  },
  seal_image_path: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  seal_type: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Seal',
  tableName: 'seals',
  timestamps: false
});

export default Seal; 