import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './model';

const InsertUserSchema = createInsertSchema(users).omit({ passwordHash: true, id: true }).extend({ password: z.string() });
export const SelectUserSchema = createSelectSchema(users).omit({ passwordHash: true });

export const CreateUserSchema = InsertUserSchema;
export const UpdateUserSchema = InsertUserSchema.partial();

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
