import fs from 'fs';
import { parse } from 'csv-parse';
import { prisma } from '../storage/databases/Prisma.js';
import { logger } from '../services/LoggerService.js';

async function migrateFromCSV(filePath: string) {
  const csvData = fs.readFileSync(filePath, 'utf8');

  // Use promise-based parsing instead of callback
  const records = await new Promise<any[]>((resolve, reject) => {
    parse(csvData, { columns: true, trim: true }, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  logger.info(`Found ${records.length} parts to import`);

  for (const part of records) {
    try {
      const quantity = Math.floor(Math.random() * 41) + 10;
      await prisma.product.create({
        data: {
          name: `Part ${part.number}`,
          description: part.description || 'No description available',
          price: parseFloat(part.price),
          weight: parseFloat(part.weight),
          pictureURL: part.pictureURL || 'https://via.placeholder.com/300x200',
          quantity,
        },
      });
      logger.info(`Imported part ${part.number} with quantity ${quantity}`);
    } catch (error: any) {
      if (error.code === 'P2002') logger.warn(`Skipped duplicate part: ${part.number}`);
      else logger.error(`Error importing part ${part.number}:`, error);
    }
  }

  logger.info('CSV migration completed');
  await prisma.$disconnect();
}

// Run the migration
(async () => {
  try {
    await migrateFromCSV('./parts.csv');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
