import * as jwt from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from '../../schemas/token.schema';

export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private configService: ConfigService
  ) {
  }

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, this.configService.get('JWT_ACCESS_SECRET'), {expiresIn: '30m'});
    const refreshToken = jwt.sign(payload, this.configService.get('JWT_REFRESH_SECRET'), {expiresIn: '30d'});

    return {
      accessToken,
      refreshToken,
    }
  }
  async saveToken(userId, refreshToken) {
    const tokenData = await this.tokenModel.findOne({user: userId})
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    return await this.tokenModel.create({ user: userId, refreshToken });
  }

  async removeAll() {
    await this.tokenModel.deleteMany();
    return null;
  }
}
