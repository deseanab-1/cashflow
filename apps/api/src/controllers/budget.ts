import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";

const prisma = new PrismaClient();

interface Budget {
  userId: string,
  categoryId: string,
  month: string,
  limitCents: number
}

export const list: RequestHandler = async (req, res): Promise<void> => {
  const email = (req as any)?.user?.email;
  const user = await prisma.user.findUnique({ where: { email }});

  if (!user) {
    res.status(401).json({message: 'User auth failed'})
    return
  }

  const budgets = await prisma.budget.findMany({where: { userId: user?.id }})
  res.status(200).json({ budgets })
  return
}

export const create: RequestHandler = async (req, res) => {
  const errorMessage = 'Budget not created';
  const email = (req as any)?.user?.email;
  const user = await prisma.user.findUnique({ where: { email }});

  if (!user) {
    return res.status(401).json({message: 'User auth failed'});
  }

  const { month, limitCents, categoryId }: Budget = req.body;

  if (!month) {
    console.error('Missing month');
    return res.status(400).json({message: errorMessage});
  }

  if (!limitCents) {
    console.error('Missing limitCents');
    return res.status(400).json({message: errorMessage});
  }

  if (!categoryId) {
    console.error('Missing category id');
    return res.status(400).json({message: errorMessage});
  }

  const category = await prisma.category.findUnique({ where: {id: categoryId}});
  if (!category) {
    console.error(`Cannot find Category ${categoryId}`)
    return res.status(500).json({message: errorMessage})
  }

  try {
    const budget = await prisma.budget.create({
      data: {
        userId: user?.id,
        categoryId,
        month,
        limitCents
      }
    })
    return res.status(200).json({ budget })
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: error});
  }
}

export const update: RequestHandler = async (req, res) => {
  const email = (req as any)?.user?.email;
  const user = await prisma.user.findUnique({ where: { email }});

  if (!user) {
    res.status(401).json({message: 'Auth failed'})
    return;
  }

  try {
    const { id } = req.params as any;
    const { month, limitCents, categoryId } = req.body as any as Budget;

    const budget = await prisma.budget.update({
      where: { id },
      data: {
        userId: user.id,
        month,
        limitCents,
        categoryId
      },
    })

    return res.status(200).json({ message: budget });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Update failed'});
  }

}

export const deleteBudget: RequestHandler = async (req, res) => {
  const { id } = req.params as any;
  const budget = await prisma.budget.findUnique({
    where: { id }
  });

  if (!budget) {
    return res.status(400).json({message: 'Delete failed'})
  }

  try {
    await prisma.transaction.deleteMany({
      where: { categoryId: budget.categoryId }
    });
    console.log(`Transactions with category id ${id} deleted`);

    await prisma.budget.delete({
      where: { id }
     });
    console.log(`Budget ${id} deleted`);

    await prisma.category.delete({
      where: { id: budget.categoryId }
     });
    console.log(`Category ${id} deleted`);

    return res.status(200).json("Deleted")
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: 'Delete failed'})
  }
}