import { Request, Response } from 'express';
import { prisma } from '../customClients';

export async function debugPostRoute(
  _req: Request,
  res: Response
): Promise<void> {
  const allAccounts = await prisma.account.findMany();
  await Promise.all(
    allAccounts.map(async (account) => {
      await prisma.account.update({
        where: { id: account.id },
        data: {
          balance: account.balance + 10,
        },
      });
    })
  );

  res.json({ message: 'Added money to all accounts.' });
}
