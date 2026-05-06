import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";

const prisma = new PrismaClient();

export const list: RequestHandler = async (req, res) => {
  const email = (req as any)?.user?.email;
  const user = await prisma.user.findUnique({ where: { email }});

  if (!user) {
    return res.status(401).json({message: 'User not found'})
  }

  const transactions = await prisma.transaction.findMany({where: { userId: user?.id }})
  return res.status(200).json({ transactions })
}

export const create: RequestHandler = async (req, res) => {
  const email = (req as any)?.user?.email;
  const user = await prisma.user.findUnique({ where: { email }});

  if (!user) {
    return res.status(401).json({message: 'User not found'})
  }

  const { accountId, categoryId, amountCents, date, note } = req.body;

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