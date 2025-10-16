import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Login do usuário realizado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async register(@Req() req, @Body() dto: CreateUserDto) {
    const user = await this.authService.createUser(dto);

    return new UserResponseDto(user);
  }
}
