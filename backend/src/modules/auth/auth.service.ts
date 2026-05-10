import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { QueryFailedError } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export type AuthResponse = {
  access_token: string;
  user: SafeUser;
};

type SafeUser = {
  id: string;
  email: string;
  role: User['role'];
  createdAt: Date;
};

interface JwtPayload {
  sub: string;
  email: string;
  role: User['role'];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterDto): Promise<AuthResponse> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const hashedPassword = await hash(input.password, 10);

    const user = this.usersService.create({
      email: normalizedEmail,
      password: hashedPassword,
    });

    try {
      const savedUser = await this.usersService.save(user);
      return this.buildAuthResponse(savedUser);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { code?: string }).code === '23505'
      ) {
        throw new ConflictException('Email is already registered');
      }
      throw new InternalServerErrorException('Could not register user');
    }
  }

  async login(credentials: LoginDto): Promise<AuthResponse> {
    const normalizedEmail = credentials.email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(normalizedEmail);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await compare(credentials.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  async me(userId: string): Promise<SafeUser> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.toSafeUser(user);
  }

  private async buildAuthResponse(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: this.toSafeUser(user),
    };
  }

  private toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
