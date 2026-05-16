import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";

const prisma = new PrismaClient();

interface AccountReq {
  name: string,
  type: string
}

interface AccountParams {
  id: string
}

export const list: RequestHandler = async (req, res): Promise<void> => {
  const email = (req as any)?.user?.email;
  const user = await prisma.user.findUnique({ where: { email }});

  if (!user) {
    res.status(401).json({message: 'User auth failed'})
    return
  }

  const accounts = await prisma.account.findMany({where: { userId: user?.id }})
  res.status(200).json({ accounts })
  return
}

export const create: RequestHandler = async (req, res) => {
  const email = (req as any)?.user?.email;
  const user = await prisma.user.findUnique({ where: { email }});

  if (!user) {
    return res.status(401).json({message: 'User auth failed'});
  }

  const { name, type }: AccountReq = req.body;

  if (!name ) {
    console.error('Missing name');
    return res.status(400).json({message: ' Account not created'});
  }

  if (!type) {
    console.error('Missing type');
    return res.status(400).json({message: 'Account not created'});
  }

  const account = await prisma.account.create({
    data: {
      name,
      type,
      user: { connect: {id: user.id }},
    }
  })

  return res.status(200).json({ account })
}

export const update: RequestHandler = async (req, res) => {
  const email = (req as any)?.user?.email;
  const user = await prisma.user.findUnique({ where: { email }});

  if (!user) {
    return res.status(401).json({message: 'User auth failed'});
  }

  const { name, type }: AccountReq = req.body;

  if (!name ) {
    return res.status(400).json({message: 'Bad Request: Name'});
  }

  if (!type) {
    return res.status(400).json({message: 'Bad Request: Type'});
  }

  const { id } = req.params as any as AccountParams;

  try {
    const account = await prisma.account.update({
      where: { id },
      data: {
        name,
        type,
        user: { connect: {id: user.id }},
      }
   })
   return res.status(200).json({ account });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}

export const deleteAccount: RequestHandler = async (req, res): Promise<void> => {
  const { id } = req.params as any as AccountParams;
  const account = await prisma.account.findUnique({ where: { id }});

  if (!account) {
    res.status(400).json({message: 'Bad Request: Account'})
    return
  }

  try {
    await prisma.transaction.deleteMany({where: { accountId: account.id }});
    console.log(`Transactions with account id ${id} deleted`);

    await prisma.account.delete({
      where: {id}
    });
    console.log(`Account ${id} deleted`);

  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }

  res.status(200).json('Account Deleted')
  return
}