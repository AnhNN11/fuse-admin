"use client";
import {
  Button,
  DatePicker,
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
import TextArea from "antd/es/input/TextArea";

import moment from "moment";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";

import { useEffect, useState } from "react";
import { useGetAllLoactionsQuery } from "@/store/queries/LocationMangement";
import { useCreateInterviewMutation } from "@/store/queries/entranceInterviewManagement";

interface DataType {
  _id: string;
  entranceInterview: {
    _id: string;
    startTime: string;
    endTime: string;
    location: string;
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

interface LocationDataType {
  key: string;
  _id: string;
  name: string;
}

type FieldType = {
  _id: string;
  startTime?: any;
  endTime?: any;
  location?: string;
  note?: string;
};

function CreateInterviewModule({
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
  const [createInterview, { isLoading }] = useCreateInterviewMutation();

  const { result: locationResult, isFetching: locationIsFetching } =
    useGetAllLoactionsQuery(
      {},
      {
        selectFromResult: ({ data, isFetching }) => {
          const newLocationData = data?.result?.map(
            (location: LocationDataType) => ({
              label: location.name,
              value: location._id,
            })
          );
          return {
            result: newLocationData ?? [],
            isFetching,
          };
        },
      }
    );

  useEffect(() => {
    if (engagement) {
      myForm.setFieldsValue({
        startTime: dayjs(engagement?.entranceInterview?.startTime),
        endTime: dayjs(engagement?.entranceInterview?.endTime),
        location: engagement?.entranceInterview?.location,
        note: engagement?.entranceInterview?.note,
      });
    }
    if (engagement?.entranceInterview?.status == "NEW") {
    }
  }, [engagement, myForm]);

  const handleSubmit: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      if (engagement?.entranceInterview) {
        const data = {
          startTime: values?.startTime,
          endTime: values?.endTime,
          location: values?.location,
          note: values?.note,
          status: "SENT_INTERVIEW",
          engagementId: engagement?._id,
        };

        await createInterview({
          id: engagement?.entranceInterview?._id,
          body: data,
        }).unwrap();
        message.success("Create an interview successfully");
        refetch && refetch();
      }
    } catch (error) {
      message.error("Create an interview failed");
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
        <Typography.Title level={2}>
          {t("createInterview.title")}
        </Typography.Title>
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
              label={t("createInterview.startTime")}
              name="startTime"
            >
              <DatePicker showTime style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item<FieldType>
              label={t("createInterview.endTime")}
              name="endTime"
            >
              <DatePicker showTime style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item<FieldType>
              label={t("createInterview.location")}
              name="location"
            >
              <Select options={locationResult} loading={locationIsFetching} />
            </Form.Item>

            <Form.Item<FieldType> label={t("createInterview.note")} name="note">
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {t("createInterview.submit")}
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col xs={{ flex: "100%" }} md={{ flex: "50%" }}>
          <Timeline
            items={[
              {
                children: `${t("createInterview.createdAt")}: ${moment(
                  engagement?.entranceInterview?.createdAt
                ).format("DD/MM/YYYY HH:mm ")}`,
              },
              {
                children: `${t("createInterview.updatedAt")}: ${moment(
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

export default CreateInterviewModule;
