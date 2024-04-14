import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ResponseError } from '../interfaces';
import { Response } from 'express';
import { Error as MongooseError } from 'mongoose';

@Catch(MongooseError)
export class MongooseExceptionFilter implements ExceptionFilter {
  private logger = new Logger('HTTP');

  public catch(exception: MongooseError, host: ArgumentsHost): void {
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = [this.generateMessage(exception)];

    try {
      switch (exception.name) {
        case 'ValidationError':
          // Handle validation errors (e.g., missing required fields)
          throw new ConflictException(message);
        case 'CastError':
          // Handle cast errors (e.g., invalid ObjectId)
          throw new NotFoundException(message);
        default:
          // Handle all other Mongoose errors
          throw new InternalServerErrorException([exception.name, message]);
      }
    } catch (error) {
      const body = this.generateBody(error);
      response.status(body.statusCode).send(body);
    }
  }

  private generateBody(exception: HttpException): ResponseError {
    return exception.getResponse() as ResponseError;
  }

  private generateMessage(exception: MongooseError): string {
    return exception.message;
  }
}
