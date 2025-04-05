import { Request, Response } from 'express';
import { prisma } from '../customClients';

export async function transfersRoute(
  req: Request,
  res: Response
): Promise<void> {
  const pixi = await prisma.account.findFirst({
    where: {
      clientId: req.client?.id,
    },
    select: {
      pixi: true,
    },
  });

  if (!pixi) {
    res.status(404).json({ error: 'Account not found' });
    return;
  }

  try {
    const SentTransfers = await prisma.transfer.findMany({
      where: {
        fromPixi: pixi.pixi,
      },
    });
    const ReceivedTransfers = await prisma.transfer.findMany({
      where: {
        toPixi: pixi.pixi,
      },
    });

    res.json({ sent: SentTransfers, received: ReceivedTransfers });
    return;
  } catch (_error) {
    res.json({
      sent: [],
      received: [],
    });
    return;
  }
}
