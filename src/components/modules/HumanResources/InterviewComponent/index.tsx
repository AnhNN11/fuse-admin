"use client";
import {
  Button,
  Flex,
  Form,
  FormProps,
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

import { useInterviewMutation } from "@/store/queries/entranceInterviewManagement";
import { useAppSelector } from "@/hooks/redux-toolkit";
import { RootState } from "@/store";
import TextArea from "antd/es/input/TextArea";

interface DataType {
  key: string;
  _id: string;
  entranceInterview: {
    _id: string;
    startTime: string | null;
    endTime: string | null;
    note: string;
    comment: CommentDataType | null;
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

interface CommentDataType {
  key: string;
  _id: string;
  attitude: string;
  engagementLevel: string;
  specialize: string;
  comment: string;
}

type FieldType = {
  _id: string;
  attitude?: string;
  engagementLevel?: string;
  specialize?: string;
  comment?: string;
  interviewStatus?: string;
};

function InterviewModule({
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
  const [updateInterview, { isLoading }] = useInterviewMutation();

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

  useEffect(() => {
    if (engagement) {
      myForm.setFieldsValue({
        attitude: engagement?.entranceInterview?.comment?.attitude,
        engagementLevel:
          engagement?.entranceInterview?.comment?.engagementLevel,
        specialize: engagement?.entranceInterview?.comment?.specialize,
        comment: engagement?.entranceInterview?.comment?.comment,
        interviewStatus: engagement?.entranceInterview?.status,
      });
    }
  }, [engagement, myForm]);

  const handleSubmit: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const data = {
        status: values?.interviewStatus,
        comment: {
          attitude: values?.attitude,
          engagementLevel: values?.engagementLevel,
          specialize: values?.specialize,
          comment: values?.comment,
        },
      };
      if (engagement) {
        await updateInterview({
          id: engagement?.entranceInterview?._id,
          body: data,
        }).unwrap();
      }
      message.success("Update application successfully");
      refetch && refetch();
    } catch (error) {
      message.error("Update application failed");
      console.log(error);
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
        <Typography.Title level={2}>{t("interview.title")}</Typography.Title>
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
            <Form.Item<FieldType>
              label={t("interview.attitude")}
              name="attitude"
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item<FieldType>
              label={t("interview.engagementLevel")}
              name="engagementLevel"
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item<FieldType>
              label={t("interview.specialize")}
              name="specialize"
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item<FieldType> label={t("interview.comment")} name="comment">
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item<FieldType>
              label={t("interview.interviewStatus")}
              name="interviewStatus"
            >
              <Select options={interviewStatusOptions} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {t("interview.submit")}
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col xs={{ flex: "100%" }} md={{ flex: "50%" }}>
          <Timeline
            items={[
              {
                children: `${t("interview.createdAt")}: ${moment(
                  engagement?.entranceInterview?.createdAt
                ).format("DD/MM/YYYY HH:mm ")}`,
              },
              {
                children: `${t("interview.updatedAt")}: ${moment(
                  engagement?.entranceInterview?.updatedAt
                ).format("DD/MM/YYYY HH:mm ")}`,
              },
            ]}
          />
        </Col>
      </Row>
    </Spin>
  );
}

export default InterviewModule;
