import React, { useState, useEffect } from 'react';
import './SeriesModal.css';

function SeriesModal({ series, onClose, onSelectMovie }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSelectMovie = (movie) => {
    setIsVisible(false);
    setTimeout(() => onSelectMovie(movie), 300);
  };

  const typeEmoji = series.type === 'мультфільм' ? '🎨' : '🎬';

  return (
    <div 
      className={`modal-overlay ${isVisible ? 'visible' : ''}`} 
      onClick={handleOverlayClick}
    >
      <div className={`modal-content series-modal ${isVisible ? 'visible' : ''}`}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Закрити">
          <span>✕</span>
        </button>

        <div className="series-modal-header">
          <h2 className="series-modal-title">{series.groupTitle}</h2>
          <p className="series-modal-subtitle">
            {typeEmoji} {series.movies.length} {series.movies.length === 1 ? 'частина' : 
              series.movies.length >= 2 && series.movies.length <= 4 ? 'частини' : 'частин'}
          </p>
        </div>

        <div className="series-parts-list">
          {series.movies.map((movie, index) => (
            <SeriesPartItem 
              key={movie.id} 
              movie={movie} 
              partNumber={index + 1}
              onClick={() => handleSelectMovie(movie)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SeriesPartItem({ movie, partNumber, onClick }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <button className="series-part-item" onClick={onClick}>
      <div className="part-poster-container">
        {!imageLoaded && (
          <div className="part-poster-placeholder">
            <span>🎬</span>
          </div>
        )}
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className={`part-poster ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
      </div>
      <div className="part-info">
        <span className="part-number">Частина {partNumber}</span>
        <h3 className="part-title">{movie.title}</h3>
        <span className="part-year">{movie.year}</span>
      </div>
      <div className="part-arrow">
        <span>›</span>
      </div>
    </button>
  );
}

export default SeriesModal;

