import { Document } from '../interfaces';
import { Prop, Schema } from '@nestjs/mongoose';
import { now, Document as MongoDocument } from 'mongoose';

@Schema()
export class DocumentEntity extends MongoDocument implements Document {
  @Prop({ default: now() })
  public readonly created_at!: Date;

  @Prop({ default: now() })
  public readonly updated_at!: Date;
}
