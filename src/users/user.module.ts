import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthGuard } from './auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '../infra/db.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    EmailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule, PrismaModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: `${configService.getOrThrow('JWT_SECRET')}`,
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN')
            ? `${configService.get('JWT_EXPIRES_IN')}`
            : '1h',
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    {
      provide: APP_GUARD,
      useExisting: AuthGuard,
    },
    AuthGuard,
  ],
  exports: [],
})
export class UsersModule {}
