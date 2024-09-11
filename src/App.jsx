import React from 'react';
import Container from './components/container/Container';
import { SuperProvider } from './context/SuperContext';
import './assets/Style.css'

function App() {
  return (
    <div>
      <SuperProvider >
      <Container />
      </SuperProvider>
    </div>
  );
}

export default App;
