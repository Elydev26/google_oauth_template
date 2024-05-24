import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import {
  ArraySchema,
  BooleanSchema,
  NumberSchema,
  ObjectSchema,
  StringSchema,
} from 'joi';
import { ObjectId } from 'mongodb';

@Injectable()
export class ObjectValidationPipe implements PipeTransform {
  constructor(private readonly schema: ObjectSchema) {}
  async transform(data: any): Promise<void> {
    try {
      const value = await this.schema
        .unknown(false)
        .validateAsync(data, { stripUnknown: true });
      return value;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

@Injectable()
export class ArrayValidationPipe implements PipeTransform {
  constructor(private readonly schema: ArraySchema) {}
  async transform(data: any) {
    try {
      const value = await this.schema.validateAsync(data, {
        stripUnknown: true,
        convert: false,
      });
      return value;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

@Injectable()
export class StringValidationPipe implements PipeTransform {
  constructor(private readonly schema: StringSchema) {}
  async transform(data: any) {
    try {
      const value = await this.schema.validateAsync(data);
      return value;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

@Injectable()
export class BooleanValidationPipe implements PipeTransform {
  constructor(private readonly schema: BooleanSchema) {}
  async transform(data: any) {
    try {
      const value = await this.schema.validateAsync(data);
      return value;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

@Injectable()
export class NumberValidationPipe implements PipeTransform {
  constructor(private readonly schema: NumberSchema) {}
  async transform(data: any) {
    try {
      const value = await this.schema.validateAsync(data);
      return value;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

@Injectable()
export class ValidateId implements PipeTransform<string, ObjectId>{
  
  transform(value: string): ObjectId {
    try {
      const newValue = new ObjectId(value);
      return newValue;
    } catch (error) {
      console.log(error)
      throw new BadRequestException("Invalid Id Provided");
    }
  }
}
