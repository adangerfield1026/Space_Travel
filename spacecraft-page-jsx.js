import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SpaceTravelApi from '../services/SpaceTravelApi';
import Loading from '../components/Loading';
import styles from './SpacecraftPage.module.css';

const SpacecraftPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [spacecraft, setSpacecraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSpacecraft();
  }, [id]);

  const fetchSpacecraft = async () => {
    try {
      setLoading(true);
      const response = await SpaceTravelApi.getSpacecraftById({ id });
      if (!response.isError) {
        setSpacecraft(response.data);
      } else {
        setError('Spacecraft not found');
      }
    } catch (error) {
      console.error('Error fetching spacecraft:', error);
      setError('An error occurred while fetching spacecraft details');
    } finally {
      setLoading(false);
    }
  };

  const handleDestroy = async () => {
    if (window.confirm('Are you sure you want to destroy this spacecraft?')) {
      try {
        const response = await SpaceTravelApi.destroySpacecraftById({ id });
        if (!response.isError) {
          navigate('/spacecrafts');
        } else {
          alert('Failed to destroy spacecraft: ' + response.error);
        }
      } catch (error) {
        console.error('Error destroying spacecraft:', error);
        alert('An error occurred while destroying the spacecraft');
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!spacecraft) return <div className={styles.error}>Spacecraft not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.spacecraftDetail}>
        <div className={styles.imageContainer}>
          {spacecraft.pictureUrl ? (
            <img 
              src={spacecraft.pictureUrl} 
              alt={spacecraft.name}
              className={styles.spacecraftImage}
            />
          ) : (
            <div className={styles.placeholderImage}>
              <span>🚀</span>
            </div>
          )}
        </div>
        
        <div className={styles.spacecraftInfo}>
          <h1 className={styles.spacecraftName}>{spacecraft.name}</h1>
          
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <strong>ID:</strong> {spacecraft.id}
            </div>
            <div className={styles.detailItem}>
              <strong>Capacity:</strong> {spacecraft.capacity} people
            </div>
            <div className={styles.detailItem}>
              <strong>Current Location:</strong> {spacecraft.currentLocationName || 'Unknown'}
            </div>
            <div className={styles.detailItem}>
              <strong>Description:</strong> {spacecraft.description}
            </div>
          </div>
          
          <div className={styles.actions}>
            <Link to="/spacecrafts" className={styles.button}>
              Back to Fleet
            </Link>
            <button 
              onClick={handleDestroy}
              className={`${styles.button} ${styles.dangerButton}`}
            >
              Destroy Spacecraft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacecraftPage;