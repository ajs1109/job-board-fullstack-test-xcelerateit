import { BaseJob, CreateJob } from '@/types/job';
import { DataTypes, Model } from 'sequelize';
import sequelize from '@/lib/db';
import User from './user';

class JobModel extends Model<BaseJob, CreateJob> implements BaseJob {
  public id!: number;
  public title!: string;
  public description!: string;
  public location!: string;
  public skills!: string[];
  public employerId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

JobModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    employerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'job',
    timestamps: true,
  }
);

// Associations
User.hasMany(JobModel, { foreignKey: 'employerId' });
JobModel.belongsTo(User, { foreignKey: 'employerId' });

export default JobModel;