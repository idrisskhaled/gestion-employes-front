export type IEmployee = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  occupation: string;
};

export type IGenericResponse = {
  status: string;
  message: string;
};

export type IEmployeeResponse = {
  status: string;
  note: IEmployee;
};

export type IEmployeesResponse = {
  status: string;
  results: number;
  employees: IEmployee[];
};
