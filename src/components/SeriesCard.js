import React, { useState } from 'react';
import './MovieCard.css';

function SeriesCard({ series, onClick }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const typeEmoji = series.type === 'мультфільм' ? '🎨' : '🎬';
  const partsCount = series.movies.length;
  const partsLabel = partsCount === 1 ? 'частина' : 
                     partsCount >= 2 && partsCount <= 4 ? 'частини' : 'частин';

  return (
    <article className="movie-card series-card" onClick={onClick}>
      <div className="movie-poster-container">
        <div className="series-badge">
          <span>{partsCount} {partsLabel}</span>
        </div>
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
            src={series.posterUrl}
            alt={`Постер серії ${series.groupTitle}`}
            className={`movie-poster ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{series.groupTitle}</h3>
        <p className="movie-meta">
          <span className="movie-type">{typeEmoji} {series.type}</span>
          <span className="movie-year series-years">
            {series.movies[0]?.year}–{series.movies[series.movies.length - 1]?.year}
          </span>
        </p>
      </div>
    </article>
  );
}

export default SeriesCard;

