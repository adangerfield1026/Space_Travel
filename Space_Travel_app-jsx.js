import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SpacecraftsPage from './pages/SpacecraftsPage';
import SpacecraftPage from './pages/SpacecraftPage';
import ConstructionPage from './pages/ConstructionPage';
import PlanetsPage from './pages/PlanetsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main style={{ paddingTop: '80px' }}> {/* Account for fixed navbar */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/spacecrafts" element={<SpacecraftsPage />} />
            <Route path="/spacecrafts/:id" element={<SpacecraftPage />} />
            <Route path="/construct" element={<ConstructionPage />} />
            <Route path="/planets" element={<PlanetsPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;