import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  console.log('Seeding...');

  // await prisma.store.deleteMany();
  // await prisma.billboard.deleteMany();
  // await prisma.category.deleteMany();
  // await prisma.size.deleteMany();
  // await prisma.color.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.order.deleteMany();

  const store1 = await prisma.store.create({
    data: {
      name: 'Clothes',
      icon: 'shirt',
      userId: 'user_2S7iUpdFQLpsooyDU8tWnjgcCoK',
      color: 'zinc',
    },
  });

  const store2 = await prisma.store.create({
    data: {
      name: 'Shoe',
      icon: 'shoe',
      userId: 'user_2S7iUpdFQLpsooyDU8tWnjgcCoK',
      color: 'slate',
    },
  });

  const billboards = await prisma.billboard.createMany({
    data: [
      {
        label: 'Jeans',
        storeId: store1.id,
        imageKey: '734e3828-b9ff-485c-adfc-d477220ac4e9.jpeg',
        imageUrl:
          'https://ecommerce-admin-kpirabaharan-billboards.s3.amazonaws.com/734e3828-b9ff-485c-adfc-d477220ac4e9.jpeg',
      },
      {
        label: 'T-Shirts',
        storeId: store1.id,
        imageKey: '734e3828-b9ff-485c-adfc-d477220ac4e9.jpeg',
        imageUrl:
          'https://ecommerce-admin-kpirabaharan-billboards.s3.amazonaws.com/734e3828-b9ff-485c-adfc-d477220ac4e9.jpeg',
      },
      {
        label: 'Jeans',
        storeId: store1.id,
        imageKey: '734e3828-b9ff-485c-adfc-d477220ac4e9.jpeg',
        imageUrl:
          'https://ecommerce-admin-kpirabaharan-billboards.s3.amazonaws.com/734e3828-b9ff-485c-adfc-d477220ac4e9.jpeg',
      },
    ],
  });
};

main()
  .catch((e: any) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Seeding Complete!');
  });
