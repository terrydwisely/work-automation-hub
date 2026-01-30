import React from 'react';
import './styles/theme.css';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import MindMap from './components/MindMap';

function App() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <Toolbar />
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
      }}>
        <Sidebar />
        <MindMap />
      </div>
    </div>
  );
}

export default App;
