import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const employer = await prisma.user.upsert({
    where: { loginCode: 'employer-001' },
    update: {},
    create: {
      name: 'Admin Employer',
      role: 'EMPLOYER',
      loginCode: 'employer-001',
    },
  });

  console.log('Seeded employer:', employer);

  const employee1 = await prisma.user.upsert({
    where: { loginCode: 'emp-alice' },
    update: {},
    create: {
      name: 'Alice Johnson',
      role: 'EMPLOYEE',
      loginCode: 'emp-alice',
    },
  });

  const employee2 = await prisma.user.upsert({
    where: { loginCode: 'emp-bob' },
    update: {},
    create: {
      name: 'Bob Smith',
      role: 'EMPLOYEE',
      loginCode: 'emp-bob',
    },
  });

  console.log('Seeded employees:', employee1, employee2);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
