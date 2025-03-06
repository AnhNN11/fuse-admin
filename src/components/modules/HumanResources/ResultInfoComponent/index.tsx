"use client";
import {
  Button,
  Flex,
  Form,
  FormProps,
  Input,
  Select,
  Spin,
  message,
  Col,
  Row,
  Timeline,
} from "antd";
import Typography from "@/components/core/common/Typography";

import moment from "moment";
import { useParams } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";

import { useEffect, useState } from "react";
import { useGetAllDepartmentByClubQuery } from "@/store/queries/departmentManagement";
import { useGetAllRolesQuery } from "@/store/queries/roleManagement";
import { useUpdateEngagementMutation } from "@/store/queries/engagementManagement";
import { useAppSelector } from "@/hooks/redux-toolkit";
import { RootState } from "@/store";

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
  step: number;
  entranceInterview: {
    _id: string;
    startTime: string | null;
    endTime: string | null;
    note: string;
    comment: string;
    status:
      | "NEW"
      | "SENT_INTERVIEW"
      | "INTERVIEWED"
      | "APPROVED"
      | "REJECTED"
      | "CANCELED";
    createdAt: string;
    updatedAt: string;
  };
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
  interviewStatus?: string;
  status?: string;
};

function ResultInfoModule({
  engagement,
  isFetching,
  refetch,
}: {
  engagement: DataType;
  isFetching: boolean;
  refetch: () => void;
}) {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "engagement");
  const [myForm] = Form.useForm<FieldType>();
  const [updateEngagement, { isLoading }] = useUpdateEngagementMutation();
  const { currentClub } = useAppSelector((state: RootState) => state.auth);

  const interviewStatusOptions = [
    { value: "NEW", label: t("interviewStatusFilter.NEW") },
    {
      value: "SENT_INTERVIEW",
      label: t("interviewStatusFilter.SENT_INTERVIEW"),
    },
    { value: "INTERVIEWED", label: t("interviewStatusFilter.INTERVIEWED") },
    { value: "APPROVED", label: t("interviewStatusFilter.APPROVED") },
    { value: "REJECTED", label: t("interviewStatusFilter.REJECTED") },
    { value: "CANCELED", label: t("interviewStatusFilter.CANCELED") },
  ];

  const statusOptions = [
    { value: "NEW", label: t("statusFilter.NEW") },
    { value: "REJECTED", label: t("statusFilter.REJECTED") },
    { value: "MEMBER", label: t("statusFilter.MEMBER") },
  ];

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
    if (engagement) {
      myForm.setFieldsValue({
        name: engagement?.user?.firstname + " " + engagement?.user?.lastname,
        department: engagement?.department?._id,
        role: engagement?.role?._id,
        interviewStatus: engagement?.entranceInterview?.status,
        status: engagement?.status,
      });
    }
  }, [engagement, myForm]);

  const handleSubmit: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const data = {
        department: values?.department,
        role: values?.role,
        status: values?.status,
      };

      await updateEngagement({
        id: params?.engagementId as string,
        body: data,
      }).unwrap();
      message.success("Update application successfully");
      refetch && refetch();
    } catch (error) {
      message.error("Update application failed");
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log(errorInfo);
  };

  return (
    <Spin spinning={isFetching} tip="Loading...">
      <Flex justify={"space-between"} align={"flex-end"}>
        <Typography.Title level={2}>{t("resultInfo.title")}</Typography.Title>
      </Flex>
      <Row gutter={[16, 16]}>
        <Col xs={{ flex: "100%" }} md={{ flex: "50%" }}>
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
            <Form.Item<FieldType> label={t("resultInfo.name")} name="name">
              <Input disabled />
            </Form.Item>

            <Form.Item<FieldType>
              label={t("resultInfo.department")}
              name="department"
            >
              <Select
                options={departmentResult}
                loading={departmentIsFetching}
              />
            </Form.Item>
            <Form.Item<FieldType> label={t("resultInfo.role")} name="role">
              <Select
                options={roleResult}
                loading={roleIsFetching}
                placeholder="Member"
              />
            </Form.Item>

            <Form.Item<FieldType>
              label={t("resultInfo.interview")}
              name="interviewStatus"
            >
              <Select options={interviewStatusOptions} disabled />
            </Form.Item>

            <Form.Item<FieldType> label={t("resultInfo.result")} name="status">
              <Select options={statusOptions} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {t("resultInfo.submit")}
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col xs={{ flex: "100%" }} md={{ flex: "50%" }}>
          <Timeline
            items={[
              {
                children: `${t("resultInfo.createdAt")}: ${moment(
                  engagement?.createdAt
                ).format("DD/MM/YYYY HH:mm ")}`,
              },
              {
                children: `${t("resultInfo.updatedAt")}: ${moment(
                  engagement?.updatedAt
                ).format("DD/MM/YYYY HH:mm ")}`,
              },
            ]}
          />
        </Col>
      </Row>
    </Spin>
  );
}

export default ResultInfoModule;
