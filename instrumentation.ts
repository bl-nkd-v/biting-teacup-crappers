import { startPetUpdateJobs } from "./app/services/petUpdates";

export const register = () => {
  console.log("Starting updates for all pets");
  startPetUpdateJobs();
};

export const runtime = "experimental-edge";
