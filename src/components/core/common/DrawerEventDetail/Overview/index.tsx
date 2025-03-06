import {
  Col,
  DatePicker,
  Flex,
  Form,
  FormProps,
  Input,
  Row,
  Select,
  Upload,
  message,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import dayjs from "dayjs";

import {
  useCreateEventMutation,
  useGetEventByIdQuery,
  useUpdateEventMutation,
} from "@/store/queries/eventsMangement";
import themeColors from "@/style/themes/default/colors";
import { useTranslation } from "@/app/i18n/client";
import { useGetAllLoactionsQuery } from "@/store/queries/LocationMangement";
import { useAppSelector } from "@/hooks/redux-toolkit";

import Button from "../../Button";
import CustomCKEditor from "../../CustomCKEditor";

import * as S from "./styles";

type FieldType = {
  name: string;
  description: string;
  remember: string;
  location: string;
  type: string;
  planUrl: string;
  bannerUrl: string;
  date: any[];
};

function Overview({
  eventId,
  type = "READ",
  onClose,
  refetch,
  clubId,
}: {
  eventId?: string;
  type: "READ" | "EDIT" | "CREATE";
  onClose: () => void;
  refetch: () => void;
  clubId?: string;
}) {
  const params = useParams();

  const { t } = useTranslation(params?.locale as string, "eventsManagement");

  const { userInfo } = useAppSelector((state) => state.auth);

  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();

  const { data } = useGetEventByIdQuery(eventId, {
    selectFromResult: ({ data, isFetching }) => {
      return {
        data: data?.result,
        isFetching,
      };
    },
    skip: type === "CREATE" || !eventId,
  });

  const { locationList } = useGetAllLoactionsQuery(undefined, {
    skip: type === "READ",
    selectFromResult: ({ data }) => {
      return {
        locationList: data?.result?.map((item: any) => ({
          label: item.name,
          value: item._id,
        })),
      };
    },
  });

  const [myForm] = Form.useForm<FieldType>();
  const [imageUrl, setImageUrl] = useState<string>("");

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const data = {
        ...values,
        registeredBy: userInfo?._id,
        bannerUrl: imageUrl,
        startTime: dayjs(values?.date[0]).format(),
        endTime: dayjs(values?.date[1]).format(),
        checkInCode: Math.floor(10000000 + Math.random() * 90000000).toString(),
        planUrl: "eqfe",
        club: clubId || null,
        status: values?.type === "PUBLIC" ? "PENDING" : "APPROVED",
      };

      switch (type) {
        case "CREATE":
          await createEvent(data).unwrap();
          message.success("Create event successfully");
          myForm.resetFields();
          break;
        case "EDIT":
          await updateEvent({
            id: eventId,
            body: {
              ...data,
              status: data?.type === "PUBLIC" ? "PENDING" : data?.status,
            },
          }).unwrap();
          message.success("Update event successfully");
          break;
        default:
          break;
      }

      refetch && refetch();
      onClose();
      setImageUrl("");
    } catch (error) {
      message.error("Create event failed");
    }
  };

  const handleChangeEditor = (value: string) => {
    myForm.setFieldsValue({ description: value });
  };

  const handleUpload = async ({
    onSuccess,
    onError,
    file,
    onProgress,
  }: any) => {
    const fmData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event: any) => {
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };

    fmData.append("image", file);

    try {
      const res = await axios.post(
        "https://api.imgbb.com/1/upload?key=488e7d944b2bedd5020e1ace8585d1df",
        fmData,
        config
      );

      onSuccess("Ok");
      setImageUrl(res?.data?.data?.url);
    } catch (err) {
      const error = new Error("Some error");
      onError({ error });
    }
  };

  useEffect(() => {
    if (data) {
      setImageUrl(data?.bannerUrl);
      myForm.setFieldsValue({
        name: data.name,
        description: data.description,
        location: data.location?._id,
        type: data?.type,
        date: [dayjs(data?.startTime), dayjs(data?.endTime)],
      });
    }
  }, [data, myForm]);

  return (
    <S.Wrapper>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        form={myForm}
        disabled={clubId !== data?.club?._id && type !== "CREATE"}
      >
        <Form.Item<FieldType>
          label={t("eventDetail.name")}
          name="name"
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: t("fieldRequeired") }]}
        >
          <Input placeholder="Enter your event name" />
        </Form.Item>
        <Form.Item<FieldType>
          rules={[{ required: true, message: t("fieldRequeired") }]}
          label={t("eventDetail.description")}
          name="description"
          wrapperCol={{ span: 24 }}
        >
          <CustomCKEditor
            data={data?.description}
            getData={handleChangeEditor}
          />
        </Form.Item>
        <Form.Item
          label={t("eventDetail.image")}
          rules={[
            {
              required: true,
              message: t("fieldRequeired"),
              validator: () => {
                return imageUrl
                  ? Promise.resolve()
                  : Promise.reject("Please upload image");
              },
            },
          ]}
          name="bannerUrl"
        >
          {!imageUrl && type !== "READ" && (
            <S.UploadWrap>
              <Upload.Dragger
                name="file"
                action="https://api.imgbb.com/1/upload?expiration=600&key=d0adfbcb1f973887c165948d50681492"
                headers={{
                  authorization: "authorization-text",
                }}
                customRequest={handleUpload}
                multiple={false}
              >
                <Button icon={<UploadOutlined />}>
                  {t("eventDetail.upload")}
                </Button>
              </Upload.Dragger>
            </S.UploadWrap>
          )}

          {imageUrl && (
            <S.ImageArea>
              <button>
                <CloseOutlined
                  style={{ fontSize: 16, color: themeColors.textWhite }}
                  onClick={() => setImageUrl("")}
                />
              </button>
              <S.ImageWrapper src={imageUrl} alt="" width={600} height={400} />
            </S.ImageArea>
          )}
        </Form.Item>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item<FieldType>
              label={t("eventDetail.time")}
              name="date"
              rules={[{ required: true, message: t("fieldRequeired") }]}
            >
              <DatePicker.RangePicker showTime />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item<FieldType>
              label={t("eventDetail.location")}
              name="location"
              rules={[{ required: true, message: t("fieldRequeired") }]}
            >
              <Select
                placeholder={t("eventDetail.placeholderLocation")}
                options={locationList}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item<FieldType>
              label={t("eventDetail.type")}
              rules={[{ required: true, message: t("fieldRequeired") }]}
              name="type"
            >
              <Select
                placeholder={t("eventDetail.placeholderType")}
                options={[
                  { label: t("eventDetail.internal"), value: "INTERNAL" },
                  { label: t("eventDetail.public"), value: "PUBLIC" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        {type === "CREATE" && (
          <Flex justify="center" gap={8}>
            <Button type="primary" htmlType="submit">
              {t("eventDetail.actions.create")}
            </Button>
            <Button danger>{t("eventDetail.actions.cancel")}</Button>
          </Flex>
        )}
        {type === "EDIT" && (
          <Flex justify="center" gap={8}>
            <Button type="primary" htmlType="submit">
              {t("eventDetail.actions.update")}
            </Button>
            <Button danger onClick={onClose}>
              {t("eventDetail.actions.cancel")}
            </Button>
          </Flex>
        )}
      </Form>
    </S.Wrapper>
  );
}

export default Overview;
