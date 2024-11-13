import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UserRepository } from './user.repository';
import { PostgresErrorCode } from 'src/infra/postgres-error-code';
import { AuthDto } from './dto/auth.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RecoveryDto } from './dto/recovery.dto';
import { UserResponseDto } from './dto/UserResponse.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const createUser = instanceToPlain(createUserDto);
    const user = plainToInstance(CreateUserDto, createUser);

    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(createUserDto.password, salt);

    user.password = hash;

    let userResult = null,
      exception = null;
    try {
      userResult = await this.userRepository.createUser(user);
      const payload = {
        id: userResult.id,
        name: userResult.name,
      };
      const token = await this.jwtService.signAsync(payload);
      if (userResult.email) {
        await this.emailService.sendEmail({
          to: userResult.email,
          from: 'rafa.azevedo7777@gmail.com',
          text: 'Confirme sua conta no link abaixo',
          subject: 'Confirmação de conta no AegisAPI',
          html: `<a href="http://localhost:4000/user/active?token=${token}">Click aqui para confirmar</a>`,
        });
      }
    } catch (error: any) {
      console.log({ code: error?.code });
      console.log({ code: error?.code });
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        let errorMessage = '';

        if (
          error?.detail?.indexOf(
            'Unique constraint failed on the fields: (`cpf`)',
          ) !== -1
        ) {
          errorMessage = 'cpf já está sendo utilizado';
        }

        if (
          error?.detail?.indexOf(
            'Unique constraint failed on the fields: (`email`)',
          ) !== -1
        ) {
          errorMessage = 'email já está sendo utilizado';
        }

        exception = new HttpException(errorMessage, HttpStatus.CONFLICT);
      } else {
        exception = new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    if (exception) throw exception;

    const userLiteral = instanceToPlain(userResult);
    const userDto = plainToInstance(UserResponseDto, userLiteral, {
      excludeExtraneousValues: true,
    });

    return userDto;
  }

  async signIn(signInDto: SignInDto): Promise<AuthDto> {
    const { email, password } = signInDto;

    const userByEmail = await this.userRepository.findOneByEmail(email);

    const errorMessage = 'Email ou senha incorretos.';

    if (!userByEmail) {
      throw new UnauthorizedException(errorMessage);
    }

    const match = await bcrypt.compare(password, userByEmail?.password);

    if (!match) {
      throw new UnauthorizedException(errorMessage);
    }

    console.log({ userByEmail });
    const literalUser = instanceToPlain(userByEmail);
    const usuarioDto = plainToInstance(CreateUserDto, literalUser, {
      excludeExtraneousValues: true,
    });

    const payload = {
      id: userByEmail.id,
      name: userByEmail.name,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const authDto = new AuthDto(usuarioDto, accessToken);

    return authDto;
  }

  async delete(email: string): Promise<any> {
    try {
      await this.userRepository.deleteByEmail(email);
      return 'account deleted';
    } catch (error: any) {
      console.log(error);
      throw new error('falha');
    }
  }

  async activeUser(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const id = payload['id'];
      await this.userRepository.update(id, {
        active: true,
      });
      return 'account confirmmed';
    } catch (error: any) {
      console.log(error);
      throw new error('falha');
    }
  }

  async recovery(recoveryDto: RecoveryDto): Promise<string> {
    const { email, password, token } = recoveryDto;

    const payload = await this.jwtService.verifyAsync(token);
    const id = payload['id'];

    const userByEmail = await this.userRepository.findOneByEmail(email);

    const errorMessage = 'Email incorreto.';

    if (!userByEmail) {
      throw new UnauthorizedException(errorMessage);
    }
    if (id !== userByEmail.id) {
      throw new UnauthorizedException('Invalid Token!');
    }

    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    await this.userRepository.update(id, {
      password: hash,
    });

    return 'password updated';
  }
}
