import { startPetUpdateJobs } from "./app/services/petUpdates";

export const register = () => {
  if (process.env.NODE_ENV === "development") {
    startPetUpdateJobs();
  } else {
    console.log("No longer instrumenting");
  }
};

export const runtime = "experimental-edge";
