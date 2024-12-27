import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

let  initSeats = {};

export const Hall = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { filmName, filmId, hallId, hallName, beginTime, sessionId, selectedDay } = location.state;

  const [standartPrice, setStandartPrice] = useState(0);
  const [vipPrice, setVipPrice] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [seats, setSeats] = useState([]);
  //const [selectedSeats, setSelectedSeats] = useState([]);
     
  // Получаем по id зала цены
  const getPriceData = async (hallId) => {
    const response = await fetch(`http://phpsitechecker.ru/prices/${hallId}/`, {
      method : "GET",
    });
    const data = await response.json();

    if (!data.result) {
      alert(`Ошибка выполнения запроса: ${data.message}`);
    } else {
      setStandartPrice(data.price[0].standart_price)
      setVipPrice(data.price[0].vip_price);  
    }  
  }

  // Получаем по id кинозала сетку 
  const getSeatsData = async (hallId) => {
    const response = await fetch(`http://phpsitechecker.ru/seatsTickets/${hallId}/${sessionId}/${selectedDay}/`, {
      method : "GET",
    });
    const data = await response.json();
    
    if (!data.result) {
      alert(`Ошибка выполнения запроса: ${data.message}`);
    } else {
      setSeats(data.seats);
      initSeats = JSON.parse(JSON.stringify(data.seats));
    }      
  }

  useEffect(() => {
    getPriceData(hallId);
    getSeatsData(hallId);
  }, []);

  const handlePayment = () => {     
    let selectedSeats = [];
    for (let key in seats) {
      let subObj = seats[key];
      for (let subKey in subObj) {
        if (seats[key][subKey] == 5) {
          selectedSeats.push(`${key}-${subKey}`);
        }
      }
    }    

    if (!selectedSeats.length) {
      alert('Отметьте места для бронирования');
      return;
    } 

    navigate('/payment', { state: {
      selectedSeats: selectedSeats,
      totalCost : totalCost,
      beginTime: beginTime,
      filmId: filmId,
      selectedDay: selectedDay,
      filmName: filmName,
      hallName: hallName,
      hallId: hallId,
    }});
  }

  return (
    <main>
    <section className="buying">
      <div className="buying__info">
        <div className="buying__info-description">
          <h2 className="buying__info-title">{filmName}</h2>
          <p className="buying__info-start">Начало сеанса: {beginTime}</p>
          <p className="buying__info-hall">Зал {hallName}</p>          
        </div>
        <div className="buying__info-hint">
          <p>Тапните дважды,<br/>чтобы увеличить</p>
        </div>
      </div>
      <div className="buying-scheme">
        <div className="buying-scheme__wrapper">
          {Object.entries(seats).map(([rowIndex, row]) => (
              <div className="buying-scheme__row" key={rowIndex}> 
              {
                  Object.entries(row).map(([cellIndex, cell]) => 
                    <span 
                      key={`${rowIndex}-${cellIndex}`} 
                      className={`buying-scheme__chair ${
                        cell === 1 ? 'buying-scheme__chair_standart' : 
                        cell === 2 ? 'buying-scheme__chair_vip' : 
                        cell === 3 ? 'buying-scheme__chair_disabled' : 
                        cell === 4 ? 'buying-scheme__chair_taken' : 'buying-scheme__chair_selected'
                      }`}
                      onClick={(e) => { 
                        let ticketType = '';
                        if (initSeats[rowIndex][cellIndex] == 1) ticketType = 1;
                        if (initSeats[rowIndex][cellIndex] == 2) ticketType = 2;

                        if (cell !== 3 && cell !== 4) {
                          let copy = Object.assign([], seats);
                          let p = copy[rowIndex][cellIndex] !== 5 ? 1 : -1;
                          copy[rowIndex][cellIndex] = (copy[rowIndex][cellIndex] !== 5) ? 5 : ticketType;                                                   
                          setSeats(copy);

                          if (ticketType === 1) {
                            setTotalCost(totalCost + p * standartPrice);
                          } else
                          if (ticketType === 2) {
                            setTotalCost(totalCost + p * vipPrice);
                          }                           
                        }
                      }}                      
                      >
                  </span>
                  )   
              }
              </div>
          ))}
        </div>
        <div className="buying-scheme__legend">
          <div className="col">
            <p className="buying-scheme__legend-price"><span className="buying-scheme__chair buying-scheme__chair_standart"></span> Свободно (<span className="buying-scheme__legend-value">{standartPrice}</span>руб)</p>
            <p className="buying-scheme__legend-price"><span className="buying-scheme__chair buying-scheme__chair_vip"></span> Свободно VIP (<span className="buying-scheme__legend-value">{vipPrice}</span>руб)</p>            
          </div>
          <div className="col">
            <p className="buying-scheme__legend-price"><span className="buying-scheme__chair buying-scheme__chair_taken"></span> Занято</p>
            <p className="buying-scheme__legend-price"><span className="buying-scheme__chair buying-scheme__chair_selected"></span> Выбрано</p>                    
          </div>
        </div>
      </div>
      <button className="acceptin-button" onClick={handlePayment}>Забронировать</button>
    </section>     
  </main>
  )
}
