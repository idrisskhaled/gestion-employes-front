import { FC } from "react";
import { IExperience } from "../../api/types";
import companyLogo from "../../assets/insat.png";

type IExperienceProps = {
  experience: IExperience;
  onDelete: (id: string) => void;
};

const ExperienceItem: FC<IExperienceProps> = ({ experience, onDelete }) => {
  return (
    <section>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <img
              src={experience.companyLogo || companyLogo}
              className="w-[40px] h-[40px]"
            />
            <div className="flex flex-col">
              <div className="font-bold">{experience.companyName}</div>
              <div>{experience.positionTitle}</div>
            </div>
          </div>
          <div className="flex text-[12px] gap-1">
            <div className="flex flex-col justify-center">
              {new Date(experience.startDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
              -
            </div>
            <div className="flex flex-col justify-center">
              {new Date(experience.endDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </div>
            <span
              onClick={() => {
                onDelete(experience.idExperience);
              }}
              className="px-1 flex flex-col justify-center text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
            >
              <i className="bx bx-trash"></i>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceItem;
