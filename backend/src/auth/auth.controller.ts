import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/**
 * Auth Controller
 * Protects /auth/register and /auth/login endpoints with rate limiting
 * to prevent brute force attacks
 */
@Controller('auth')
@UseGuards(ThrottlerGuard) // Enables rate limiting globally for auth routes
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register endpoint
   * Limits: 5 requests per minute, 10 requests per 10 minutes
   */
  @Post('register')
  @Throttle({ short: { limit: 5, ttl: 60000 }, medium: { limit: 10, ttl: 600000 } })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * Login endpoint
   * Limits: 5 requests per minute, 10 requests per 10 minutes
   * Protects against brute force password attacks
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 5, ttl: 60000 }, medium: { limit: 10, ttl: 600000 } })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
