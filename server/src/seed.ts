import { PrismaClient } from "../generated/prisma";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Map each file to its corresponding Prisma model name (using singular standard naming)
const seedMapping = [
  { file: "employers.json", model: "user" },
  { file: "employees.json", model: "user" },
  { file: "availabilities.json", model: "availability" },
  { file: "schedules.json", model: "schedule" }
];

async function deleteAllData() {
  // Delete in reverse order to avoid FK errors (child → parent)
  // Our dependencies: availability -> user, schedule -> user.
  // We should delete schedule and availability before deleting user.
  const modelsToDelete = ["schedule", "availability", "user"];

  for (const modelName of modelsToDelete) {
    const model: any = prisma[modelName as keyof typeof prisma];
    if (!model) continue;
    try {
      await model.deleteMany({});
      console.log(`🧹 Cleared data from ${modelName}`);
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "../prisma/seedData");

  // Clear existing data before seeding
  await deleteAllData();

  // Seed each model in order
  for (const { file, model: modelName } of seedMapping) {
    const filePath = path.join(dataDirectory, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Warning: Seed file ${file} not found. Skipping.`);
      continue;
    }

    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const model: any = prisma[modelName as keyof typeof prisma];

    try {
      for (const data of jsonData) {
        await model.create({ data });
      }
      console.log(`🌱 Seeded ${modelName} with data from ${file}`);
    } catch (error) {
      console.error(`💥 Error seeding data for ${modelName} from ${file}:`, error);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    console.log("✅ Seeding completed.");
  });
