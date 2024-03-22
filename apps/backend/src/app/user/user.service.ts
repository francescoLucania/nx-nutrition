import { Model } from 'mongoose';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
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
import ValidationException from '../exception/validation/validation';

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

  async create(dto: CreateUserDto): Promise<any> {
    const searchByEmail = await this.userModel.findOne({email: dto.email});
    const searchByPhone = await this.userModel.findOne({email: dto.email});
    const user = searchByEmail || searchByPhone;
    console.log('dto', dto)
    console.log('user', user)
    if (!user) {
      console.log('dto', dto)
      let picturePath;
      dto.password = await bcrypt.hash(dto.password, 3);

      const activationLink = uuidv4();
      const date = new Date();
      const creatUser = await this.userModel.create(
        {
          ...dto,
          listens: 0,
          picture: picturePath ? picturePath : 'unknown.jpg',
          activationLink: activationLink,
          lastActivity: date,
          created: date,
        })


      this.mailService.sendActivationMail(dto.email, `${this.configService.get('DOMAIN')}/api/user/activate?id=${activationLink}`);

      const userDto = new UserDto(creatUser);
      const tokens = this.tokenService.generateTokens({...userDto});
      await this.tokenService.saveToken(userDto.id, tokens);

      return  {
        ...userDto,
        ...tokens
      };
    } else {
      const errorContactType = searchByPhone ? `c телефоном ${dto.phone}` : `c почтой ${dto.email}`;
      throw new ValidationException(`Пользователь ${errorContactType} уже зарегестрирован`)
    }
  }

  saveAvatar(picture) {
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
  }

  async login(dto: UserLoginDto): Promise<User> {
    return await this.userModel.create({});
  }

  async logout(): Promise<User> {
    return await this.userModel.create({});
  }

  async activate(link: string): Promise<User> {
    const activatedCandidate = await this.userModel.findOne({activationLink: link});
    if (activatedCandidate) {
      activatedCandidate.isActivated = true;
      activatedCandidate.activationLink = null;
    } else {
      throw new Error('Некорректная ссылка активации')
    }
    return await activatedCandidate.save();
  }

  async deleteAllUsers(): Promise<null> {
    if (this.configService.get('MODE') === 'DEV') {
      await this.tokenService.removeAll();
      await this.userModel.deleteMany();
    }
    return null;
  }
}
