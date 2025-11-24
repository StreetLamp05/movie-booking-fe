const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

interface MovieData {
  title: string;
  cast: string;
  director: string;
  producer: string;
  synopsis: string;
  trailer_picture: string;
  video: string;
  film_rating_code: string;
  categories: string[];
}

const movies: MovieData[] = [
  {
    title: 'The Shawshank Redemption',
    cast: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler',
    director: 'Frank Darabont',
    producer: 'Niki Marvin',
    synopsis: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    trailer_picture: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    video: 'https://www.youtube.com/embed/6hB3S9bIaco',
    film_rating_code: 'R',
    categories: ['Drama'],
  },
  {
    title: 'The Godfather',
    cast: 'Marlon Brando, Al Pacino, James Caan, Robert Duvall',
    director: 'Francis Ford Coppola',
    producer: 'Albert S. Ruddy',
    synopsis: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    trailer_picture: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    video: 'https://www.youtube.com/embed/sY1S34973zA',
    film_rating_code: 'R',
    categories: ['Crime', 'Drama'],
  },
  {
    title: 'The Dark Knight',
    cast: 'Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine',
    director: 'Christopher Nolan',
    producer: 'Emma Thomas, Charles Roven',
    synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
    trailer_picture: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    video: 'https://www.youtube.com/embed/EXeTwQWrcwY',
    film_rating_code: 'PG-13',
    categories: ['Action', 'Crime', 'Drama'],
  },
  {
    title: 'Pulp Fiction',
    cast: 'John Travolta, Uma Thurman, Samuel L. Jackson, Bruce Willis',
    director: 'Quentin Tarantino',
    producer: 'Lawrence Bender',
    synopsis: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    trailer_picture: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    video: 'https://www.youtube.com/embed/s7EdQ4FqbhY',
    film_rating_code: 'R',
    categories: ['Crime', 'Drama'],
  },
  {
    title: 'Inception',
    cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page, Tom Hardy',
    director: 'Christopher Nolan',
    producer: 'Emma Thomas, Christopher Nolan',
    synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
    trailer_picture: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    video: 'https://www.youtube.com/embed/YoHD9XEInc0',
    film_rating_code: 'PG-13',
    categories: ['Action', 'Sci-Fi', 'Thriller'],
  },
  {
    title: 'The Matrix',
    cast: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving',
    director: 'Lana Wachowski, Lilly Wachowski',
    producer: 'Joel Silver',
    synopsis: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    trailer_picture: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    video: 'https://www.youtube.com/embed/vKQi3bBA1y8',
    film_rating_code: 'R',
    categories: ['Action', 'Sci-Fi'],
  },
  {
    title: 'Forrest Gump',
    cast: 'Tom Hanks, Robin Wright, Gary Sinise, Sally Field',
    director: 'Robert Zemeckis',
    producer: 'Wendy Finerman, Steve Tisch, Steve Starkey',
    synopsis: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
    trailer_picture: 'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg',
    video: 'https://www.youtube.com/embed/bLvqoHBptjg',
    film_rating_code: 'PG-13',
    categories: ['Drama', 'Romance'],
  },
  {
    title: 'Interstellar',
    cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine',
    director: 'Christopher Nolan',
    producer: 'Emma Thomas, Christopher Nolan, Lynda Obst',
    synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    trailer_picture: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    video: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    film_rating_code: 'PG-13',
    categories: ['Adventure', 'Drama', 'Sci-Fi'],
  },
  {
    title: 'Parasite',
    cast: 'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong, Choi Woo-shik',
    director: 'Bong Joon-ho',
    producer: 'Kwak Sin-ae, Moon Yang-kwon',
    synopsis: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    trailer_picture: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    video: 'https://www.youtube.com/embed/5xH0HfJHsaY',
    film_rating_code: 'R',
    categories: ['Drama', 'Thriller'],
  },
  {
    title: 'Avengers: Endgame',
    cast: 'Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth',
    director: 'Anthony Russo, Joe Russo',
    producer: 'Kevin Feige',
    synopsis: 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos\' actions and restore balance to the universe.',
    trailer_picture: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    video: 'https://www.youtube.com/embed/TcMBFSGVi1c',
    film_rating_code: 'PG-13',
    categories: ['Action', 'Adventure', 'Sci-Fi'],
  },
];

export async function seedMovies() {
  try {
    console.log('Seeding movies...');
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1';
    let successCount = 0;
    let errorCount = 0;

    for (const movie of movies) {
      try {
        const response = await fetch( `${API_BASE}/movies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(movie),
        });

        if (response.ok) {
          const created = await response.json();
          console.log(`✓ Created: ${movie.title} (ID: ${created.movie_id || created.id})`);
          successCount++;
        } else {
          const error = await response.text();
          console.error(`✗ Failed to create "${movie.title}": ${response.status} - ${error}`);
          errorCount++;
        }
      } catch (error) {
        console.error(`✗ Error creating "${movie.title}":`, error);
        errorCount++;
      }
    }

    console.log('\nFinished seeding:');
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Total: ${movies.length}`);

    if (errorCount === 0) {
      console.log('\nAll movies seeded successfully');
    } else {
      console.log(`\nFailed to seed ${errorCount} movies. Check the logs for details.`);
      process.exit(1);
    }
  } catch (error) {
    console.error('\nSeeding failed:', error);
    process.exit(1);
  }
}


if (require.main === module) {
  seedMovies();
}
