import {
  Col,
  DatePicker,
  Flex,
  Form,
  FormProps,
  Input,
  Row,
  Select,
  SelectProps,
  Upload,
  message,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import dayjs from "dayjs";

import Button from "../../Button";
import CustomCKEditor from "../../CustomCKEditor";

import * as S from "./styles";
import {
  useCreateMeetingMutation,
  useGetMeetingByIdQuery,
  useUpdateMeetingMutation,
} from "@/store/queries/meetingManagement";
import { useAppSelector } from "@/hooks/redux-toolkit";
import { useGetAllUsersQuery } from "@/store/queries/usersMangement";
import { debounce } from "lodash";

type FieldType = {
  title: string;
  description: string;
  participants: { user: string }[];
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
  const [createMeeting] = useCreateMeetingMutation();
  const [updateEvent] = useUpdateMeetingMutation();
  const [loading, setLoading] = useState(false);
  const { data } = useGetMeetingByIdQuery(eventId, {
    selectFromResult: ({ data, isFetching }) => {
      console.log("dataedit", data);

      return {
        data: data?.result,
        isFetching,
      };
    },
    skip: type === "CREATE" || !eventId,
  });
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const { userList } = useGetAllUsersQuery(
    { page: page, page_size: 10, search: search },
    {
      skip: type === "READ",
      selectFromResult: ({ data }) => {
        console.log("data user", data);
        return {
          userList: data?.result?.map((item: any) => ({
            label: item.email,
            value: item._id,
          })),
        };
      },
    }
  );

  const [myForm] = Form.useForm<FieldType>();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);
    try {
      const formattedParticipants = values.participants.map((userId: any) => ({
        user: userId,
      }));

      const data = {
        ...values,
        participants: formattedParticipants,
        startTime: dayjs(values?.date[0]).format(),
        endTime: dayjs(values?.date[1]).format(),
      };

      switch (type) {
        case "CREATE":
          await createMeeting(data).unwrap();
          message.success("Create meeting successfully");
          myForm.resetFields();
          break;
        case "EDIT":
          await updateEvent({
            id: eventId,
            body: {
              ...data,
            },
          }).unwrap();
          message.success("Update meeting successfully");
          break;
        default:
          break;
      }

      refetch && refetch();
      onClose();
    } catch (error) {
      message.error("Create meeting failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEditor = (value: string) => {
    myForm.setFieldsValue({ description: value });
  };

  useEffect(() => {
    if (data) {
      myForm.setFieldsValue({
        title: data.name,
        description: data.description,
        date: [dayjs(data?.startTime), dayjs(data?.endTime)],
        participants:
          data.participants?.map((participant: any) => participant.user._id) ||
          [],
      });
    }
  }, [data, myForm]);
  const handleParticipantChange = (selectedUserIds: any) => {
    myForm.setFieldsValue({ participants: selectedUserIds });
  };

  return (
    <S.Wrapper>
      <Form<FieldType>
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        form={myForm}
      >
        <Form.Item<FieldType>
          label="Tạo cuộc họp"
          name="title"
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: "Trường này là bắt buộc" }]}
        >
          <Input placeholder="Nhập tên cuộc họp" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Mô tả"
          name="description"
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: "Trường này là bắt buộc" }]}
        >
          <CustomCKEditor
            data={data?.description}
            getData={handleChangeEditor}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Mời người tham gia"
          name="participants"
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: "Trường này là bắt buộc" }]}
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Tìm kiếm người dùng"
            options={userList}
            showSearch
            onChange={handleParticipantChange}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item<FieldType>
              label="Thời gian cuộc họp"
              name="date"
              rules={[{ required: true, message: "Trường này là bắt buộc" }]}
            >
              <DatePicker.RangePicker showTime />
            </Form.Item>
          </Col>
        </Row>

        <Flex justify="start" gap={8}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Tạo
          </Button>
          <Button danger>Thoát</Button>
        </Flex>
      </Form>
    </S.Wrapper>
  );
}

export default Overview;
