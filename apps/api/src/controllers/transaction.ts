import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";

export interface TransactionParams {
  id: string;
}

const prisma = new PrismaClient();


export const list: RequestHandler = async (req, res) => {
  const email = (req as any)?.user?.email;
  const user = await prisma.user.findUnique({ where: { email }});

  if (!user) {
    return res.status(401).json({message: 'Auth failed'})
  }

  const transactions = await prisma.transaction.findMany({where: { userId: user.id}})
  return res.status(200).json({ transactions })
}

export const create: RequestHandler = async (req, res) => {
  const email = (req as any)?.user?.email;
  const user = await prisma.user.findUnique({ where: { email }});

  if (!user) {
    return res.status(401).json({message: 'Auth failed'})
  }

  const { accountId, categoryId, amountCents, date, note } = req.body;

  const account = await prisma.account.findUnique({ where: { id: accountId }});
  if (!account) {
    return res.status(401).json({message: 'Auth failed'})
  }

  try {
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        accountId,
        categoryId,
        date: new Date(date),
        amountCents,
        note
      },
    })

    return res.status(201).json({ transaction })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not create transaction" });
  }
}

export const update: RequestHandler = async (req, res) => {
  const email = (req as any)?.user?.email;
  const user = await prisma.user.findUnique({ where: { email }});

  if (!user) {
    return res.status(401).json({message: 'Auth failed'})
  }

  try {
    const { id } = req.params as any as TransactionParams;
    const { accountId, categoryId, amountCents, date, note } = req.body;

    await prisma.transaction.update({
      where: { id },
      data: {
        userId: user.id,
        accountId,
        categoryId,
        date: new Date(date),
        amountCents,
        note
      },
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Update failed'});
  }

  return res.status(200).json({ message: 'Transaction Updated'});
}

export const deleteTransaction: RequestHandler = async (req, res) => {
  const email = (req as any)?.user?.email;
  const user = await prisma.user.findUnique({ where: { email }});

  if (!user) {
    return res.status(401).json({message: 'Auth failed'})
  }

  const { id } = req.params as any as TransactionParams
  const transaction = await prisma.transaction.findUnique({where: {id}});

  if (!transaction) {
    console.error(`Transaction ${id} could not be deleted. Does not exist`);
    return res.status(400).json('Delete failed');
  }

  try {
    await prisma.transaction.delete({
      where: { id }
    });

    return res.status(202).json({ message: 'Transaction deleted' })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Delete failed" });
  }
}