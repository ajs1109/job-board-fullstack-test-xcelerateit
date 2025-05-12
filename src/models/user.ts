import { CreateUser, User } from '@/types/user';
import { DataTypes, Model } from 'sequelize';
import sequelize from '@/lib/db';
import bcrypt from 'bcryptjs';

class UserModel extends Model<User, CreateUser> implements User {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'employer' | 'job_seeker';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

    public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('employer', 'job_seeker'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'user',
    timestamps: true,
    hooks: {
      beforeCreate: async (user: UserModel) => {
        if (user.dataValues.password) {
          user.dataValues.password = await bcrypt.hash(user.dataValues.password, 10);
          user.password = user.dataValues.password;
        }
      },
      beforeUpdate: async (user: UserModel) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

export default UserModel;