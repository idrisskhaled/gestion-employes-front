export type IEmployee = {
  idUser: string;
  email: string;
  firstName: string;
  lastName: string;
  occupation: string;
  fileUrl?: string
};
export type ICreateEmployee = {
  email: string;
  firstName: string;
  lastName: string;
  occupation: string;
  fileUrl?: string
};

export type IExperience = {
  idUser: string;
  idExperience: string;
  startDate: string;
  endDate: string;
  positionTitle: string;
  companyName: string;
  companyLogo?: string;
};

export type ICreateExperience = {
  idUser: string;
  startDate: string;
  endDate: string;
  positionTitle: string;
  companyName: string;
  companyLogo?: string;
};


export type IGenericResponse = {
  status: string;
  message: string;
};

export type IEmployeeResponse = {
  status: string;
  note: IEmployee;
};

export type IExperienceResponse = {
  status: string;
  note: IExperience;
};

export type IEmployeesResponse = {
  status: string;
  results: number;
  employees: IEmployee[];
};

export type IExperiencesResponse = {
  status: string;
  results: number;
  experiences: IExperience[];
};

