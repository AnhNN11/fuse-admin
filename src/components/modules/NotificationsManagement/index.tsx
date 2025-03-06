"use client";

import React, { useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import { useAppSelector } from "@/hooks/redux-toolkit";

import {
  Table,
  Typography,
  Input,
  Pagination,
  Tabs,
  Button,
  Space,
  Modal,
  Form,
  Select,
  Tag,
  Checkbox,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  useGetAllNotificationsWithPaginationQuery,
  useUpdateNotificationMutation,
  useCreateNotificationMutation,
  useDeleteNotificationMutation,
  useSearchUsersQuery,
  useSendEmailMutation,
} from "@/store/queries/notificationManagement";

import { useGetClubBySubnamev2Query } from "@/store/queries/clubManagement";
import { createQueryString } from "@/utils/queryString";
import * as S from "./styles";
import _ from "lodash";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const { Option } = Select;
import FilterBar from "./FilterBar";
import { User, Notification } from "./types";
import { getPathname } from "./../../../utils/getPathname";
const NotificationManagementModule: React.FC = () => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const clubId = searchParams.get("clubId") || "";
  const createdAt = searchParams.get("createdAt") || "";
  const { t } = useTranslation(
    params?.locale as string,
    "notificationManagement"
  );
  const { userInfo } = useAppSelector((state) => state.auth);

  const [updateNotification] = useUpdateNotificationMutation();
  const [createNotification] = useCreateNotificationMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [selectedTab, setSelectedTab] = useState("1");
  const [editorState, setEditorState] = useState("");
  const [notificationType, setNotificationType] = useState("public");
  const [userSearch, setUserSearch] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<User[]>([]);
  const [currentNotification, setCurrentNotification] =
    useState<Notification | null>(null);
  const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] =
    useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<
    string | null
  >(null);

  const { result, total, isFetching, refetch } =
    useGetAllNotificationsWithPaginationQuery(
      {
        page,
        page_size: 10,
        search,
        clubId,
        createdAt,
        isOfAdmin: false,
      },
      {
        selectFromResult: ({ data, isFetching }) => ({
          result: data?.data?.notifications ?? [],
          total: data?.count ?? 0,
          isFetching,
        }),
      }
    );
  const { userSearchResults } = useSearchUsersQuery(
    { email: userSearch, username: userSearch },
    {
      skip: !userSearch,
      selectFromResult: ({ data, isFetching }) => ({
        userSearchResults: data?.users ?? [],
        isFetching,
      }),
    }
  );

  const { data: club } = useGetClubBySubnamev2Query({
    subname: getPathname(pathname).split("/")[1],
    userId: "",
    page: page,
    limit: 10,
  });

  const [sendEmail] = useSendEmailMutation();

  const handleSearch = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(createQueryString("search", e?.target?.value));
  }, 300);

  const handleFilterChange = (value: string, type: string) => {
    router.push(createQueryString(type, value));
  };

  const handlePageChange = (page: number) => {
    router.push(createQueryString("page", `${page}`));
  };

  const handleCreateNotification = async (values: any) => {
    try {
      await createNotification({
        data: {
          ...values,
          type: values?.type == undefined ? "info" : values?.type,
          message: editorState,
          club: club?.data?.clubs[0]?._id,
          recipients:
            selectedTab == "3"
              ? selectedRecipients?.map((user) => user?._id)
              : [],
          isPublic: selectedTab == "1",
          isOfAdmin: false,
          isApproved: false,
          notificationType:
            selectedTab == "1"
              ? "public"
              : selectedTab == "2"
              ? "club"
              : "private",
          createdBy: [userInfo?._id],
        },
      }).unwrap();
      if (values?.sendEmail) {
        const emailPromises = selectedRecipients.map(async (recipient) => {
          const to = recipient?.email;
          const subject = values?.title;
          const html = values?.message;
          await sendEmail({ to, subject, html }).unwrap();
        });
        await Promise.all(emailPromises);
      }
      refetch();
      setIsModalVisible(false);
      form.resetFields();
      setEditorState("");
      setSelectedRecipients([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateNotification = async (values: any) => {
    if (currentNotification) {
      try {
        await updateNotification({
          id: currentNotification._id,
          data: {
            ...values,
            message: editorState,
            recipients:
              notificationType == "private"
                ? selectedRecipients.map((user) => user._id)
                : [],
            club: club?.data?.clubs[0]?._id,
            isPublic: notificationType == "public",
          },
        }).unwrap();
        if (values?.sendEmail) {
          const emailPromises = selectedRecipients.map(async (recipient) => {
            const to = recipient?.email;
            const subject = values?.title;
            const html = values?.message;
            await sendEmail({ to, subject, html }).unwrap();
          });
          await Promise.all(emailPromises);
        }
        refetch();
        setIsUpdateModalVisible(false);
        updateForm.resetFields();
        setEditorState("");
        setSelectedRecipients([]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleConfirmDelete = (id: string) => {
    setNotificationToDelete(id);
    setIsConfirmDeleteModalVisible(true);
  };

  const handleDeleteNotification = async () => {
    if (notificationToDelete) {
      try {
        await deleteNotification({ id: notificationToDelete }).unwrap();
        refetch();
        setIsConfirmDeleteModalVisible(false);
        setNotificationToDelete(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleTabChange = (key: string) => {
    setSelectedTab(key);
  };

  const baseColumns = [
    {
      title: t("time"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: t("subject"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("viewAmount"),
      dataIndex: "viewAmount",
      key: "viewAmount",
    },
    {
      title: t("createdBy"),
      dataIndex: "createdBy",
      key: "createdBy",
      render: (_: any, record: Notification) => (
        <Typography.Text>{record?.createdBy?.username}</Typography.Text>
      ),
    },
    {
      title: t("action"),
      key: "action",
      render: (_: any, record: Notification) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentNotification(record);
              setEditorState(record?.message);

              setSelectedRecipients(record?.recipients);
              setNotificationType(record?.type);
              setIsUpdateModalVisible(true);
              let notificationType = "public";
              switch (selectedTab) {
                case "2":
                  notificationType = "club";
                  break;
                case "3":
                  notificationType = "private";
                  break;
              }
              setNotificationType(notificationType);
              updateForm.setFieldsValue({
                title: record?.title,
                club: record?.club?._id,
                type: record?.type,
                isPublic: record?.isPublic,
                sendEmail: record?.sendEmail,
                recipients: record?.recipients.map(
                  (user) => `${user.username} (${user.email})`
                ),
              });
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleConfirmDelete(record._id)}
          />
        </Space>
      ),
    },
  ];
  const columns =
    selectedTab === "1"
      ? [
          ...baseColumns,
          {
            title: "Trạng thái",
            dataIndex: "isApproved",
            key: "isApproved",
            render: (isApproved: boolean) =>
              isApproved ? (
                <Tag color="green">{t("approved")}</Tag>
              ) : (
                <Tag color="red">{t("unapproved")}</Tag>
              ),
          },
        ]
      : baseColumns;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditorState("");
    setSelectedRecipients([]);
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    setEditorState("");
    setSelectedRecipients([]);
  };

  const handleTagClose = (value: string) => {
    setSelectedRecipients((prev) => prev.filter((item) => item._id !== value));
  };

  const privateNotifications = result.filter(
    (notification: Notification) =>
      !notification.isPublic && notification.recipients.length !== 0
  );

  const publicNotifications = result.filter(
    (notification: Notification) => notification.isPublic
  );

  const clubNotifications = result.filter(
    (notification: Notification) =>
      notification.club != null && !notification.isPublic
  );

  const items = [
    {
      key: "1",
      label: t("publicNoti"),
      children: (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            {t("addNoti")}
          </Button>
          <Table
            columns={columns}
            dataSource={publicNotifications}
            loading={isFetching}
            pagination={false}
            rowKey={(record) => record?._id}
          />
          <Pagination
            defaultCurrent={page}
            total={total}
            onChange={handlePageChange}
          />
        </Space>
      ),
    },
    {
      key: "2",
      label: t("clubNoti"),
      children: (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            {t("addNoti")}
          </Button>
          <Table
            columns={columns}
            dataSource={clubNotifications}
            loading={isFetching}
            pagination={false}
            rowKey={(record) => record?._id}
          />
          <Pagination
            defaultCurrent={page}
            total={total}
            onChange={handlePageChange}
          />
        </Space>
      ),
    },
    {
      key: "3",
      label: t("privateNoti"),
      children: (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            {t("addNoti")}
          </Button>
          <Table
            columns={columns}
            dataSource={privateNotifications}
            loading={isFetching}
            pagination={false}
            rowKey={(record) => record?._id}
          />
          <Pagination
            defaultCurrent={page}
            total={total}
            onChange={handlePageChange}
          />
        </Space>
      ),
    },
  ];

  console.log("hellloooo", userSearchResults);
  return (
    <S.PageWrapper>
      <S.Head>
        <Typography.Title level={2}>{t("title")}</Typography.Title>
      </S.Head>
      <S.FilterWrapper>
        <Typography.Title level={5}>{t("search")}</Typography.Title>
        <FilterBar
          handleSearch={handleSearch}
          handleFilterChange={handleFilterChange}
        />
      </S.FilterWrapper>
      <Tabs
        activeKey={selectedTab}
        onChange={handleTabChange}
        items={items.map((item) => ({
          label: item.label,
          key: item.key,
          children: item.children,
        }))}
      />
      <Modal
        title={t("addNoti")}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            {t("cancel")}
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {t("submit")}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateNotification}>
          <Form.Item
            name="title"
            label={t("subject")}
            rules={[{ required: true, message: t("validTitle") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="message"
            label={t("message")}
            rules={[{ required: true, message: t("validMessage") }]}
          >
            <ReactQuill value={editorState} onChange={setEditorState} />
          </Form.Item>

          {selectedTab === "3" && (
            <Form.Item name="recipients" label={t("recipients")}>
              <Select
                mode="multiple"
                placeholder={t("searchReci")}
                value={selectedRecipients.map(
                  (user) => `${user.username} (${user.email})`
                )}
                onSearch={setUserSearch}
                onSelect={(value, option) => {
                  setSelectedRecipients((prev) => {
                    const user = userSearchResults.find(
                      (u: User) => `${u.username} (${u.email})` === option.value
                    );
                    if (user && !prev.some((item) => item._id === user._id)) {
                      return [...prev, user];
                    }
                    return prev;
                  });
                  setUserSearch("");
                }}
                onDeselect={(value) => {
                  const user = userSearchResults.find(
                    (u: User) => `${u.username} (${u.email})` === value
                  );
                  handleTagClose(user._id);
                }}
                style={{ width: "100%" }}
              >
                {userSearchResults?.map((user: User) => (
                  <Option
                    key={user?._id}
                    value={`${user.username} (${user.email})`}
                  >
                    {`${user.username} (${user.email})`}
                  </Option>
                ))}
              </Select>
              <Form.Item
                name="sendEmail"
                valuePropName="checked"
                initialValue={false}
              >
                <Checkbox>{t("sendEmail")}</Checkbox>
              </Form.Item>
            </Form.Item>
          )}

          <Form.Item name="type" label={t("typeNoti")}>
            <Select defaultValue="info">
              <Option value="info">{t("info")}</Option>
              <Option value="alert">{t("alert")}</Option>
              <Option value="warning">{t("warning")}</Option>
              <Option value="success">{t("success")}</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={t("updateNoti")}
        open={isUpdateModalVisible}
        onCancel={handleUpdateCancel}
        footer={[
          <Button key="back" onClick={handleUpdateCancel}>
            {t("cancel")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => updateForm.submit()}
          >
            {t("submit")}
          </Button>,
        ]}
      >
        <Form
          form={updateForm}
          layout="vertical"
          onFinish={handleUpdateNotification}
        >
          <Form.Item
            name="title"
            label={t("subject")}
            rules={[{ required: true, message: t("validTitle") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="message"
            label={t("message")}
            rules={[{ required: true, message: t("validMessage") }]}
          >
            <ReactQuill value={editorState} onChange={setEditorState} />
          </Form.Item>

          <Form.Item label={t("typeNoti")}>
            <Select
              onChange={(value) => setNotificationType(value)}
              value={notificationType}
            >
              <Option value="public">{t("publicNoti")}</Option>
              <Option value="private">{t("privateNoti")}</Option>
              <Option value="club">{t("clubNoti")}</Option>
            </Select>
          </Form.Item>

          {notificationType == "private" ? (
            <Form.Item name="recipients" label={t("recipients")}>
              <Select
                mode="multiple"
                placeholder={t("searchReci")}
                value={selectedRecipients.map(
                  (user) => `${user.username} (${user.email})`
                )}
                onSearch={setUserSearch}
                onSelect={(value, option) => {
                  setSelectedRecipients((prev) => {
                    const user = userSearchResults.find(
                      (u: User) => `${u.username} (${u.email})` === option.value
                    );
                    if (user && !prev.some((item) => item._id === user._id)) {
                      return [...prev, user];
                    }
                    return prev;
                  });
                  setUserSearch("");
                }}
                onDeselect={(value) => {
                  const user = userSearchResults.find(
                    (u: User) => `${u.username} (${u.email})` === value
                  );
                  handleTagClose(user._id);
                }}
                style={{ width: "100%" }}
              >
                {userSearchResults?.map((user: User) => (
                  <Option
                    key={user?._id}
                    value={`${user.username} (${user.email})`}
                  >
                    {`${user.username} (${user.email})`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <></>
          )}

          <Form.Item name="type" label={t("typeNoti")}>
            <Select defaultValue="info">
              <Option value="info">{t("info")}</Option>
              <Option value="alert">{t("alert")}</Option>
              <Option value="warning">{t("warning")}</Option>
              <Option value="success">{t("success")}</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={t("delete")}
        open={isConfirmDeleteModalVisible}
        onCancel={() => setIsConfirmDeleteModalVisible(false)}
        onOk={handleDeleteNotification}
        okText={t("delete")}
        okType="danger"
        cancelText={t("cancel")}
      >
        <p>{t("confirmDeleteMessage")}</p>
      </Modal>
    </S.PageWrapper>
  );
};

export default NotificationManagementModule;
