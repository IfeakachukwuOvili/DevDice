import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const challenges = [
    {
      title: "Build a responsive navbar",
      description: "Create a responsive navigation bar using HTML, CSS, and React.",
    },
    {
      title: "Create a REST API with Express",
      description: "Set up a simple REST API with CRUD endpoints for users.",
    },
    {
      title: "Use TanStack Query for data fetching",
      description: "Fetch and cache data from an API using TanStack Query in React.",
    },
    {
      title: "Style a card with Tailwind CSS",
      description: "Use Tailwind classes to style a profile or product card.",
    },
    {
      title: "Build a login form",
      description: "Create a login form using React and TypeScript with basic validation.",
    },
  ];

  for (const challenge of challenges) {
    await prisma.challenge.create({
      data: challenge,
    });
  }

  console.log("✅ Seeded challenges!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
