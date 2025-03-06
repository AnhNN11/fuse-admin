"use client";

import React, { useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
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
  Checkbox,
  Tag,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  useGetAllNotificationsWithPaginationQuery,
  useUpdateNotificationMutation,
  useCreateNotificationMutation,
  useDeleteNotificationMutation,
  useSearchUsersQuery,
  useSendEmailMutation,
} from "@/store/queries/notificationManagement";
import { useGetAllClubsQuery } from "@/store/queries/clubsManagement";
import { createQueryString } from "@/utils/queryString";
import * as S from "./styles";
import _ from "lodash";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const { Option } = Select;
import FilterBar from "./FilterBar";
import { User, Club, Notification } from "./types";
import moment from "moment";

const NotificationManagementModule: React.FC = () => {
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
  // Define states for the details modal
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const { result, total, isFetching, refetch } =
    useGetAllNotificationsWithPaginationQuery(
      {
        page,
        page_size: 10,
        search,
        clubId,
        createdAt,
        isOfAdmin:
          selectedTab === "2" || selectedTab === "3" ? true : undefined,
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

  const { data: clubsData, isFetching: clubsLoading } = useGetAllClubsQuery(
    {
      page: page,
    },
    {
      selectFromResult: ({ data, isFetching }) => ({
        data: data?.data?.clubs ?? [],
        total: data?.count ?? 0,
        isFetching,
        refetch,
      }),
    }
  );

  const handleStatusChange = async (status: string, id: string) => {
    try {
      await updateNotification({
        id,
        data: { isApproved: status === "approved" },
      }).unwrap();
      refetch(); // Refresh the data to reflect the updated status
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

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

  const handleViewDetails = (id: string) => {
    const notification = result.find((item: Notification) => item._id === id);
    if (notification) {
      setCurrentNotification(notification);
      setIsDetailModalVisible(true);
    }
  };

  const handleDetailModalClose = () => {
    setIsDetailModalVisible(false);
    setCurrentNotification(null);
  };
  const handleCreateNotification = async (values: any) => {
    try {
      await createNotification({
        data: {
          ...values,
          type: values?.type == undefined ? "info" : values?.type,
          message: editorState,
          recipients:
            selectedTab == "3"
              ? selectedRecipients.map((user) => user._id)
              : [],
          club: selectedTab == "2" ? values.club : null,
          isPublic: selectedTab == "1",
          isOfAdmin: true,
          notificationType:
            selectedTab == "1"
              ? "public"
              : selectedTab == "2"
              ? "club"
              : "private",
          createdBy: userInfo?._id,
        },
      }).unwrap();
      refetch();
      if (values?.sendEmail) {
        const emailPromises = selectedRecipients.map(async (recipient) => {
          const to = recipient?.email;
          const subject = values?.title;
          const html = values?.message;
          await sendEmail({ to, subject, html }).unwrap();
        });
        await Promise.all(emailPromises);
      }
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
            club: notificationType == "club" ? values.club : null,
            isPublic: notificationType == "public",
            notificationType: notificationType,
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

  const columns: any = [
    {
      title: t("time"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => `${moment(text).fromNow()}`,
    },
    {
      title: t("subject"),
      dataIndex: "title",
      key: "title",
    },
  ];

  if (selectedTab === "1" || selectedTab === "3") {
    columns.push({
      title: t("viewAmount"),
      dataIndex: "viewAmount",
      key: "viewAmount",
    });
  }

  if (selectedTab === "1") {
    columns.push(
      {
        title: t("createdBy"),
        dataIndex: "createdBy",
        key: "createdBy",
        width: 150,
        render: (_: any, record: Notification) => (
          <Typography.Text>
            {record?.isOfAdmin
              ? "Admin"
              : `${record?.club?.name ?? "CLB"} - ${
                  record?.createdBy?.username
                }`}
          </Typography.Text>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "isApproved",
        key: "isApproved",
        width: 200,
        render: (isApproved: boolean, record: Notification) => (
          <Select
            defaultValue={isApproved ? "approved" : "unapproved"}
            style={{ width: 150 }}
            onChange={(value) => handleStatusChange(value, record._id)}
          >
            <Select.Option value="approved" style={{ color: "green" }}>
              {t("approved")}
            </Select.Option>
            <Select.Option value="unapproved" style={{ color: "red" }}>
              {t("unapproved")}
            </Select.Option>
          </Select>
        ),
      }
    );
  }

  columns.push({
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
          }}
        />
        <Button
          icon={<DeleteOutlined />}
          onClick={() => handleConfirmDelete(record._id)}
        />
        <Tooltip title="Xem chi tiết">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record._id)}
          />
        </Tooltip>
      </Space>
    ),
  });

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
      notification.club !== null && notification.club !== undefined
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

  return (
    <S.PageWrapper>
      <S.Head>
        <Typography.Title level={2}>{t("title")}</Typography.Title>
      </S.Head>
      <S.FilterWrapper>
        <Typography.Title level={5}>{t("search")}</Typography.Title>
        <FilterBar
          clubsData={clubsData}
          handleSearch={handleSearch}
          handleFilterChange={handleFilterChange}
        />
      </S.FilterWrapper>
      <Tabs activeKey={selectedTab} onChange={handleTabChange}>
        {items.map((item) => (
          <Tabs.TabPane tab={item.label} key={item.key}>
            {item.children}
          </Tabs.TabPane>
        ))}
      </Tabs>
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
          {selectedTab === "2" && (
            <Form.Item name="club" label={t("club")}>
              <Select
                placeholder={t("selectClub")}
                loading={clubsLoading}
                options={clubsData?.map((club: Club) => ({
                  value: club?._id,
                  label: club?.name,
                }))}
              />
            </Form.Item>
          )}

          {selectedTab === "3" && (
            <>
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
                      const user = userSearchResults?.find(
                        (u: User) =>
                          `${u.username} (${u.email})` === option.value
                      );
                      if (user && !prev.some((item) => item._id === user._id)) {
                        return [...prev, user];
                      }
                      return prev;
                    });
                    setUserSearch("");
                  }}
                  onDeselect={(value) => {
                    const user = userSearchResults?.find(
                      (u: User) => `${u.username} (${u.email})` === value
                    );
                    handleTagClose(user._id);
                  }}
                  style={{ width: "100%" }}
                >
                  {Array.isArray(userSearchResults) ? (
                    userSearchResults?.map((user: User) => (
                      <Option
                        key={user?._id}
                        value={`${user.username} (${user.email})`}
                      >
                        {`${user.username} (${user.email})`}
                      </Option>
                    ))
                  ) : (
                    <Option disabled>Loading...</Option>
                  )}
                </Select>
              </Form.Item>
              <Form.Item
                name="sendEmail"
                valuePropName="checked"
                initialValue={false}
              >
                <Checkbox>{t("sendEmail")}</Checkbox>
              </Form.Item>
            </>
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

          {notificationType == "club" ? (
            <Form.Item name="club" label={t("club")}>
              <Select
                defaultValue={currentNotification?.club?._id}
                placeholder={t("selectClub")}
                loading={clubsLoading}
                options={clubsData?.map((club: Club) => ({
                  value: club._id,
                  label: club.name,
                }))}
              />
            </Form.Item>
          ) : notificationType == "private" ? (
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
      <Modal
        title={t("viewDetail")}
        open={isDetailModalVisible}
        onCancel={handleDetailModalClose}
        footer={[
          <Button key="back" onClick={handleDetailModalClose}>
            {t("close")}
          </Button>,
        ]}
      >
        {currentNotification && (
          <div>
            <Typography.Text strong>{t("subject")}: </Typography.Text>
            <Typography.Text>{currentNotification.title}</Typography.Text>
            <br />
            <Typography.Text strong>{t("message")}: </Typography.Text>
            <ReactQuill
              value={currentNotification.message}
              readOnly
              theme="bubble"
            />

            <Typography.Text strong>{t("typeNoti")}: </Typography.Text>
            <Typography.Text>{currentNotification.type}</Typography.Text>
            <br />
            {currentNotification.club && (
              <>
                <Typography.Text strong>{t("club")}: </Typography.Text>
                <Typography.Text>
                  {currentNotification.club.name}
                </Typography.Text>
                <br />
              </>
            )}
            {currentNotification.recipients &&
              currentNotification.recipients.length > 0 && (
                <>
                  <Typography.Text strong>{t("recipients")}: </Typography.Text>
                  {currentNotification.recipients.map((user) => (
                    <Tag key={user._id}>{user.username}</Tag>
                  ))}
                </>
              )}
          </div>
        )}
      </Modal>
    </S.PageWrapper>
  );
};

export default NotificationManagementModule;
