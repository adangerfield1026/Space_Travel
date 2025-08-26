import SpaceTravelMockApi from './SpaceTravelMockApi';

const SpaceTravelApi = {
  async getPlanets() {
    return await SpaceTravelMockApi.getPlanets();
  },

  async getSpacecrafts() {
    return await SpaceTravelMockApi.getSpacecrafts();
  },

  async getSpacecraftById(params) {
    return await SpaceTravelMockApi.getSpacecraftById(params);
  },

  async buildSpacecraft(spacecraftData) {
    return await SpaceTravelMockApi.buildSpacecraft(spacecraftData);
  },

  async destroySpacecraftById(params) {
    return await SpaceTravelMockApi.destroySpacecraftById(params);
  },

  async sendSpacecraftToPlanet(params) {
    return await SpaceTravelMockApi.sendSpacecraftToPlanet(params);
  }
};

export default SpaceTravelApi;