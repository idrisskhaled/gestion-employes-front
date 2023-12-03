import { FC, useState } from "react";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IEmployee, IExperience } from "../../api/types";
import { deleteExperienceFn, getEmployeeExperiencesFn } from "../../api/experiencesApi";
import ExperienceItem from "./experience.component";
import { PrimaryButton } from "../../utils/PrimaryButton";
import EmployeeModal from "../employee.modal";
import CreateExperience from "./create.experience";
import NProgress from "nprogress";

type IExperiencesProps = {
  employee: IEmployee;
  setOpenEmployeeModal: (open: boolean) => void;
};

const Experiences: FC<IExperiencesProps> = ({
  employee,
  setOpenEmployeeModal,
}) => {
  const [openExperienceModal, setOpenExperienceModal] = useState(false);
  const { data: experiences } = useQuery({
    queryKey: ["getExperiences", employee.idUser],
    queryFn: () => getEmployeeExperiencesFn(employee.idUser),
    staleTime: 5 * 1000,
    select: (data: any) => data,
    onSuccess() {},
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
    },
  });

  
  const queryClient = useQueryClient();
  const { mutate: deleteExperience } = useMutation({
    mutationFn: (EmployeeId: string) => deleteExperienceFn(EmployeeId),
    onMutate() {
      NProgress.start();
    },
    onSuccess(data) {
      queryClient.invalidateQueries(["getExperiences"]);
      toast("Experience deleted successfully", {
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

  
  const onDeleteHandler = (experienceId: string) => {
    if (window.confirm("Are you sure")) {
      deleteExperience(experienceId);
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[15px] text-black font-semibold">
          Les expériences de {employee.firstName} {employee.lastName}
        </h2>
        <div
          onClick={() => setOpenEmployeeModal(false)}
          className="text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center cursor-pointer"
        >
          <i className="bx bx-x"></i>
        </div>
      </div>

      <div className="gap-4 flex flex-col">
        {(experiences as any)?.map((experience: IExperience) => (
          <ExperienceItem key={experience.idUser} experience={experience} onDelete={(id)=>onDeleteHandler(id)} />
        ))}
      </div>
      <div className="flex gap-2 h-[50px] mt-4">
        <PrimaryButton onClick={()=>setOpenExperienceModal(true)}>Add Experience</PrimaryButton>
      </div>
      <EmployeeModal
        openEmployeeModal={openExperienceModal}
        setOpenEmployeeModal={setOpenExperienceModal}
      >
        <CreateExperience setOpenExperienceModal={setOpenExperienceModal} employee={employee} />
      </EmployeeModal>
    </section>
  );
};

export default Experiences;
