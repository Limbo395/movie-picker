import React, { useState, useEffect } from 'react';
import './MovieModal.css';

function MovieModal({ movie, onClose }) {
  const [imageLoaded, setImageLoaded] = useState(false);
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

  const handleChooseMovie = () => {
    const email = 'maksym.haiduk@icloud.com';
    const subject = encodeURIComponent('Фільм від Софії 🎬');
    const body = encodeURIComponent(`Макс, я хочу подивитися "${movie.title}" 💕`);
    
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const typeEmoji = movie.type === 'мультфільм' ? '🎨' : '🎬';

  return (
    <div 
      className={`modal-overlay ${isVisible ? 'visible' : ''}`} 
      onClick={handleOverlayClick}
    >
      <div className={`modal-content movie-modal ${isVisible ? 'visible' : ''}`}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Закрити">
          <span>✕</span>
        </button>

        <div className="modal-body">
          <div className="modal-poster-section">
            <div className="modal-poster-container">
              {!imageLoaded && (
                <div className="modal-poster-placeholder">
                  <span className="poster-loader">🎬</span>
                </div>
              )}
              <img
                src={movie.posterUrl}
                alt={`Постер фільму ${movie.title}`}
                className={`modal-poster ${imageLoaded ? 'loaded' : ''}`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>

          <div className="modal-info-section">
            <h2 className="modal-title">{movie.title}</h2>
            {movie.titleOriginal && movie.titleOriginal !== movie.title && (
              <p className="modal-title-original">{movie.titleOriginal}</p>
            )}
            
            <div className="modal-meta">
              <span className="modal-type">{typeEmoji} {movie.type}</span>
              {movie.year && <span className="modal-year">{movie.year}</span>}
            </div>

            {movie.director && (
              <div className="modal-detail">
                <span className="detail-label">Режисер:</span>
                <span className="detail-value">{movie.director}</span>
              </div>
            )}
          </div>
        </div>

        {movie.description && (
          <div className="modal-description">
            <p>{movie.description}</p>
          </div>
        )}

        <div className="modal-action-section">
          <button className="modal-choose-btn" onClick={handleChooseMovie}>
            <span className="btn-icon">💖</span>
            <span className="btn-text">Хочу цей!</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
