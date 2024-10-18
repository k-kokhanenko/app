import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Hall = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { filmName, filmId, hallId, hallName, beginTime, sessionId } = location.state;

  const [standartPrice, setStandartPrice] = useState(0);
  const [vipPrice, setVipPrice] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
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
    const response = await fetch(`http://phpsitechecker.ru/seatsTickets/${hallId}/${sessionId}/`, {
      method : "GET",
    });
    const data = await response.json();
    
    if (!data.result) {
      alert(`Ошибка выполнения запроса: ${data.message}`);
    } else {
      setSeats(data.seats);
      console.log(data.seats);
    }      
}

  useEffect(() => {
    getPriceData(hallId);
    getSeatsData(hallId);
  }, []);

  // cell == 3 - disabled
  // cell == 4 - selected
  // cell == 4 - taken
  
  const handlePayment = () => {        
    if (!selectedSeats.length) {
      alert('Отметьте места для бронирования');
      return;
    } 

    navigate('/payment', { state: {
      selectedSeats: selectedSeats,
      totalCost : totalCost,
      beginTime: beginTime,
      filmId: filmId,
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
              <div key={rowIndex} className="buying-scheme__row"> 
              {
                  Object.entries(row).map(([cellIndex, cell]) => <>
                  <span 
                      key={`${rowIndex}-${cellIndex}`} 
                      className={`buying-scheme__chair ${
                        cell === 1 ? 'buying-scheme__chair_standart' : 
                        cell === 2 ? 'buying-scheme__chair_vip' : 
                        cell === 3 ? 'buying-scheme__chair_disabled' : 
                        cell === 4 ? 'buying-scheme__chair_selected' : 'buying-scheme__chair_taken'
                      }`}
                      onClick={(e) => { 
                        if (cell !== 3) {
                          let copy = Object.assign([], seats);
                          copy[rowIndex][cellIndex] = 4;                                                                                                    
                          setSeats(copy);
                          setSelectedSeats([...selectedSeats, `${rowIndex}-${cellIndex}`]);

                          if (cell == 1) {
                            setTotalCost(totalCost + standartPrice);
                          } else
                          if (cell == 2) {
                            setTotalCost(totalCost + vipPrice);
                          } 
                        }
                      }}                      
                      >
                  </span>
                  </>)   
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
