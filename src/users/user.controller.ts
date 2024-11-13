import { Controller, Post, Body, Query, Delete, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UserResponseDto } from './dto/UserResponse.dto';
import { AuthDto } from './dto/auth.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RecoveryDto } from './dto/recovery.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('Usuários')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('signup')
  create(@Body() createUsuarioDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUsuarioDto);
  }

  @Public()
  @Get('active')
  activeUser(@Query('token') token: string): Promise<AuthDto> {
    return this.userService.activeUser(token);
  }

  @Public()
  @Post('login')
  signIn(@Body() data: SignInDto): Promise<AuthDto> {
    return this.userService.signIn(data);
  }

  @Public()
  @Post('recovery')
  recovery(@Body() data: RecoveryDto): Promise<string> {
    return this.userService.recovery(data);
  }

  @Delete('email')
  deleteByEmail(@Query('email') email: string): Promise<string> {
    return this.userService.delete(email);
  }
}
