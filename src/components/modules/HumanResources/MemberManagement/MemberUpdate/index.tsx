"use client";
import { useParams } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";

import { useEffect } from "react";
import { useGetAllDepartmentByClubQuery } from "@/store/queries/departmentManagement";
import { useGetAllRolesQuery } from "@/store/queries/roleManagement";
import {
  useGetEngagementByIdQuery,
  useUpdateEngagementMutation,
} from "@/store/queries/engagementManagement";
import { useAppSelector } from "@/hooks/redux-toolkit";
import { RootState } from "@/store";
import { Button, Flex, Form, FormProps, Select, Spin, message } from "antd";

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

interface RoleDataType {
  key: string;
  _id: string;
  name: string;
}

type FieldType = {
  _id: string;
  name?: string;
  department?: string;
  role?: string;
  status?: string;
};

function MemberUpdateModule({
  engagementId,
  refetch,
  onSaveSuccess,
}: {
  engagementId: string;
  refetch: () => void;
  onSaveSuccess: () => void;
}) {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "memberManagement");
  const [myForm] = Form.useForm<FieldType>();
  const [updateEngagement] = useUpdateEngagementMutation();
  const { currentClub } = useAppSelector((state: RootState) => state.auth);

  const statusOptions = [
    { value: "MEMBER", label: t("statusFilter.MEMBER") },
    { value: "DROP_OUT", label: t("statusFilter.DROP_OUT") },
  ];
  const { result, isFetching } = useGetEngagementByIdQuery(engagementId, {
    selectFromResult: ({ data, isFetching }) => {
      return {
        result: data?.result,
        total: data?.count ?? 0,
        isFetching,
      };
    },
  });

  const { result: departmentResult, isFetching: departmentIsFetching } =
    useGetAllDepartmentByClubQuery(
      {
        id: currentClub?._id,
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

  const { result: roleResult, isFetching: roleIsFetching } =
    useGetAllRolesQuery(
      {},
      {
        selectFromResult: ({ data, isFetching }) => {
          const newRoleData = data?.result?.map((role: RoleDataType) => ({
            label: role.name,
            value: role._id,
          }));
          return {
            result: newRoleData ?? [],
            isFetching,
          };
        },
      }
    );

  useEffect(() => {
    if (engagementId) {
      myForm.setFieldsValue({
        name: result?.user?.firstname + " " + result?.user?.lastname,
        department: result?.department?._id,
        role: result?.role?._id,
        status: result?.status,
      });
    }
  }, [engagementId, result, myForm]);

  const handleSubmit: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const data = {
        department: values?.department,
        role: values?.role,
        status: values?.status,
      };

      await updateEngagement({
        id: engagementId,
        body: data,
      }).unwrap();
      message.success("Update member successfully");
      refetch && refetch();
      onSaveSuccess && onSaveSuccess();
    } catch (error) {
      message.error("Update member failed");
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log(errorInfo);
  };

  return (
    <Spin spinning={isFetching} tip="Loading...">
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
          <Select options={departmentResult} loading={departmentIsFetching} />
        </Form.Item>
        <Form.Item<FieldType> label={t("role")} name="role">
          <Select options={roleResult} loading={roleIsFetching} />
        </Form.Item>

        <Form.Item<FieldType> label={t("status")} name="status">
          <Select options={statusOptions} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Flex justify="flex-end" align="flex-end">
            <Button type="primary" htmlType="submit">
              {t("submit")}
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Spin>
  );
}

export default MemberUpdateModule;
