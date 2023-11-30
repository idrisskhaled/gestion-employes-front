import React, { FC, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import UpdateEmployee from "./update.employee";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import NProgress from "nprogress";
import { deleteEmployeeFn } from "../../api/employeeApi";
import { IEmployee } from "../../api/types";
import EmployeeModal from "../employee.modal";

type employeeItemProps = {
  employee: IEmployee;
};

const EmployeeItem: FC<employeeItemProps> = ({ employee }) => {
  const [openSettings, setOpenSettings] = useState(false);
  const [openEmployeeModal, setOpenEmployeeModal] = useState(false);

  // My addition
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdown = document.getElementById(
        `settings-dropdown-${employee.userId}`
      );

      if (dropdown && !dropdown.contains(target)) {
        setOpenSettings(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [employee.userId]);

  const queryClient = useQueryClient();
  const { mutate: deleteEmployee } = useMutation({
    mutationFn: (EmployeeId: string) => deleteEmployeeFn(EmployeeId),
    onMutate() {
      NProgress.start();
    },
    onSuccess(data) {
      queryClient.invalidateQueries(["getEmployees"]);
      toast("Employee deleted successfully", {
        type: "warning",
        position: "top-right",
      });
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

  const onDeleteHandler = (employeeId: string) => {
    if (window.confirm("Are you sure")) {
      deleteEmployee(employeeId);
    }
  };
  return (
    <>
      <div className="bg-white rounded-lg w-[300px] border border-gray-200 shadow-md flex flex-col justify-between overflow-hidden">
        <div className="flex justify-center">
          <img src="src/assets/default-profile.png" className="w-100 mb-4"></img>
        </div>
        <div className="p-2 details">
          <h4 className="text-2xl font-semibold tracking-tight text-gray-900">
            {(employee.firstName + " " + employee.lastName).length > 40
              ? (employee.firstName + " " + employee.lastName).substring(
                  0,
                  40
                ) + "..."
              : employee.firstName + " " + employee.lastName}
          </h4>
          <p className="mb-3 font-normal text-ct-dark-200">
            {employee.occupation.length > 210
              ? employee.occupation.substring(0, 210) + "..."
              : employee.occupation}
          </p>
        </div>
        <div className="p-2 relative border-t border-slate-300 flex justify-between items-center">
          <span className="text-ct-dark-100 text-sm">{employee.email}</span>
          <div
            onClick={() => setOpenSettings(!openSettings)}
            className="text-ct-dark-100 text-lg cursor-pointer"
          >
            <i className="bx bx-dots-horizontal-rounded"></i>
          </div>
          <div
            id={`settings-dropdown-${employee.userId}`}
            className={twMerge(
              `absolute right-0 bottom-3 z-10 w-28 text-base list-none bg-white rounded divide-y divide-gray-100 shadow`,
              `${openSettings ? "block" : "hidden"}`
            )}
          >
            <ul className="py-1" aria-labelledby="dropdownButton">
              <li
                onClick={() => {
                  setOpenSettings(false);
                  setOpenEmployeeModal(true);
                }}
                className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <i className="bx bx-pencil"></i> Edit
              </li>
              <li
                onClick={() => {
                  setOpenSettings(false);
                  onDeleteHandler(employee.userId);
                }}
                className="py-2 px-4 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
              >
                <i className="bx bx-trash"></i> Delete
              </li>
            </ul>
          </div>
        </div>
      </div>
      <EmployeeModal
        openEmployeeModal={openEmployeeModal}
        setOpenEmployeeModal={setOpenEmployeeModal}
      >
        <UpdateEmployee employee={employee} setOpenEmployeeModal={setOpenEmployeeModal} />
      </EmployeeModal>
    </>
  );
};

export default EmployeeItem;
