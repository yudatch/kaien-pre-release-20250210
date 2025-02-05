import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Permission extends Model {
  public permission_id!: number;
  public name!: string;
  public description!: string;
  public created_at!: Date;
}

Permission.init(
  {
    permission_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'permissions',
    timestamps: false,
  }
);

export default Permission; 