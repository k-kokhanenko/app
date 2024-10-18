import React from 'react'

import { useLocation } from 'react-router-dom';
import QRCode from 'react-qr-code';

export const Ticket = () => {
    const location = useLocation();
    const { ticketId, filmName, selectedSeats, beginTime, hallName } = location.state;

    return (
        <main>
            <section className="ticket">        
                <header className="tichet__check">
                    <h2 className="ticket__check-title">Электронный билет</h2>
                </header>
                
                <div className="ticket__info-wrapper">
                    <p className="ticket__info">На фильм: <span className="ticket__details ticket__title">{filmName}</span></p>
                    <p className="ticket__info">Места: 
                        <span className="ticket__details ticket__chairs">
                        {Object.entries(selectedSeats).map(([rowIndex, row]) => (
                          <div>{row.split("-")[0]} ряд - {row.split("-")[1]} место</div>
                        ))}
                        </span>
                    </p>
                    <p className="ticket__info">В зале: <span className="ticket__details ticket__hall">{hallName}</span></p>
                    <p className="ticket__info">Начало сеанса: <span className="ticket__details ticket__start">{beginTime}</span></p>

                    <div className='ticket__info-qr'>  
                        <QRCode
                            title="Покажите QR-код нашему контроллеру для подтверждения бронирования."
                            value={ticketId}
                            bgColor="white"
                            fgColor=""
                            size="200"
                        />
                    </div>
                    <p className="ticket__hint">Покажите QR-код нашему контроллеру для подтверждения бронирования.</p>
                    <p className="ticket__hint">Приятного просмотра!</p>
                </div>
            </section>     
        </main>
    )
}
