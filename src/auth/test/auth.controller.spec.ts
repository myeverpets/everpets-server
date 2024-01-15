import { TestBed } from '@automock/jest';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dtos/login.dto';
import { User } from '@prisma/client';
import { Response, Request } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('AuthController', () => {
  let authController: AuthController;

  let mockedAuthService: jest.Mocked<AuthService>;

  const mockedUser: User = {
    userId: 1,
    firstName: 'John',
    lastName: 'Doe',
    userBio: 'Lorem ipsum',
    phoneNumber: '+380953455421',
    email: 'johndoe@example.com',
    password: 'hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const mockedResponse = {
    status: jest.fn().mockReturnThis(),
    cookie: jest.fn(),
    json: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;

  const mockedAccessToken = 'mockedAccessToken';
  const mockedRefreshToken = 'mockedRefreshToken';

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(AuthController).compile();

    authController = unit;

    mockedAuthService = unitRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(AuthController).toBeDefined();
  });

  describe('login', () => {
    it.each([
      {
        email: 'johndoe@example.com',
        password: 'johndoepassword',
      },
      {
        phoneNumber: '+380953661309',
        password: 'johndoepassword',
      },
      {
        email: 'johndoe@example.com',
        phoneNumber: '+380953661309',
        password: 'johndoepassword',
      },
    ])(
      'should successfully log in user with valid email, phone',
      async (loginDto: LoginDto) => {
        mockedAuthService.validateLogin.mockResolvedValue(mockedUser);
        mockedAuthService.generateTokens.mockResolvedValue({
          accessToken: mockedAccessToken,
          refreshToken: mockedRefreshToken,
        });
        await authController.login(loginDto, mockedResponse);

        expect(mockedAuthService.validateLogin).toHaveBeenCalledWith(loginDto);
        expect(mockedAuthService.generateTokens).toHaveBeenCalledWith(
          mockedUser,
        );

        expect(mockedResponse.status).toHaveBeenCalledWith(200);
        expect(mockedResponse.json).toHaveBeenCalledWith({
          accessToken: mockedAccessToken,
        });
        expect(mockedResponse.cookie).toHaveBeenCalledWith(
          'refreshToken',
          mockedRefreshToken,
          expect.any(Object),
          // {
          //   httpOnly: true,
          //   maxAge: 30 * 24 * 60 * 60 * 1000,
          // },
        );
      },
    );
    it.each([
      {
        email: 'invalidEmail@example.com', // invalid email
        password: 'johndoepassword',
      },
      {
        phoneNumber: '+380953445409', // invalid phone number
        password: 'johndoepassword',
      },
      {
        email: 'invalidEmail@example.com',
        password: 'invalidpassword', //invalid password
      },
    ])(
      'should fail login with an invalid email, phone or password',
      async (loginDto: LoginDto) => {
        mockedAuthService.validateLogin.mockResolvedValue(null);

        await expect(
          authController.login(loginDto, mockedResponse),
        ).rejects.toThrow(
          new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED),
        );
      },
    );
  });

  describe('register', () => {
    it('should successfully register user', async () => {
      const registerCredentials: RegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+380953455421',
        email: 'john.doe@example.com',
        password: 'securepassword',
      };

      mockedAuthService.register.mockResolvedValue(mockedUser);
      mockedAuthService.generateTokens.mockResolvedValue({
        accessToken: mockedAccessToken,
        refreshToken: mockedRefreshToken,
      });

      await authController.register(registerCredentials, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(200);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        accessToken: mockedAccessToken,
      });
      expect(mockedResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockedRefreshToken,
        expect.any(Object),
        // {
        //   httpOnly: true,
        //   maxAge: 30 * 24 * 60 * 60 * 1000,
        // },
      );
    });

    it('should return 409 with already existing data', async () => {
      const registerCredentials: RegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+380953455421',
        email: 'alreadyexists@example.com',
        password: 'securepassword',
      };

      mockedAuthService.register.mockReturnValue(null);

      await expect(
        authController.register(registerCredentials, mockedResponse),
      ).rejects.toThrow(
        new HttpException(
          'User with this phone number or email already exists',
          HttpStatus.CONFLICT,
        ),
      );
    });
    it('should return 400 with invalid RegisterDto field', async () => {
      const wrongRegisterCredentials: RegisterDto = {
        firstName: '',
        lastName: ' ',
        phoneNumber: '+3809231',
        email: '',
        password: '123',
      };
      const registerCredentials = plainToInstance(
        RegisterDto,
        wrongRegisterCredentials,
      );

      const errors = validate(registerCredentials);

      expect((await errors).length).not.toBe(0);
    });
  });

  describe('refresh tokens', () => {
    it('should successfully refresh tokens', async () => {
      const mockedRefreshRequest = {
        user: mockedUser,
      } as unknown as Request;

      mockedAuthService.generateTokens.mockResolvedValue({
        accessToken: mockedAccessToken,
        refreshToken: mockedRefreshToken,
      });

      await authController.refresh(mockedRefreshRequest, mockedResponse);

      expect(mockedResponse.clearCookie).toHaveBeenCalledWith('refreshToken');
      expect(mockedResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockedRefreshToken,
        expect.any(Object),
      );
      expect(mockedResponse.json).toHaveBeenCalledWith({
        accessToken: mockedAccessToken,
      });
    });
  });

  describe('logout', () => {
    it('should successfully log out', () => {
      const mockedLogoutResponse = {
        clearCookie: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;

      authController.logOut(mockedLogoutResponse);

      expect(mockedLogoutResponse.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
      );
      expect(mockedLogoutResponse.json).toHaveBeenCalled();
    });
  });
});
