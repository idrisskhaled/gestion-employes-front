import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../../utils/LoadingButton";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import NProgress from "nprogress";
import FileUpload from "../../utils/FileUpload";
import { BlobServiceClient } from "@azure/storage-blob";
import { createExperienceFn } from "../../api/experiencesApi";
import { ICreateExperience, IEmployee } from "../../api/types";

type ICreateExperienceProps = {
  setOpenExperienceModal: (open: boolean) => void;
  employee: IEmployee;
};
const azureClient = process.env.REACT_APP_AZURE_SERVICE_CLIENT || "";

const createExperienceSchema = object({
  startDate: string().min(1, "startDate is required"),
  endDate: string().min(1, "endDate is required"),
  positionTitle: string().min(1, "positionTitle is required"),
  companyName: string().min(1, "companyName is required"),
});

export type CreateExperienceInput = TypeOf<typeof createExperienceSchema>;

const CreateExperience: FC<ICreateExperienceProps> = ({
  setOpenExperienceModal,
  employee,
}) => {
  const methods = useForm<CreateExperienceInput>({
    resolver: zodResolver(createExperienceSchema),
  });
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const queryClient = useQueryClient();

  const { mutate: createExperience, isLoading: loading } = useMutation({
    mutationFn: (experience: ICreateExperience) =>
      createExperienceFn(experience),
    onMutate() {
      NProgress.start();
    },
    onSuccess(data) {
      queryClient.invalidateQueries(["getExperiences"]);
      setOpenExperienceModal(false);
      NProgress.done();
      toast("Experience created successfully", {
        type: "success",
        position: "top-right",
      });
    },
    onError(error: any) {
      setOpenExperienceModal(false);
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

  const onSubmitHandler: SubmitHandler<CreateExperienceInput> = async (
    data
  ) => {
    if (file) {
      const blobServiceClient = new BlobServiceClient(azureClient);
      const containerClient = blobServiceClient.getContainerClient("employes");
      const blobClient = containerClient.getBlobClient((file as any).name);
      const blockBlobClient = blobClient.getBlockBlobClient();
      await blockBlobClient.uploadBrowserData(file, {
        blockSize: 4 * 1024 * 1024,
        concurrency: 20,
        onProgress: (ev) => console.log(ev),
        blobHTTPHeaders: {
          blobContentType: (file as any).type,
        },
      });
      createExperience({
        ...data,
        companyLogo: blobClient.url,
        idUser: employee.idUser,
      });
    } else {
      createExperience({
        ...data,
        idUser: employee.idUser,
      });
    }
  };
  return (
    <section>
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
        <h2 className="text-2xl text-ct-dark-600 font-semibold">
          Create Experience
        </h2>
        <div
          onClick={() => setOpenExperienceModal(false)}
          className="text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center cursor-pointer"
        >
          <i className="bx bx-x"></i>
        </div>
      </div>
      <form className="w-full flex flex-col justify-between" onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Position Title
          </label>
          <input
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
              `${errors["positionTitle"] && "border-red-500"}`
            )}
            {...methods.register("positionTitle")}
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Company Name
          </label>
          <input
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
              `${errors["companyName"] && "border-red-500"}`
            )}
            {...methods.register("companyName")}
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Start date
          </label>
          <input
            type="date"
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
              `${errors["startDate"] && "border-red-500"}`
            )}
            {...methods.register("startDate")}
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            End date
          </label>
          <input
            type="date"
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
              `${errors["endDate"] && "border-red-500"}`
            )}
            {...methods.register("endDate")}
          />
        </div>
        <FileUpload setFile={setFile} >Company Logo</FileUpload>
        <LoadingButton loading={loading}>Create Experience</LoadingButton>
      </form>
    </section>
  );
};

export default CreateExperience;
