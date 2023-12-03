import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../../utils/LoadingButton";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployeeFn } from "../../api/employeeApi";
import NProgress from "nprogress";
import FileUpload from "../../utils/FileUpload";
import { ICreateEmployee, IEmployee } from "../../api/types";
import { BlobServiceClient } from "@azure/storage-blob";

type ICreateEmployeeProps = {
  setOpenEmployeeModal: (open: boolean) => void;
};

const createEmployeeSchema = object({
  firstName: string().min(1, "firstName is required"),
  lastName: string().min(1, "lastName is required"),
  occupation: string().min(1, "occupation is required"),
  email: string().min(1, "email is required"),
});

export type CreateEmployeeInput = TypeOf<typeof createEmployeeSchema>;
const azureClient = process.env.REACT_APP_AZURE_SERVICE_CLIENT || "";

const CreateEmployee: FC<ICreateEmployeeProps> = ({ setOpenEmployeeModal }) => {
  const methods = useForm<CreateEmployeeInput>({
    resolver: zodResolver(createEmployeeSchema),
  });
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const queryClient = useQueryClient();

  const { mutate: createEmployee } = useMutation({
    mutationFn: (employee: ICreateEmployee) => createEmployeeFn(employee),
    onMutate() {
      NProgress.start();
    },
    onSuccess(data) {
      queryClient.invalidateQueries(["getEmployees"]);
      setOpenEmployeeModal(false);
      NProgress.done();
      toast("Employee created successfully", {
        type: "success",
        position: "top-right",
      });
    },
    onError(error: any) {
      setOpenEmployeeModal(false);
      NProgress.done();
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

  const onSubmitHandler: SubmitHandler<CreateEmployeeInput> = async (data) => {
    if (file) {
      const blobServiceClient = new BlobServiceClient(azureClient);
      const containerClient = blobServiceClient.getContainerClient("employes");
      const blobClient = containerClient.getBlobClient((file as any).name);
      const blockBlobClient = blobClient.getBlockBlobClient();
      const result = await blockBlobClient.uploadBrowserData(file, {
        blockSize: 4 * 1024 * 1024,
        concurrency: 20,
        onProgress: (ev) => console.log(ev),
        blobHTTPHeaders: {
          blobContentType: (file as any).type,
        },
      });
      createEmployee({ ...data, fileUrl: blobClient.url });
    } else {
      createEmployee(data);
    }
  };
  return (
    <section>
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
        <h2 className="text-2xl text-ct-dark-600 font-semibold">
          Create Employee
        </h2>
        <div
          onClick={() => setOpenEmployeeModal(false)}
          className="text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center cursor-pointer"
        >
          <i className="bx bx-x"></i>
        </div>
      </div>
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
        <FileUpload setFile={setFile}>Profile Picture</FileUpload>
        <LoadingButton loading={false}>Create Employee</LoadingButton>
      </form>
    </section>
  );
};

export default CreateEmployee;
