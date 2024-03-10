import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { FileService, FileType } from './file/file.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { MailService } from '../services/mail/mail.service';
import bcrypt from 'bcryptjs'
import { TokenService } from './services/token/token.service';
import { UserDto } from './dto/user-public.dto';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private fileService: FileService,
    private mailService: MailService,
    private tokenService: TokenService,
    private configService: ConfigService,
  ) {
  }

  async create(dto: CreateUserDto, picture): Promise<any> {
    const condidate = await this.userModel.findOne({email: dto.email})
    if (!condidate) {
      const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
      dto.password = await bcrypt.hash(dto.password, 3);

      const creatUser = await this.userModel.create(
        {
          ...dto,
          listens: 0,
          picture: picturePath,
          activationLink: 'test',
          lastActivity: 'test',
          created: 'test'
        })


      this.mailService.sendActivationMail(dto.email, uuidv4());

      const userDto = new UserDto(creatUser);
      const tokens = this.tokenService.generateTokens({...userDto});
      await this.tokenService.saveToken(userDto.id, tokens);

      const result = async () => {
        return {
        ...userDto,
        ...tokens
        }
      }

      return  {
        ...userDto,
        ...tokens
      };
    } else {
      throw new Error(`Пользователь с email ${dto.email} существует`)
    }
  }

  async login(dto: UserLoginDto): Promise<User> {
    return await this.userModel.create({});
  }

  async logout(): Promise<User> {
    return await this.userModel.create({});
  }

  async activate(link: string): Promise<User> {
    return await this.userModel.create({});
  }

  async deleteAllUsers(): Promise<null> {
    if (this.configService.get('MODE') === 'DEV') {
      await this.tokenService.removeAll();
      await this.userModel.deleteMany();
    }
    return null;
  }
}
