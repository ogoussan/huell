import { MongooseModuleOptions } from '@nestjs/mongoose';

const mongoURI = process.env.MONGO_URI;

export const mongooseConnection: MongooseModuleOptions = {
  uri: mongoURI,
};
