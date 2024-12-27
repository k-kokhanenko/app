import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Movies = () => {
  const [filmsInfo, setFilmsInfo] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [Days, setDays] = useState([]); 
  const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  const getNewFilmsInfo = async () => {
    const response = await fetch(`http://phpsitechecker.ru/sessionsFilms/`, {
      method : "GET",
    });
    const data = await response.json();

console.log(data.filmsInfo);

    if (data.result) {            
        setFilmsInfo(data.filmsInfo);
    }
  }

  useEffect(() => {
    getNewFilmsInfo();

    let days = [];
    let date = new Date();

    for (let i = 0; i < 7; i++) {
        let dayNumber = date.getDay();  

        days[i] = {
          number : date.getDate(), 
          type : daysOfWeek[dayNumber]
        };
        date.setDate(date.getDate() + 1);
    }

    setDays(days);    
  }, []);

  return (
    <>
    <nav className="page-nav">
    {
        Days.map((item, index) => (
            <a key={index} onClick={() => setSelectedDay(index)} className={`page-nav__day ${
                    (index === 0 && index === selectedDay) ? 'page-nav__day_today page-nav__day_chosen' : 
                    (index === 0 && index !== selectedDay) ? 'page-nav__day_today' : 
                    index === selectedDay ? 'page-nav__day_chosen' :
                    (index === 5 || index === 6) ? 'page-nav__day_weekend' : ''
                }`} href="#">
                <span className="page-nav__day-week">{item.type}</span><span className="page-nav__day-number">{item.number}</span>
            </a>   
        ))
    } 
    </nav>
    {Object.keys(filmsInfo).map((key) => (
        <section className="movie" key={key}>
          <div className="movie__info">
            <div className="movie__poster">
              <img className="movie__poster-image" alt={filmsInfo[key].name} src={filmsInfo[key].images}/>
            </div>
            <div className="movie__description">
              <h2 className="movie__title">{filmsInfo[key].name}</h2>
              <p className="movie__synopsis">{filmsInfo[key].description}</p>
              <p className="movie__data">
                <span className="movie__data-duration">{filmsInfo[key].duration} минут, </span>
                <span className="movie__data-origin">{filmsInfo[key].country}</span>
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
                        selectedDay : selectedDay,
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
