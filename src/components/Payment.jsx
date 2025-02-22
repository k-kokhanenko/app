import React from 'react'

import { useNavigate, useLocation } from 'react-router-dom';

export const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSeats, totalCost, beginTime, filmName, hallName, hallId, filmId, selectedDay } = location.state;

  const addNewTickets = async () => {
    const response = await fetch(`http://phpsitechecker.ru/tickets/`, {
        method : "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hallId, filmId, beginTime, selectedSeats, totalCost, selectedDay })
    });

    const data = await response.json();
    if (!data.result) {
        alert(`Ошибка выполнения запроса: ${data.message}`);
    } else {
         navigate('/ticket', { state: {
          selectedSeats: selectedSeats,
          totalCost : totalCost,
          beginTime: beginTime,
          filmName: filmName,
          hallName: hallName,
          selectedDay: selectedDay,
          ticketId: data.ticketId
        }});
    } 
  } 

  const handleTicket = () => {        
    addNewTickets();
  }

  return (
    <main>
      <section className="ticket">        
        <header className="tichet__check">
          <h2 className="ticket__check-title">Вы выбрали билеты:</h2>
        </header>
        
        <div className="ticket__info-wrapper">
          <div className="ticket__info">На фильм: <span className="ticket__details ticket__title">{filmName}</span></div>
          <div className="ticket__info">Места: 
            <span className="ticket__details ticket__chairs">
            {Object.entries(selectedSeats).map(([rowIndex, row]) => (
              <div key={rowIndex}>{row.split("-")[0]} ряд - {row.split("-")[1]} место</div>
            ))}
            </span>          
          </div>
          <div className="ticket__info">В зале: <span className="ticket__details ticket__hall">{hallName}</span></div>
          <div className="ticket__info">Начало сеанса: <span className="ticket__details ticket__start">{beginTime}</span></div>
          <div className="ticket__info">Стоимость: <span className="ticket__details ticket__cost">{totalCost}</span> рублей</div>

          <button className="acceptin-button" onClick={handleTicket}>Получить код бронирования</button>

          <div className="ticket__hint">После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.</div>
          <div className="ticket__hint">Приятного просмотра!</div>
        </div>
      </section>     
    </main>
  )
}
