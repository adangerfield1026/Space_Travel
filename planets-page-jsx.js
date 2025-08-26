import React, { useEffect, useState } from 'react';
import SpaceTravelApi from '../services/SpaceTravelApi';
import Loading from '../components/Loading';
import styles from './PlanetsPage.module.css';

const PlanetsPage = () => {
  const [planets, setPlanets] = useState([]);
  const [spacecrafts, setSpacecrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSpacecraft, setSelectedSpacecraft] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [planetsResponse, spacecraftsResponse] = await Promise.all([
        SpaceTravelApi.getPlanets(),
        SpaceTravelApi.getSpacecrafts()
      ]);

      if (!planetsResponse.isError) {
        setPlanets(planetsResponse.data);
      }

      if (!spacecraftsResponse.isError) {
        setSpacecrafts(spacecraftsResponse.data);
      }

      if (planetsResponse.isError || spacecraftsResponse.isError) {
        setError('Failed to load some data. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendSpacecraft = async () => {
    if (!selectedSpacecraft || !selectedDestination) {
      alert('Please select both a spacecraft and destination');
      return;
    }

    const spacecraft = spacecrafts.find(s => s.id === selectedSpacecraft);
    const destinationPlanet = planets.find(p => p.id === parseInt(selectedDestination));

    if (spacecraft.currentLocationName === destinationPlanet.name) {
      alert('Spacecraft is already at the selected destination');
      return;
    }

    setSending(true);

    try {
      const response = await SpaceTravelApi.sendSpacecraftToPlanet({
        spacecraftId: selectedSpacecraft,
        targetPlanetId: parseInt(selectedDestination)
      });

      if (!response.isError) {
        alert('Spacecraft sent successfully!');
        setSelectedSpacecraft('');
        setSelectedDestination('');
        await fetchData(); // Refresh data
      } else {
        alert('Failed to send spacecraft: ' + response.error);
      }
    } catch (error) {
      console.error('Error sending spacecraft:', error);
      alert('An error occurred while sending the spacecraft');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Planets & Spacecraft Dispatch</h1>
      
      <div className={styles.dispatchSection}>
        <h2 className={styles.sectionTitle}>Send Spacecraft</h2>
        <div className={styles.dispatchForm}>
          <div className={styles.selectGroup}>
            <label className={styles.label}>Select Spacecraft:</label>
            <select 
              value={selectedSpacecraft} 
              onChange={(e) => setSelectedSpacecraft(e.target.value)}
              className={styles.select}
            >
              <option value="">Choose spacecraft...</option>
              {spacecrafts.map(spacecraft => (
                <option key={spacecraft.id} value={spacecraft.id}>
                  {spacecraft.name} (Capacity: {spacecraft.capacity}) - Currently at {spacecraft.currentLocationName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.selectGroup}>
            <label className={styles.label}>Select Destination:</label>
            <select 
              value={selectedDestination} 
              onChange={(e) => setSelectedDestination(e.target.value)}
              className={styles.select}
            >
              <option value="">Choose destination...</option>
              {planets.map(planet => (
                <option key={planet.id} value={planet.id}>
                  {planet.name} (Population: {planet.currentPopulation.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleSendSpacecraft} 
            disabled={sending || !selectedSpacecraft || !selectedDestination}
            className={styles.sendButton}
          >
            {sending ? 'Sending...' : 'Send Spacecraft'}
          </button>
        </div>
      </div>

      <div className={styles.planetsSection}>
        <h2 className={styles.sectionTitle}>Planet Status</h2>
        <div className={styles.planetsGrid}>
          {planets.map(planet => {
            const stationedSpacecrafts = spacecrafts.filter(s => s.currentLocation === planet.id);
            
            return (
              <div key={planet.id} className={styles.planetCard}>
                {planet.pictureUrl && (
                  <img 
                    src={planet.pictureUrl} 
                    alt={planet.name}
                    className={styles.planetImage}
                  />
                )}
                <div className={styles.planetInfo}>
                  <h3 className={styles.planetName}>{planet.name}</h3>
                  <p className={styles.planetPopulation}>
                    Population: {planet.currentPopulation.toLocaleString()}
                  </p>
                  <p className={styles.spacecraftCount}>
                    Stationed Spacecraft: {stationedSpacecrafts.length}
                  </p>
                  
                  {stationedSpacecrafts.length > 0 && (
                    <div className={styles.stationedSpacecraft}>
                      <h4>Spacecraft on {planet.name}:</h4>
                      <ul className={styles.spacecraftList}>
                        {stationedSpacecrafts.map(spacecraft => (
                          <li key={spacecraft.id} className={styles.spacecraftItem}>
                            {spacecraft.name} (Capacity: {spacecraft.capacity})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlanetsPage;