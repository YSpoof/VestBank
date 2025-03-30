import { Request, Response } from 'express';
import { prisma } from '../customClients';
import { messages } from '../messages';

export async function transferRoute(
  req: Request,
  res: Response
): Promise<void> {
  const amount = req.body.amount as number;
  const pixi = req.body.pixi as string;

  if (!amount || !pixi) {
    res.status(400).json({ error: messages.missingFields });
    return;
  }

  if (amount <= 0) {
    res.status(400).json({ error: messages.invalidParams });
    return;
  }

  const sendingAccount = await prisma.account.findFirst({
    where: {
      clientId: req.client!.id,
    },
  });

  if (!sendingAccount) {
    res.status(404).json({ error: messages.accountNotFound });
    return;
  }

  if (sendingAccount.suspended) {
    res.status(403).json({ error: messages.accountSuspended });
    return;
  }

  const receivingAccount = await prisma.account.findFirst({
    where: {
      pixi: req.body.pixi,
    },
  });

  if (!receivingAccount) {
    res.status(404).json({ error: messages.destAccountNotFound });
    return;
  }

  if (receivingAccount.suspended) {
    res.status(403).json({ error: messages.destAccountSuspended });
    return;
  }

  if (sendingAccount.id === receivingAccount.id) {
    res.status(400).json({ error: messages.selfTransfer });
    return;
  }

  const hasSufficientBalance = sendingAccount.balance >= req.body.amount;

  if (!hasSufficientBalance) {
    res.status(400).json({ error: messages.insufficientBalance });
    return;
  }

  const updatedSendingAccount = await prisma.account.update({
    where: {
      id: sendingAccount.id,
    },
    data: {
      balance: sendingAccount.balance - req.body.amount,
    },
  });
  const updatedReceivingAccount = await prisma.account.update({
    where: {
      id: receivingAccount.id,
    },
    data: {
      balance: receivingAccount.balance + req.body.amount,
    },
  });

  const transfer = await prisma.transfer.create({
    data: {
      amount: req.body.amount,
      fromPixi: updatedSendingAccount.pixi,
      toPixi: updatedReceivingAccount.pixi,
    },
  });

  res.json(transfer);
  return;
}
