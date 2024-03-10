import mongoose, { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';

export class UserDto {
  email: string;
  id: mongoose.Types.ObjectId;
  isActivated: boolean;

  constructor(model: UserDocument) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
  }
}
