import axios from "axios";
import { CreateEmployeeInput } from "../components/employees/create.employee";
import { UpdateEmployeeInput } from "../components/employees/update.employee";
import { IEmployeeResponse, IEmployeesResponse } from "./types";

const BASE_URL = process.env.REACT_APP_BACK_URL || "http://localhost:8080/api/user/employee";

export const EmployeeApi = axios.create({
  baseURL: BASE_URL,
});

// EmployeeApi.defaults.headers.common["content-type"] = "application/json";

export const createEmployeeFn = async (Employee: CreateEmployeeInput) => {
  const response = await EmployeeApi.post<IEmployeeResponse>("", Employee);
  return response.data;
};

export const updateEmployeeFn = async (EmployeeId: string, Employee: UpdateEmployeeInput) => {
  const response = await EmployeeApi.put<IEmployeeResponse>(`/${EmployeeId}`, Employee);
  return response.data;
};

export const deleteEmployeeFn = async (EmployeeId: string) => {
  return EmployeeApi.delete<null>(`/${EmployeeId}`);
};

export const getSingleEmployeeFn = async (EmployeeId: string) => {
  const response = await EmployeeApi.get<IEmployeeResponse>(`/${EmployeeId}`);
  return response.data;
};

export const getEmployeesFn = async () => {
  const response = await EmployeeApi.get<IEmployeesResponse>(
    ``
  );
  return response.data;
};
