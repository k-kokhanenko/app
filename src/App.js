
import './css/normalize.css';
import './css/styles.css';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import { Hall } from './components/Hall';
import { Movies } from './components/Movies';
import { Payment } from './components/Payment';
import { Ticket } from './components/Ticket';

function App() {
  return (
    <BrowserRouter>
      <header className="page-header">
        <h1 className="page-header__title">Идём<span>в</span>кино</h1>
      </header>
      <Routes>
        {}
        <Route path="/" element={<Movies/>} />
        <Route path="/hall/" element={<Hall/>} />
        <Route path="/payment/" element={<Payment/>} />
        <Route path="/ticket/" element={<Ticket/>} />        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
