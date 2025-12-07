import React, { useState, useMemo } from 'react';
import MovieCard from './MovieCard';
import SeriesCard from './SeriesCard';
import cartoons from '../data/movies.json';
import films from '../data/films.json';
import './MovieList.css';

// Об'єднуємо мультфільми та фільми в один масив
const movies = [...cartoons, ...films];

function MovieList({ onOpenMovie, onOpenSeries }) {
  const [filter, setFilter] = useState('мультфільм');
  const [searchQuery, setSearchQuery] = useState('');

  // Групуємо фільми: серії об'єднуємо, одиночні лишаємо окремо
  const groupedItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    const filtered = movies.filter((movie) => {
      // Фільтр за типом
      if (movie.type !== filter) return false;
      
      // Фільтр за пошуком
      if (query) {
        const titleMatch = movie.title.toLowerCase().includes(query);
        const originalMatch = movie.titleOriginal?.toLowerCase().includes(query);
        const groupMatch = movie.groupTitle?.toLowerCase().includes(query);
        return titleMatch || originalMatch || groupMatch;
      }
      
      return true;
    });

    const groups = {};
    const standalone = [];

    filtered.forEach((movie) => {
      if (movie.groupId) {
        if (!groups[movie.groupId]) {
          groups[movie.groupId] = {
            groupId: movie.groupId,
            groupTitle: movie.groupTitle,
            type: movie.type,
            movies: [],
          };
        }
        groups[movie.groupId].movies.push(movie);
      } else {
        standalone.push({ type: 'movie', data: movie });
      }
    });

    // Сортуємо частини всередині кожної серії за partOrder
    Object.values(groups).forEach((group) => {
      group.movies.sort((a, b) => (a.partOrder || 0) - (b.partOrder || 0));
      // Найновіший рік серії для сортування
      group.newestYear = Math.max(...group.movies.map((m) => m.year || 0));
      // Постер першої частини
      group.posterUrl = group.movies[0]?.posterUrl;
    });

    // Об'єднуємо серії та одиночні фільми
    const items = [
      ...Object.values(groups).map((g) => ({ type: 'series', data: g })),
      ...standalone,
    ];

    // Сортуємо за роком (найновіші зверху)
    items.sort((a, b) => {
      const yearA = a.type === 'series' ? a.data.newestYear : (a.data.year || 0);
      const yearB = b.type === 'series' ? b.data.newestYear : (b.data.year || 0);
      return yearB - yearA;
    });

    return items;
  }, [filter, searchQuery]);

  const handleCardClick = (item) => {
    if (item.type === 'series') {
      onOpenSeries(item.data);
    } else {
      onOpenMovie(item.data);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <section className="movie-list-section">
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Пошук..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear" onClick={handleClearSearch}>
            ✕
          </button>
        )}
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'мультфільм' ? 'active' : ''}`}
          onClick={() => setFilter('мультфільм')}
        >
          <span className="tab-text">Мультфільми</span>
        </button>
        <button
          className={`filter-tab ${filter === 'фільм' ? 'active' : ''}`}
          onClick={() => setFilter('фільм')}
        >
          <span className="tab-text">Фільми</span>
        </button>
      </div>

      <div className="movie-grid">
        {groupedItems.map((item, index) => (
          <div
            key={item.type === 'series' ? `series-${item.data.groupId}` : `movie-${item.data.id}`}
            className="movie-item"
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            {item.type === 'series' ? (
              <SeriesCard 
                series={item.data} 
                onClick={() => handleCardClick(item)} 
              />
            ) : (
              <MovieCard 
                movie={item.data} 
                onClick={() => handleCardClick(item)} 
              />
            )}
          </div>
        ))}
      </div>

      {groupedItems.length === 0 && (
        <div className="no-movies">
          <span className="no-movies-icon">🎭</span>
          <p>{searchQuery ? 'Нічого не знайдено' : 'Немає фільмів у цій категорії'}</p>
        </div>
      )}
    </section>
  );
}

export default MovieList;
