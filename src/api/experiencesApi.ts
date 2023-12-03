import axios from "axios";
import {
  ICreateExperience,
  IExperienceResponse,
  IExperiencesResponse,
} from "./types";

const BASE_URL =
  process.env.REACT_APP_EXPERIENCE_API ||
  "http://localhost:8082/api/experience";

export const ExperienceApi = axios.create({
  baseURL: BASE_URL,
});

export const createExperienceFn = async (experience: ICreateExperience) => {
  const response = await ExperienceApi.post<IExperienceResponse>(
    "",
    experience
  );
  return response.data;
};

export const getEmployeeExperiencesFn = async (employeeId: String) => {
  const response = await ExperienceApi.get<IExperiencesResponse>(
    "/employee/" + employeeId
  );
  return response.data;
};

export const deleteExperienceFn = async (experienceId: string) => {
  return ExperienceApi.delete<null>(`/${experienceId}`);
};
