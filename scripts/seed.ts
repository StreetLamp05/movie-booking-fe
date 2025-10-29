import { seedMovies } from './seedMovies';

async function runAllSeeds() {
  try {
    console.log('=€ Running all seed scripts...\n');

    // Run movie seeding
    await seedMovies();

    // Add more seed functions here in the future
    // await seedShowtimes();
    // await seedUsers();
    // await seedCategories();

    console.log('\n All seeding completed successfully!');
  } catch (error) {
    console.error('\nL Seeding process failed:', error);
    process.exit(1);
  }
}

runAllSeeds();
