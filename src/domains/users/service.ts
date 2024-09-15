import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { takeFirstOrThrow } from '@/library/drizzle';
import { hashPassword } from './lib';
import { NewUser, users } from './model';
import { CreateUserDto, UpdateUserDto } from './schema';

export class UserService {
  private readonly db = db;

  async getAllUsers() {
    return this.db.select().from(users);
  }

  async getUserById(id: string) {
    return takeFirstOrThrow(await this.db.select().from(users).where(eq(users.id, id)));
  }

  async createUser(user: CreateUserDto) {
    const hashedPassword = await hashPassword(user.password);
    const newUser: NewUser = {
      name: user.name,
      email: user.email,
      passwordHash: hashedPassword,
    };
    return takeFirstOrThrow(await this.db.insert(users).values(newUser).returning());
  }

  async updateUser(id: string, { password, ...user }: UpdateUserDto) {
    const newUser: Partial<NewUser> = { ...user };
    if (password) {
      newUser.passwordHash = await hashPassword(password);
    }
    return takeFirstOrThrow(await this.db.update(users).set(user).where(eq(users.id, id)).returning());
  }

  async deleteUser(id: string) {
    return takeFirstOrThrow(await this.db.delete(users).where(eq(users.id, id)).returning());
  }
}
