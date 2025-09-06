import { z } from 'zod';
import { genericMessages } from './messages';

export const clientSchema = z.object({
  id: z.uuidv7(),
  name: z.string().min(2).max(100),
  email: z.email(genericMessages.invalidEmail),
  balance: z.number().min(0),
});

export type Client = z.infer<typeof clientSchema>;
