"use client";

import {
  Input,
  Table,
  TableProps,
  Typography,
  Button,
  Modal,
  Space,
  Tag,
  Form,
  Select,
  message,
  DatePicker,
  Tooltip,
  Popconfirm,
} from "antd";

import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";

import {
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useTranslation } from "@/app/i18n/client";
import dayjs from "dayjs";
import { createQueryString } from "@/utils/queryString";
import useModal from "./../../../hooks/useModal";
import type { DatePickerProps } from "antd";

import * as S from "./styles";
import {
  useCreateSemesterMutation,
  useDeleteSemesterMutation,
  useGetAllSemesterQuery,
  useUpdateSemesterMutation,
} from "@/store/queries/semesterManagement";

interface DataType {
  key: string;
  id: string;
  _id: string;
  name: string;
  year: number;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}

function SemesterManagement() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedClub, setSelectedClub] = useState<DataType | null>(null);
  const [form] = Form.useForm();
  const { t } = useTranslation(params?.locale as string, "semester");

  const [updateForm] = Form.useForm();
  const [updateSemester] = useUpdateSemesterMutation();

  const [addNewClub] = useCreateSemesterMutation();

  const { data, refetch } = useGetAllSemesterQuery({});
  const [deleteEvent] = useDeleteSemesterMutation();

  const handleUpdate = (record: DataType) => {
    setSelectedClub(record);

    updateForm.setFieldsValue({
      id: record._id,
      name: record.name,
      year: record.year,
      startDate: dayjs(record.startDate),
      endDate: dayjs(record.endDate),
    });

    openUpdateModal();
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id).unwrap();
      message.success("Xoá sự kiện thành công");
      refetch();
    } catch (error) {
      message.error("Rất tiếc, đã xảy ra lỗi khi xoá sự kiện");
    }
  };

  const handleUpdateOk = async () => {
    try {
      const values = await updateForm.validateFields();
      if (values.startDate) {
        values.startDate = dayjs(values.startDate).format(
          "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
        );
      }
      if (values.endDate) {
        values.endDate = dayjs(values.endDate).format(
          "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
        );
      }
      await updateSemester(values).unwrap();

      closeAddModal();
      refetch();
    } catch (error) {
      message.error("Failed to update club:");
    }
  };
  const { result } = data
    ? {
        result: data?.result || [],
      }
    : {
        result: [],
      };

  const formattedData = result.map((item: any) => ({
    ...item,
    year: dayjs(item.year).format("YYYY"),
    startDate: dayjs(item.startDate).format("DD-MM-YYYY"),
    endDate: dayjs(item.endDate).format("DD-MM-YYYY"),
  }));

  const search = searchParams.get("search") || "";

  const columns = (
    handleUpdate: (record: DataType) => void
  ): TableProps<DataType>["columns"] => [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
      render: (text, _, index) => (
        <Typography.Text>{index + 1}</Typography.Text>
      ),
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      width: 250,
    },

    {
      title: t("year"),
      dataIndex: "year",
      key: "year",
      width: 200,
    },
    {
      title: t("startDate"),
      dataIndex: "startDate",
      key: "startDate",
      width: 200,
    },
    {
      title: t("endDate"),
      dataIndex: "endDate",
      key: "endDate",
      width: 200,
    },
    {
      title: t("endDate"),
      dataIndex: "isCurrent",
      key: "isCurrent",
      width: 200,
      render: (isCurrent) =>
        isCurrent ? (
          <Tag color="success">Open</Tag>
        ) : (
          <Tag color="error">Closed</Tag>
        ),
    },

    {
      title: t("action"),
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleUpdate(record)}>
            {t("update")}
          </Button>
          <Tooltip title="Xoá sự kiện">
            <Popconfirm
              title="Bạn có chắc chắn muốn xoá sự kiện này không?"
              description="Sự kiện sẽ không thể khôi phục sau khi xoá."
              onConfirm={() => handleDeleteEvent(record._id)}
              okText="Xác nhận"
              cancelText="Huỷ"
            >
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleUpdate(record)}
              >
                {t("delete")}
              </Button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];
  const { close: closeModal } = useModal();
  const {
    visible: isAddModalVisible,
    open: openAddModal,
    close: closeAddModal,
  } = useModal();
  const {
    visible: isUpdateModalVisible,
    open: openUpdateModal,
    close: closeUpdateModal,
  } = useModal();

  const handleSearch = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(createQueryString("search", `${e?.target?.value}`));
  }, 300);

  const handleAddOk = async () => {
    try {
      const values = await form.validateFields();

      await addNewClub(values).unwrap();
      closeAddModal();
      form.resetFields();
      refetch();
    } catch (error) {
      message.error(`Error add club`);
    }
  };
  const onChangeYear: DatePickerProps["onChange"] = (date, dateString) => {};

  const onChangeStart: DatePickerProps["onChange"] = (date, dateString) => {};

  const onChangeEnd: DatePickerProps["onChange"] = (date, dateString) => {};

  const showModal = () => {
    openAddModal();
  };

  const handleCancel = () => {
    closeAddModal();
    closeModal();
    closeUpdateModal();
    setSelectedClub(null);
  };

  return (
    <S.PageWrapper>
      <S.Head>
        <Typography.Title level={2}>{t("title")}</Typography.Title>
      </S.Head>
      <S.FilterWrapper>
        <Typography.Title level={5}>{t("search")}</Typography.Title>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <Input
            placeholder={t("searchPlaceholder")}
            prefix={<SearchOutlined />}
            onChange={handleSearch}
            defaultValue={search}
            style={{ flex: 1, minWidth: "200px" }}
          />
        </div>
      </S.FilterWrapper>
      <S.TableWrapper>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
          style={{ marginBottom: "15px" }}
        >
          {t("addSemester")}
        </Button>

        <Modal
          title={t("addSemester")}
          open={isAddModalVisible}
          onOk={handleAddOk}
          onCancel={handleCancel}
          width={800}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label={t("name")}
              rules={[{ required: true, message: t("validName") }]}
            >
              <Select>
                <Select.Option value="Fall">{t("Fall")}</Select.Option>
                <Select.Option value="Spring">{t("Spring")}</Select.Option>
                <Select.Option value="Summer">{t("Summer")}</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="year"
              label={t("year")}
              rules={[{ required: true, message: t("validName") }]}
            >
              <DatePicker
                onChange={onChangeYear}
                picker="year"
                defaultValue={dayjs()}
              />
            </Form.Item>
            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item
                label={t("startDate")}
                name="startDate"
                rules={[{ required: true, message: t("fieldRequeired") }]}
              >
                <DatePicker onChange={onChangeStart} defaultValue={dayjs()} />
              </Form.Item>
              <Form.Item
                label={t("endDate")}
                name="endDate"
                rules={[{ required: true, message: t("fieldRequeired") }]}
              >
                <DatePicker onChange={onChangeEnd} />
              </Form.Item>
            </div>
          </Form>
        </Modal>
        <Modal
          title={t("updateClub")}
          open={isUpdateModalVisible}
          onOk={handleUpdateOk}
          onCancel={handleCancel}
          width={800}
        >
          <Form form={updateForm} layout="vertical">
            <Form.Item
              name="id"
              label={t("name")}
              rules={[{ required: true, message: t("validName") }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="name"
              label={t("name")}
              rules={[{ required: true, message: t("validName") }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="year"
              label={t("name")}
              rules={[{ required: true, message: t("validName") }]}
            >
              <DatePicker onChange={onChangeYear} picker="year" />
            </Form.Item>
            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item
                label={t("eventDetail.time")}
                name="startDate"
                rules={[{ required: true, message: t("fieldRequeired") }]}
              >
                <DatePicker onChange={onChangeStart} />
              </Form.Item>
              <Form.Item
                label={t("eventDetail.time")}
                name="endDate"
                rules={[{ required: true, message: t("fieldRequeired") }]}
              >
                <DatePicker onChange={onChangeEnd} />
              </Form.Item>
            </div>
          </Form>
        </Modal>
        <Table
          columns={columns(handleUpdate)}
          dataSource={formattedData}
          rowKey="id"
          pagination={false}
        />
      </S.TableWrapper>
    </S.PageWrapper>
  );
}

export default SemesterManagement;
