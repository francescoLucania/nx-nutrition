import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import {ConfigService} from '@nestjs/config';
import { AppService } from './app.service';
import { ServeStaticModule } from "@nestjs/serve-static";
import path from "path";
import {MongooseModule} from "@nestjs/mongoose";

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({rootPath: path.resolve(__dirname, 'static ')}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        console.log(config.get('DATABASE_URL'))
        return ({
          uri: config.get('DATABASE_URL'),
        })
      },
      inject: [ConfigService],
    }),
  ]
})
export class AppModule {
}
