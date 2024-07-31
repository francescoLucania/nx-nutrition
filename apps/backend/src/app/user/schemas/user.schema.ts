import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Gender } from '@nx-nutrition-models';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({unique: true, required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({unique: true, required: true})
  phone: string;

  @Prop({unique: true, required: true})
  name: string;

  @Prop({unique: true, required: true})
  fullName: string;

  @Prop({type: String, unique: true, required: true})
  gender: Gender;

  @Prop({unique: true, required: true})
  dateIssue: string;

  @Prop({unique: true, required: true})
  created: string;

  @Prop({unique: true, required: true})
  lastActivity: string;

  @Prop({unique: true, required: true, default: false})
  isActivated: boolean;

  @Prop({unique: false, required: false})
  activationLink: string;

  _id: mongoose.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
