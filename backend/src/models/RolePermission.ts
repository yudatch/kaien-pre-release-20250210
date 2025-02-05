import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class RolePermission extends Model {
  public role_permission_id!: number;
  public role!: 'admin' | 'manager' | 'staff';
  public permission_id!: number;
  public created_at!: Date;
}

RolePermission.init(
  {
    role_permission_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM('admin', 'manager', 'staff'),
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'permissions',
        key: 'permission_id',
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'role_permissions',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['role', 'permission_id'],
      },
    ],
  }
);

export default RolePermission; 