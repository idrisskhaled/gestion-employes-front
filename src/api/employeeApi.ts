import axios from "axios";
import { ICreateEmployee, IEmployeeResponse, IEmployeesResponse } from "./types";

const BASE_URL =
  process.env.REACT_APP_EMPLOYEE_API ?? "http://localhost:8081/api/employee";

export const EmployeeApi = axios.create({
  baseURL: BASE_URL,
});

export const createEmployeeFn = async (employee: ICreateEmployee) => {
  const response = await EmployeeApi.post<IEmployeeResponse>("", employee);
  return response.data;
};

export const updateEmployeeFn = async (
  EmployeeId: string,
  Employee: ICreateEmployee
) => {
  const response = await EmployeeApi.put<IEmployeeResponse>(
    `/${EmployeeId}`,
    Employee
  );
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
  const response = await EmployeeApi.get<IEmployeesResponse>(``);
  return response.data;
};
