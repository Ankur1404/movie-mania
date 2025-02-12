import React from 'react'
const languageMap = {
  en: "En",
  fr: "Fr",
  es: "Sp",
  hi: "Hin",
  
};
const MovieCard = ({ movie:
  { title, vote_average, poster_path, release_date, original_language }
}) => {
  return (
    <div className="movie-card">
      <img
        src={poster_path ?
          `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'}
        alt={title}
      />
  <h3 className='text-white'>{title}</h3>
     <div className='content'>
      <div className='rating'>
        <img src="/star.png" alt="" />
          <p>{vote_average ? vote_average.toFixed(1): 'N/A'}</p>
      </div>
      <span>•</span>
      <span>{languageMap[original_language] || original_language}</span>
          <span>•</span>
          <span>{release_date ? release_date.split('-') [0]: "N/A"}</span>

     </div>
    </div>
  )
}
export default MovieCard