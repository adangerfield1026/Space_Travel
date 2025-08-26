import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpaceTravelApi from '../services/SpaceTravelApi';
import styles from './ConstructionPage.module.css';

const ConstructionPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    description: '',
    pictureUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'Capacity must be a positive number';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setLoading(true);
    
    try {
      const spacecraftData = {
        name: formData.name.trim(),
        capacity: parseInt(formData.capacity),
        description: formData.description.trim(),
        pictureUrl: formData.pictureUrl.trim() || null
      };
      
      const response = await SpaceTravelApi.buildSpacecraft(spacecraftData);
      
      if (!response.isError) {
        setSuccess(true);
        setFormData({ name: '', capacity: '', description: '', pictureUrl: '' });
        
        setTimeout(() => {
          navigate('/spacecrafts');
        }, 2000);
      } else {
        setErrors({ submit: response.error || 'Failed to build spacecraft' });
      }
    } catch (error) {
      console.error('Error building spacecraft:', error);
      setErrors({ submit: 'An error occurred while building the spacecraft' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <h2>Spacecraft Built Successfully!</h2>
          <p>Redirecting to spacecraft fleet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.constructionForm}>
        <h1 className={styles.title}>Build New Spacecraft</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Spacecraft Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="Enter spacecraft name"
            />
            {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="capacity" className={styles.label}>
              Capacity *
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              className={`${styles.input} ${errors.capacity ? styles.inputError : ''}`}
              placeholder="Enter passenger capacity"
            />
            {errors.capacity && <span className={styles.errorMessage}>{errors.capacity}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
              placeholder="Describe the spacecraft's capabilities and features"
            />
            {errors.description && <span className={styles.errorMessage}>{errors.description}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="pictureUrl" className={styles.label}>
              Picture URL (optional)
            </label>
            <input
              type="url"
              id="pictureUrl"
              name="pictureUrl"
              value={formData.pictureUrl}
              onChange={handleChange}
              className={styles.input}
              placeholder="https://example.com/spacecraft-image.jpg"
            />
          </div>

          {errors.submit && (
            <div className={styles.submitError}>
              {errors.submit}
            </div>
          )}

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => navigate('/spacecrafts')}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Building...' : 'Build Spacecraft'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConstructionPage;