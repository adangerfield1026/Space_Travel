import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Space Travel Command Center</h1>
        <p className={styles.subtitle}>
          Welcome to the ultimate spacecraft management system for humanity's evacuation from Earth
        </p>
      </div>
      
      <div className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.icon}>🚀</div>
          <h3>Manage Spacecraft</h3>
          <p>View, build, and destroy spacecraft in your fleet</p>
          <Link to="/spacecrafts" className={styles.button}>
            View Spacecrafts
          </Link>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.icon}>🌍</div>
          <h3>Monitor Planets</h3>
          <p>Track populations and dispatch spacecraft between planets</p>
          <Link to="/planets" className={styles.button}>
            View Planets
          </Link>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.icon}>⚒️</div>
          <h3>Build New Ships</h3>
          <p>Construct new spacecraft to expand your evacuation fleet</p>
          <Link to="/construct" className={styles.button}>
            Start Building
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;