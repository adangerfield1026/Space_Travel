import { nanoid } from 'nanoid';

const SpaceTravelMockApi = {
  // Initialize default data
  initializeData() {
    if (!localStorage.getItem('planets')) {
      const defaultPlanets = [
        { id: 1, name: 'Earth', currentPopulation: 7800000000, pictureUrl: null },
        { id: 2, name: 'Mars', currentPopulation: 0, pictureUrl: null },
        { id: 3, name: 'Europa', currentPopulation: 0, pictureUrl: null },
        { id: 4, name: 'Titan', currentPopulation: 0, pictureUrl: null }
      ];
      localStorage.setItem('planets', JSON.stringify(defaultPlanets));
    }
  },

  async getPlanets() {
    this.initializeData();
    const planets = JSON.parse(localStorage.getItem('planets') || '[]');
    return { isError: false, data: planets };
  },

  async getSpacecrafts() {
    const spacecrafts = JSON.parse(localStorage.getItem('spacecrafts') || '[]');
    const planets = JSON.parse(localStorage.getItem('planets') || '[]');
    
    // Add planet names to spacecrafts
    const spacecraftsWithPlanetNames = spacecrafts.map(spacecraft => {
      const planet = planets.find(p => p.id === spacecraft.currentLocation);
      return {
        ...spacecraft,
        currentLocationName: planet ? planet.name : 'Unknown'
      };
    });
    
    return { isError: false, data: spacecraftsWithPlanetNames };
  },

  async getSpacecraftById({ id }) {
    const spacecrafts = JSON.parse(localStorage.getItem('spacecrafts') || '[]');
    const planets = JSON.parse(localStorage.getItem('planets') || '[]');
    const spacecraft = spacecrafts.find(s => s.id === id);
    
    if (spacecraft) {
      const planet = planets.find(p => p.id === spacecraft.currentLocation);
      return {
        isError: false,
        data: {
          ...spacecraft,
          currentLocationName: planet ? planet.name : 'Unknown'
        }
      };
    }
    
    return { isError: true, error: 'Spacecraft not found' };
  },

  async buildSpacecraft(data) {
    try {
      const spacecrafts = JSON.parse(localStorage.getItem('spacecrafts') || '[]');
      const newSpacecraft = {
        id: nanoid(),
        name: data.name,
        capacity: data.capacity,
        description: data.description,
        pictureUrl: data.pictureUrl || null,
        currentLocation: 1 // Earth
      };
      
      spacecrafts.push(newSpacecraft);
      localStorage.setItem('spacecrafts', JSON.stringify(spacecrafts));
      
      return { isError: false, data: newSpacecraft };
    } catch (error) {
      return { isError: true, error: 'Failed to build spacecraft' };
    }
  },

  async destroySpacecraftById({ id }) {
    try {
      let spacecrafts = JSON.parse(localStorage.getItem('spacecrafts') || '[]');
      const initialLength = spacecrafts.length;
      spacecrafts = spacecrafts.filter(s => s.id !== id);
      
      if (spacecrafts.length === initialLength) {
        return { isError: true, error: 'Spacecraft not found' };
      }
      
      localStorage.setItem('spacecrafts', JSON.stringify(spacecrafts));
      return { isError: false };
    } catch (error) {
      return { isError: true, error: 'Failed to destroy spacecraft' };
    }
  },

  async sendSpacecraftToPlanet({ spacecraftId, targetPlanetId }) {
    try {
      const spacecrafts = JSON.parse(localStorage.getItem('spacecrafts') || '[]');
      const planets = JSON.parse(localStorage.getItem('planets') || '[]');
      
      const spacecraftIndex = spacecrafts.findIndex(s => s.id === spacecraftId);
      if (spacecraftIndex === -1) {
        return { isError: true, error: 'Spacecraft not found' };
      }
      
      const spacecraft = spacecrafts[spacecraftIndex];
      if (spacecraft.currentLocation === targetPlanetId) {
        return { isError: true, error: 'Spacecraft is already at the target location' };
      }
      
      // Update populations
      const sourcePlanet = planets.find(p => p.id === spacecraft.currentLocation);
      const targetPlanet = planets.find(p => p.id === targetPlanetId);
      
      if (sourcePlanet && targetPlanet) {
        const transferAmount = Math.min(spacecraft.capacity, sourcePlanet.currentPopulation);
        sourcePlanet.currentPopulation = Math.max(0, sourcePlanet.currentPopulation - transferAmount);
        targetPlanet.currentPopulation += transferAmount;
      }
      
      // Update spacecraft location
      spacecraft.currentLocation = targetPlanetId;
      
      localStorage.setItem('spacecrafts', JSON.stringify(spacecrafts));
      localStorage.setItem('planets', JSON.stringify(planets));
      
      return { isError: false };
    } catch (error) {
      return { isError: true, error: 'Failed to send spacecraft' };
    }
  }
};

export default SpaceTravelMockApi;