import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/services/firebase/config";

export interface UploadFileProps {
  onSuccess?: (fileName: string, downloadURL: string) => void;
  onError?: (fileName: string) => void;
  uploadPath?: string;
}

const UploadFile: React.FC<UploadFileProps> = ({
  onSuccess,
  onError,
  uploadPath = "uploads",
}) => {
  const handleFileUpload = async (file: File) => {
    const storageRef = ref(storage, `${uploadPath}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    try {
      // Upload file
      await uploadTask;

      // Get download URL
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      // Handle success message
      message.success(`${file.name} file uploaded successfully.`);

      // Invoke onSuccess callback if provided
      if (onSuccess) {
        onSuccess(file.name, downloadURL);
      }
    } catch (error) {
      // Handle error
      console.error("Error uploading file:", error);
      message.error(`${file.name} file upload failed.`);

      // Invoke onError callback if provided
      if (onError) {
        onError(file.name);
      }
    }
  };

  const handleUploadChange = async (info: any) => {
    const { status, originFileObj } = info.file;

    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }

    if (status === "done") {
      // Perform additional handling if needed
      await handleFileUpload(originFileObj);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);

      // Invoke onError callback if provided
      if (onError) {
        onError(info.file.name);
      }
    }
  };

  return (
    <Upload.Dragger
      name="file"
      multiple={true}
      action=""
      onChange={handleUploadChange}
      onDrop={(e) => console.log("Dropped files", e.dataTransfer.files)}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading
        company data or other banned files.
      </p>
    </Upload.Dragger>
  );
};

export default UploadFile;
