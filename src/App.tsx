import "react-toastify/dist/ReactToastify.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import EmployeeModal from "./components/employee.modal";
import CreateEmployee from "./components/employees/create.employee";
import NProgress from "nprogress";
import EmployeeItem from "./components/employees/employee.component";
import { IEmployee } from "./api/types";
import { getEmployeesFn } from "./api/employeeApi";
import insat from "./assets/insat.png";
import uc from "./assets/uc.png";

function AppContent() {
  const [openEmployeeModal, setOpenEmployeeModal] = useState(false);

  const {
    data: employees,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["getEmployees"],
    queryFn: () => getEmployeesFn(),
    staleTime: 5 * 1000,
    select: (data) => data,
    onSuccess() {
      NProgress.done();
    },
    onError(error: any) {
      const resMessage =
        error.response.data.message ||
        error.response.data.detail ||
        error.message ||
        error.toString();
      toast(resMessage, {
        type: "error",
        position: "top-right",
      });
      NProgress.done();
    },
  });

  useEffect(() => {
    if (isLoading || isFetching) {
      NProgress.start();
    }
  }, [isLoading, isFetching]);
  return (
    <div className="flex flex-col h-100">
      <div className="flex justify-between w-100 p-8">
        <span className="w-[100px]">
          <img src={insat} />
        </span>
        <span className="w-[100px]">
          <img src={uc} />
        </span>
      </div>
      <div className="w-100 flex justify-center font-bold text-2xl">
        Meet our team
      </div>
      <EmployeeModal
        openEmployeeModal={openEmployeeModal}
        setOpenEmployeeModal={setOpenEmployeeModal}
      >
        <CreateEmployee setOpenEmployeeModal={setOpenEmployeeModal} />
      </EmployeeModal>
      <div className="mx-auto">
        <div className="m-8 gap-7 flex flex-col md:flex-row w-100">
          {(employees as any)?.map((employee: IEmployee) => (
            <EmployeeItem key={employee.idUser} employee={employee} />
          ))}
          <div className="p-4 min-h-[18rem] w-[300px] bg-gray rounded-lg border border-gray-200 shadow-md flex flex-col items-center justify-center">
            <div
              onClick={() => setOpenEmployeeModal(true)}
              className="flex items-center justify-center h-20 w-20 border-2 border-dashed border-black rounded-full text-black text-5xl cursor-pointer"
            >
              <i className="bx bx-plus"></i>
            </div>
            <h4
              onClick={() => setOpenEmployeeModal(true)}
              className="text-lg font-medium text-black mt-5 cursor-pointer"
            >
              Add new Employee
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
