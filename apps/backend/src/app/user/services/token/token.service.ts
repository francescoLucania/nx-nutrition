import * as jwt from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from '../../schemas/token.schema';

export type TokenType = 'ACCESS_TOKEN' | 'REFRESH_TOKEN';

export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private configService: ConfigService
  ) {
  }

  public generateTokens(payload): {accessToken: string, refreshToken: string} {
    const accessToken = jwt.sign(payload, this.configService.get('JWT_ACCESS_SECRET'), {expiresIn: '30m'});
    const refreshToken = jwt.sign(payload, this.configService.get('JWT_REFRESH_SECRET'), {expiresIn: '30d'});

    return {
      accessToken,
      refreshToken,
    }
  }
  public async saveToken(userId, refreshToken) {
    const tokenData = await this.tokenModel.findOne({user: userId})
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    return await this.tokenModel.create({ user: userId, refreshToken });
  }

  async removeToken(refreshToken: string) {
    await this.tokenModel.deleteOne({refreshToken});
    return null;
  }

  async findToken(refreshToken: string): Promise<TokenDocument | null> {
    const token = await this.tokenModel.findOne({refreshToken});
    return token ? token : null;
  }

  async removeAll(): Promise<null> {
    if (this.configService.get('MODE') === 'DEV') {
      await this.tokenModel.deleteMany();
      return null;
    }
  }

  validateToken(type: TokenType, token: string): TokenDocument {
    console.log('validateToken', token);
    const jwtSecret = type === 'ACCESS_TOKEN' ? 'JWT_ACCESS_SECRET' : 'JWT_REFRESH_SECRET'
    return jwt.verify(token, this.configService.get(jwtSecret))
  }
}
