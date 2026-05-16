import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";

const prisma = new PrismaClient();

interface Category {
  name: string
}

export const list: RequestHandler = async (req, res): Promise<void> => {
  const email = (req as any)?.user?.email;
  const user = await prisma.user.findUnique({ where: { email }});

  if (!user) {
    res.status(401).json({message: 'User auth failed'})
    return
  }

  const categories = await prisma.category.findMany({where: { userId: user?.id }})
  res.status(200).json({ categories })
  return
}

export const create: RequestHandler = async (req, res): Promise<void> => {
  const email = (req as any)?.user?.email;
  const user = await prisma.user.findUnique({ where: { email }});

  if (!user) {
    res.status(401).json({message: 'User auth failed'})
    return
  }

  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: 'Category not created'});
    return;
  }

  const categoryExists = await prisma.category.findFirst({
    where: {name, userId: user.id}
  });

  if (categoryExists) {
    console.error(`Category with user ${user.id} & name ${name} already exists. Try udpating`)
    res.status(400).json({message: "Category creation failed"})
  }

  const category = await prisma.category.create({
    data: {
      name,
      userId: user?.id
    }
  })

  res.status(200).json({ category })
  return
}

export const update: RequestHandler = async (req, res) => {
  const email = (req as any)?.user?.email;
  const user = await prisma.user.findUnique({ where: { email }});

  if (!user) {
    return res.status(401).json({message: 'Auth failed'})
  }

  try {
    const { id } = req.params as any;
    const { name } = req.body as any as Category;

    const category = await prisma.category.update({
      where: { id },
      data: {
        userId: user.id,
        name
      },
    })
    return res.status(200).json({ message: category});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Update failed'});
  }
}

export const deleteCategory: RequestHandler = async(req, res) => {
  const { id } = req.params as any;
  const category = await prisma.category.findUnique({
    where: { id }
  });

  if (!category) {
    console.error(`Category ${id} doesn't exist in DB`);
    return res.status(400).json({message: 'Delete failed'});
  }

  try {
    await prisma.budget.deleteMany({
      where: { categoryId: id },
    }),

    await prisma.transaction.deleteMany({
      where: { categoryId: id }
    });

    console.log(`Transactions with category id ${id} deleted`);

    await prisma.category.delete({
     where: { id }
    });

    console.log(`Category ${id} deleted`);
    return res.status(200).json("Deleted")
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: 'Delete failed'})
  }
}