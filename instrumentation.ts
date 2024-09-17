import { startPetUpdateJobs } from "./app/services/petUpdates";

export const register = () => {
  startPetUpdateJobs();
};

export const runtime = "experimental-edge";
