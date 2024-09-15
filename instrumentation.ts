import { startPetUpdateJobs } from "./app/services/petUpdates";

const register = () => {
  console.log("Starting updates for all pets");
  startPetUpdateJobs();
};

const runtime = "experimental-edge";

export { register, runtime };
