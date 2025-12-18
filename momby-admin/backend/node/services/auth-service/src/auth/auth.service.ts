import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    const tokens = await this.generateTokens(payload);

    return {
      user,
      ...tokens,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const tokens = await this.generateTokens(payload);

    return {
      user,
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException();
      }

      const newPayload = { email: user.email, sub: user.id, role: user.role };
      return this.generateTokens(newPayload);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    // Invalidate token (implement token blacklist with Redis)
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    // Generate reset token and send email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return { message: 'If email exists, a reset link has been sent' };
    }

    // Generate reset token and save to database
    // Send email with reset link
    return { message: 'If email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, password: string) {
    // Verify token and reset password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Update user password in database
    return { message: 'Password reset successfully' };
  }

  async verifyEmail(token: string) {
    // Verify email token
    return { message: 'Email verified successfully' };
  }

  async getProfile(userId: string) {
    return this.usersService.findOne(userId);
  }

  async updateProfile(userId: string, updateData: any) {
    return this.usersService.update(userId, updateData);
  }

  async enableMFA(userId: string) {
    // Generate MFA secret
    return { secret: 'generated-secret', qrCode: 'qr-code-url' };
  }

  async verifyMFA(userId: string, code: string) {
    // Verify MFA code
    return { verified: true };
  }

  private async generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}

