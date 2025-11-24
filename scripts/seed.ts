// scripts/seed.ts
import { seedMovies } from './seedMovies';
import { seedShowtimes } from './seedShowtimes';

async function runAllSeeds() {
    try {
        console.log('Running all seed scripts...\n');

        await seedMovies();
        await seedShowtimes();
        // Add more seed functions here in the future:
        // await seedUsers();
        // await seedCategories();

        console.log('\nAll seeding completed successfully!');
    } catch (error) {
        console.error('\nSeeding process failed:', error);
        process.exit(1);
    }
}

runAllSeeds();
