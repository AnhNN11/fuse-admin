"use client";
import { useParams } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";

import { useEffect, useState } from "react";
import { useGetAllDepartmentByClubQuery } from "@/store/queries/departmentManagement";
import { useCreateEngagementMutation } from "@/store/queries/engagementManagement";
import { useAppSelector } from "@/hooks/redux-toolkit";
import { RootState } from "@/store";
import { Button, Flex, Form, FormProps, Select, Spin, message } from "antd";
import UploadFile, {
  UploadFileProps,
} from "@/components/core/common/UploadFile";

interface DataType {
  key: string;
  _id: string;
  user: {
    _id: string;
    firstname: string;
    lastname: string;
  };
  department: {
    _id: string;
    name: string;
  };
  role: {
    _id: string;
    name: string;
  };
  status: "NEW" | "REJECTED" | "MEMBER" | "DROP_OUT";
  createdAt: string;
  updatedAt: string;
}

interface DepartmentDataType {
  key: string;
  _id: string;
  name: string;
}

type FieldType = {
  user?: string;
  department?: string;
  club?: string;
  cvUrl?: string;
};

function JoinAClubModule({
  clubId,
  refetch,
  onSaveSuccess,
}: {
  clubId: string;
  refetch: () => void;
  onSaveSuccess: () => void;
}) {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "engagement");
  const [myForm] = Form.useForm<FieldType>();
  const [createEngagement] = useCreateEngagementMutation();
  const { userInfo } = useAppSelector((state: RootState) => state.auth);
  const [cvUrl, setCvUrl] = useState("");
  const [isCvUploaded, setIsCvUploaded] = useState(false);

  const { result: departmentResult, isFetching: departmentIsFetching } =
    useGetAllDepartmentByClubQuery(
      {
        id: clubId,
      },
      {
        selectFromResult: ({ data, isFetching }) => {
          const newClubDepartmentData = data?.result?.map(
            (department: DepartmentDataType) => ({
              label: department.name,
              value: department._id,
            })
          );
          return {
            result: newClubDepartmentData ?? [],
            isFetching,
          };
        },
      }
    );

  console.log(departmentResult);
  console.log(clubId);

  useEffect(() => {
    if (clubId) {
      myForm.setFieldsValue({
        user: userInfo?._id,
        department: "",
        club: clubId,
        cvUrl: "",
      });
    }
  }, [clubId, myForm, userInfo]);

  const handleSubmit: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const data = {
        user: userInfo?._id,
        club: clubId,
        cvUrl: cvUrl,
        department: values?.department,
      };

      await createEngagement({
        body: data,
      }).unwrap();
      message.success("Create application successfully");
      refetch && refetch();
      onSaveSuccess && onSaveSuccess();
    } catch (error) {
      message.error("Create application failed");
    }
  };

  const handleSuccess: UploadFileProps["onSuccess"] = (
    fileName: string,
    downloadURL: string
  ) => {
    setCvUrl(downloadURL);
    setIsCvUploaded(true);
    console.log(fileName);
  };

  const handleError: UploadFileProps["onError"] = (fileName: string) => {
    console.error(`File ${fileName} upload failed.`);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log(errorInfo);
  };

  return (
    <Spin spinning={departmentIsFetching} tip="Loading...">
      {userInfo ? (
        <Form
          form={myForm}
          name="basic"
          labelAlign="left"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, marginTop: "16px" }}
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType> label={t("department")} name="department">
            <Select
              options={departmentResult}
              loading={departmentIsFetching}
              placeholder="Chọn ban hoạt động"
              allowClear
            />
          </Form.Item>
          <Form.Item label={t("CV")}></Form.Item>
          <UploadFile
            onSuccess={handleSuccess}
            onError={handleError}
            uploadPath="engagements"
          />
          <Form.Item
            wrapperCol={{ offset: 8, span: 16 }}
            style={{ marginTop: "16px", marginBottom: "16px" }}
          >
            <Flex justify="flex-end" align="flex-end">
              <Button disabled={!isCvUploaded} type="primary" htmlType="submit">
                {t("submit")}
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      ) : (
        <p>Bạn cần đăng nhập để đăng ký tham gia câu lạc bộ</p>
      )}
    </Spin>
  );
}

export default JoinAClubModule;
