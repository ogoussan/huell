import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { mongooseConnection } from './database.config';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  public createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    return mongooseConnection;
  }
}
