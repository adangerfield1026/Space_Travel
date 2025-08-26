import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SpaceTravelApi from "../services/SpaceTravelApi";
import SpacecraftCard from "../components/SpacecraftCard";
import Loading from "../components/Loading";
import styles from "./SpacecraftsPage.module.css";

const SpacecraftsPage = () => {
  const [spacecrafts, setSpacecrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSpacecrafts();
  }, []);

  const fetchSpacecrafts = async () => {
    try {
      setLoading(true);
      const response = await SpaceTravelApi.getSpacecrafts();
      if (!response.isError) {
        setSpacecrafts(response.data);
      } else {
        setError("Failed to load spacecrafts. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching spacecrafts:", error);
      setError("An error occurred while fetching spacecrafts.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (spacecraftId) => {
    if (window.confirm('Are you sure you want to destroy this spacecraft?')) {
      try {
        const response = await SpaceTravelApi.destroySpacecraftById({ id: spacecraftId });
        if (!response.isError) {
          await fetchSpacecrafts();
        } else {
          alert('Failed to destroy spacecraft: ' + response.error);
        }
      } catch (error) {
        console.error('Error destroying spacecraft:', error);
        alert('An error occurred while destroying the spacecraft.');
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Spacecraft Fleet</h2>
      {spacecrafts.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.empty}>No spacecraft available.</p>
          <Link to="/construct" className={styles.addButton}>
            Build Your First Spacecraft
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {spacecrafts.map((spacecraft) => (
            <SpacecraftCard 
              key={spacecraft.id} 
              spacecraft={{
                ...spacecraft,
                currentLocation: spacecraft.currentLocationName
              }} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      
      <div className={styles.addButtonContainer}>
        <Link to="/construct" className={styles.addButton}>
          + New Spacecraft
        </Link>
      </div>
    </div>
  );
};

export default SpacecraftsPage;