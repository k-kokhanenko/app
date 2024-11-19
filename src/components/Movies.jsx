import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Movies = () => {
  const [filmsInfo, setFilmsInfo] = useState([]);

  const getNewFilmsInfo = async () => {
    const response = await fetch(`http://phpsitechecker.ru/sessionsFilms/`, {
      method : "GET",
    });
    const data = await response.json();
    if (data.result) {            
        setFilmsInfo(data.filmsInfo);

        //console.log('getNewFilmsInfo');
        //console.log(data.filmsInfo);
    }
  }

  useEffect(() => {
    getNewFilmsInfo();
  }, []);

  return (
    <>
    {Object.keys(filmsInfo).map((key) => (
        <section className="movie" key={key}>
          <div className="movie__info">
            <div className="movie__poster">
              <img className="movie__poster-image" alt={filmsInfo[key].name} src="i/poster1.jpg"/>
            </div>
            <div className="movie__description">
              <h2 className="movie__title">{filmsInfo[key].name}</h2>
              <p className="movie__synopsis">{filmsInfo[key].name}</p>
              <p className="movie__data">
                <span className="movie__data-duration">{filmsInfo[key].duration} минут, </span>
                <span className="movie__data-origin">США</span>
              </p>
            </div>
          </div>  

          {Object.keys(filmsInfo[key].halls).map((key2) => (
            <div className="movie-seances__hall" key={`${key}-${key2}`}>
              <h3 className="movie-seances__hall-title">Зал {filmsInfo[key].halls[key2].name}</h3>
              <ul className="movie-seances__list">

              {filmsInfo[key].halls[key2].beginTimes.map((item, index) => (                
                  <li className="movie-seances__time-block" key={index}>
                    <Link className="movie-seances__time" to="/hall" state={{ 
                        filmName: filmsInfo[key].name, 
                        filmId: filmsInfo[key].id,
                        hallId: key2,
                        hallName: filmsInfo[key].halls[key2].name, 
                        beginTime : item,
                        sessionId : filmsInfo[key].halls[key2].sessionsId[index]
                      }}
                    > 
                      {item}
                    </Link>
                  </li>
              ))}
              </ul>
            </div>   
          ))}           
        </section>
      ))}
    </>
  )
}
