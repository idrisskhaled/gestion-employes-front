import React from "react";
const FileUpload = ({
  setFile,
  children,
}: {
  setFile: (file: File | null) => void;
  children: any;
}) => {
  return (
    <div className="mb-2">
      <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
        {children}
      </label>
      <input
        type="file"
        onChange={(event) =>
          setFile(event.target.files && event.target.files[0])
        }
      />
    </div>
  );
};

export default FileUpload;
