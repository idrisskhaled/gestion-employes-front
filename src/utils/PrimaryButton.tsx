import React from "react";
import { twMerge } from "tailwind-merge";

type PrimaryButtonProps = {
  children: React.ReactNode;
  onClick: (e: any) => void;
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
}) => {
  return (
    <button
      className={twMerge(
        `w-full py-3 font-semibold rounded-lg outline-none bg-sky-500 text-white flex justify-center`
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
