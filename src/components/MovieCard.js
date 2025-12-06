import React, { useState } from 'react';
import './MovieCard.css';

function MovieCard({ movie, onClick }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const typeEmoji = movie.type === 'мультфільм' ? '🎨' : '🎬';

  return (
    <article className="movie-card" onClick={onClick}>
      <div className="movie-poster-container">
        {!imageLoaded && !imageError && (
          <div className="movie-poster-placeholder">
            <span className="poster-loader">🎬</span>
          </div>
        )}
        {imageError ? (
          <div className="movie-poster-placeholder movie-poster-error">
            <span>🎥</span>
            <p>Постер недоступний</p>
          </div>
        ) : (
          <img
            src={movie.posterUrl}
            alt={`Постер фільму ${movie.title}`}
            className={`movie-poster ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-meta">
          <span className="movie-type">{typeEmoji} {movie.type}</span>
          {movie.year && <span className="movie-year">{movie.year}</span>}
        </p>
      </div>
    </article>
  );
}

export default MovieCard;
