import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { takeFirst, takeFirstOrThrow } from '@/library/drizzle';
import { ConflictError } from '@/library/errors';
import { hashPassword } from './lib';
import { NewUser, users } from './model';
import { CreateUserDto, UpdateUserDto } from './schema';

export class UserService {
  private readonly db = db;

  async validateEmail(email: string) {
    const existingUser = takeFirst(await this.db.select().from(users).where(eq(users.email, email)));
    if (existingUser) {
      throw new ConflictError('Email already exists');
    }
  }

  async getAllUsers() {
    return this.db.select().from(users);
  }

  async getUserById(id: string) {
    return takeFirstOrThrow(await this.db.select().from(users).where(eq(users.id, id)));
  }

  async createUser(user: CreateUserDto) {
    await this.validateEmail(user.email);

    const hashedPassword = await hashPassword(user.password);
    const newUser: NewUser = {
      name: user.name,
      email: user.email,
      passwordHash: hashedPassword,
    };
    return takeFirstOrThrow(await this.db.insert(users).values(newUser).returning());
  }

  async updateUser(id: string, { password, ...user }: UpdateUserDto) {
    if (user.email) {
      await this.validateEmail(user.email);
    }

    const newUser: Partial<NewUser> = { ...user };
    if (password) {
      newUser.passwordHash = await hashPassword(password);
    }
    return takeFirstOrThrow(await this.db.update(users).set(newUser).where(eq(users.id, id)).returning());
  }

  async deleteUser(id: string) {
    return takeFirstOrThrow(await this.db.delete(users).where(eq(users.id, id)).returning());
  }
}
