import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/dm-sans/300.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import './styles/styles.css';
import { PizzaCalculator } from './presentation/components/PizzaCalculator';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PizzaCalculator />
  </React.StrictMode>,
);
