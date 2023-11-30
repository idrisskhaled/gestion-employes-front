import { FC, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../LoadingButton";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IEmployee } from "../../api/types";
import { updateEmployeeFn } from "../../api/employeeApi";

type IUpdateEmployeeProps = {
  employee: IEmployee;
  setOpenEmployeeModal: (open: boolean) => void;
};

const updateEmployeeSchema = object({
  firstName: string().min(1, "firstName is required"),
  lastName: string().min(1, "lastName is required"),
  occupation: string().min(1, "occupation is required"),
  email: string().min(1, "email is required"),
});

export type UpdateEmployeeInput = TypeOf<typeof updateEmployeeSchema>;

const UpdateEmployee: FC<IUpdateEmployeeProps> = ({ employee, setOpenEmployeeModal }) => {
  const methods = useForm<UpdateEmployeeInput>({
    resolver: zodResolver(updateEmployeeSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (employee) {
      methods.reset(employee);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryClient = useQueryClient();
  const { mutate: updateEmployee } = useMutation({
    mutationFn: ({ employeeId, Employee }: { employeeId: string; Employee: UpdateEmployeeInput }) =>
      updateEmployeeFn(employeeId, Employee),
    onSuccess(data) {
      queryClient.invalidateQueries(["getEmployees"]);
      setOpenEmployeeModal(false);
      toast("Employee updated successfully", {
        type: "success",
        position: "top-right",
      });
    },
    onError(error: any) {
      setOpenEmployeeModal(false);
      const resMessage =
        error.response.data.message ||
        error.response.data.detail ||
        error.message ||
        error.toString();
      toast(resMessage, {
        type: "error",
        position: "top-right",
      });
    },
  });

  const onSubmitHandler: SubmitHandler<UpdateEmployeeInput> = async (data) => {
    updateEmployee({ employeeId: employee.userId, Employee: data }); 
  };
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-ct-dark-600 font-semibold">Update Employee</h2>
        <div
          onClick={() => setOpenEmployeeModal(false)}
          className="text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center cursor-pointer"
        >
          <i className="bx bx-x"></i>
        </div>
      </div>{" "}
      <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            First Name
          </label>
          <input
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
              `${errors["firstName"] && "border-red-500"}`
            )}
            {...methods.register("firstName")}
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Last Name
          </label>
          <input
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
              `${errors["lastName"] && "border-red-500"}`
            )}
            {...methods.register("lastName")}
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Occupation
          </label>
          <input
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
              `${errors["occupation"] && "border-red-500"}`
            )}
            {...methods.register("occupation")}
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Email
          </label>
          <input
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
              `${errors["email"] && "border-red-500"}`
            )}
            {...methods.register("email")}
          />
        </div>
        <LoadingButton loading={false}>Update Employee</LoadingButton>
      </form>
    </section>
  );
};

export default UpdateEmployee;
