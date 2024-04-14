import { ApiProperty } from '@nestjs/swagger';
import { Document } from '../interfaces';

export class DocumentDto implements Document {
  @ApiProperty({ readOnly: true })
  public readonly _id!: string;

  @ApiProperty({ readOnly: true, type: Date })
  public readonly created_at!: Date;

  @ApiProperty({ readOnly: true, type: Date })
  public readonly updated_at!: Date;
}
