"use client";

import {
  Flex,
  Input,
  Pagination,
  Table,
  TableProps,
  Typography,
  Image,
  Button,
  Modal,
  Space,
  Badge,
  Card,
  Descriptions,
  Tag,
  Form,
  Select,
  InputNumber,
  Upload,
  message,
} from "antd";
import { UploadFile } from "antd/es/upload/interface";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import {
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  UserOutlined,
  TagOutlined,
  InfoCircleOutlined,
  DollarCircleOutlined,
  FireOutlined,
  CalendarOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import _ from "lodash";
import axios from "axios";
import { useTranslation } from "@/app/i18n/client";
import {
  useGetAllClubsQuery,
  useGetAllClubCategoriesQuery,
  useAddNewClubMutation,
  useUpdateClubMutation,
} from "@/store/queries/clubsManagement";
import { createQueryString } from "@/utils/queryString";
import useModal from "./../../../hooks/useModal";

import * as S from "./styles";
interface Category {
  _id: string;
  name: string;
}

interface DataType {
  key: string;
  id: string;
  _id: string;
  name: string;
  subname: string;
  category: Category;
  description: string;
  avatarUrl: string;
  bannerUrl: string;
  activityPoint: number;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

function ClubsManagementModule() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedClub, setSelectedClub] = useState<DataType | null>(null);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [addNewClub] = useAddNewClubMutation();
  const [updateClub] = useUpdateClubMutation();
  const [avatarFileList, setAvatarFileList] = useState<UploadFile[]>([]);
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [updateAvatarFileList, setUpdateAvatarFileList] = useState<
    UploadFile[]
  >([]);
  const [updateBannerFileList, setUpdateBannerFileList] = useState<
    UploadFile[]
  >([]);
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";
  const statusFilter = searchParams.get("status") || "";
  const { t } = useTranslation(params?.locale as string, "clubsManagement");

  const {
    visible: isModalVisible,
    open: openModal,
    close: closeModal,
  } = useModal();
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

  const columns = (
    showDetails: (record: DataType) => void,
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
      title: t("avatar"),
      dataIndex: "avatarUrl",
      key: "avatarUrl",
      width: 120,
      render: (url) => <Image width={100} src={url} alt="avatar" />,
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      width: 250,
    },
    {
      title: t("subname"),
      dataIndex: "subname",
      key: "subname",
      width: 200,
    },
    {
      title: t("category"),
      dataIndex: "category",
      key: "category",
      width: 200,
      render: (category) => <Typography.Text>{category.name}</Typography.Text>,
    },
    {
      title: t("status"),
      dataIndex: "isActive",
      key: "isActive",
      width: 200,
      render: (isActive) => (
        <Badge
          status={isActive ? "success" : "error"}
          text={isActive ? t("active") : t("inactive")}
        />
      ),
    },
    {
      title: t("action"),
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => showDetails(record)}>
            {t("viewDetails")}
          </Button>
          <Button icon={<EditOutlined />} onClick={() => handleUpdate(record)}>
            {t("update")}
          </Button>
        </Space>
      ),
    },
  ];

  const { data, refetch } = useGetAllClubsQuery({ page });

  const { result, total } = data
    ? {
        result: data?.data?.clubs || [],
        total: data?.result || 0,
      }
    : {
        result: [],
        total: 0,
      };

  const { data: categoryData } = useGetAllClubCategoriesQuery({ page: 1 });

  const handlePageChange = (page: number) => {
    router.push(createQueryString("page", `${page}`));
  };

  const handleSearch = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(createQueryString("search", `${e?.target?.value}`));
  }, 300);

  const handleFilterChange = (value: string, type: string) => {
    router.push(createQueryString(type, value));
  };

  const handleUploadImage = async (
    event: any,
    type: string,
    formInstance: any,
    setFileList: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    try {
      const file: File = event.file;
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(
        "https://api.imgbb.com/1/upload?key=1214db526cddfecaf4625a3280267541",
        formData
      );

      const imageUrl = response.data.data.url;

      formInstance.setFieldsValue({
        [type]: imageUrl,
      });

      setFileList([{ url: imageUrl }]);
    } catch (error) {
      message.error(`Error uploading image`);
    }
  };

  const showDetails = (record: DataType) => {
    setSelectedClub(record);
    openModal();
  };

  const handleOk = () => {
    closeModal();
    setSelectedClub(null);
  };

  const handleAddOk = async () => {
    try {
      const values = await form.validateFields();
      await addNewClub(values).unwrap();
      closeAddModal();
      form.resetFields();
      setAvatarFileList([]);
      setBannerFileList([]);
      refetch();
    } catch (error) {
      message.error(`Error add club`);
    }
  };

  const handleUpdateOk = async () => {
    try {
      const values = await updateForm.validateFields();
      await updateClub({
        id: selectedClub?._id,
        data: values,
      }).unwrap();
      closeUpdateModal();
      updateForm.resetFields();
      setUpdateAvatarFileList([]);
      setUpdateBannerFileList([]);
      setSelectedClub(null);
      refetch();
    } catch (error) {
      message.error("Failed to update club:");
    }
  };

  const showModal = () => {
    openAddModal();
  };

  const handleCancel = () => {
    setAvatarFileList([]);
    setBannerFileList([]);
    setUpdateAvatarFileList([]);
    setUpdateBannerFileList([]);
    closeAddModal();
    closeModal();
    closeUpdateModal();
    setSelectedClub(null);
  };

  const handleUpdate = (record: DataType) => {
    setSelectedClub(record);
    const avatarFile: UploadFile = {
      uid: "-1",
      name: "avatar",
      status: "done",
      url: record.avatarUrl,
    };

    const bannerFile: UploadFile = {
      uid: "-2",
      name: "banner",
      status: "done",
      url: record.bannerUrl,
    };
    setUpdateAvatarFileList([avatarFile]);
    setUpdateBannerFileList([bannerFile]);
    updateForm.setFieldsValue({
      name: record.name,
      subname: record.subname,
      category: record.category._id,
      description: record.description,
      avatarUrl: record.avatarUrl,
      bannerUrl: record.bannerUrl,
      activityPoint: record.activityPoint,
      balance: record.balance,
      isActive: record.isActive,
    });
    openUpdateModal();
  };

  useEffect(() => {
    if (categoryData) {
      setCategories(categoryData.data);
    }
  }, [categoryData]);

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
          <Select
            placeholder={t("category")}
            onChange={(value) => handleFilterChange(value, "category")}
            value={categoryFilter}
            style={{ width: 200 }}
          >
            <Select.Option value="">{t("category")}</Select.Option>
            {categories.map((category) => (
              <Select.Option key={category._id} value={category._id}>
                {category?.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder={t("status")}
            onChange={(value) => handleFilterChange(value, "status")}
            value={statusFilter}
            style={{ width: 200 }}
          >
            <Select.Option value="">{t("status")}</Select.Option>
            <Select.Option value="true">{t("active")}</Select.Option>
            <Select.Option value="false">{t("inactive")}</Select.Option>
          </Select>
        </div>
      </S.FilterWrapper>
      <S.TableWrapper>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
          style={{ marginBottom: "15px" }}
        >
          {t("addClub")}
        </Button>

        <Modal
          title={t("addClub")}
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
              <Input />
            </Form.Item>
            <Form.Item name="subname" label={t("subname")}>
              <Input />
            </Form.Item>
            <Form.Item
              name="category"
              label={t("category")}
              rules={[{ required: true, message: t("validCategory") }]}
            >
              <Select>
                {categories?.map((category) => (
                  <Select.Option key={category?._id} value={category?._id}>
                    {category?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="description" label={t("description")}>
              <Input.TextArea />
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Form.Item
                label={t("avatar")}
                name="avatarUrl"
                rules={[{ required: true, message: t("avatarUrlRequired") }]}
              >
                <Upload
                  listType="picture-card"
                  fileList={avatarFileList}
                  customRequest={(event) =>
                    handleUploadImage(
                      event,
                      "avatarUrl",
                      form,
                      setAvatarFileList
                    )
                  }
                  onRemove={() => setAvatarFileList([])}
                >
                  {avatarFileList?.length === 0 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>{t("uploadAvatar")}</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <Form.Item
                name="bannerUrl"
                label={t("banner")}
                rules={[{ required: true, message: t("bannerUrlRequired") }]}
                style={{ width: "48%" }}
              >
                <Upload
                  listType="picture-card"
                  fileList={bannerFileList}
                  customRequest={(event) =>
                    handleUploadImage(
                      event,
                      "bannerUrl",
                      form,
                      setBannerFileList
                    )
                  }
                  onRemove={() => setBannerFileList([])}
                >
                  {bannerFileList.length === 0 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>{t("Upload Banner")}</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </div>
            <Form.Item
              name="activityPoint"
              label={t("activityPoint")}
              rules={[
                {
                  type: "number",
                  min: 0,
                  message: t("validActivity"),
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              name="balance"
              label={t("balance")}
              rules={[
                {
                  type: "number",
                  min: 0,
                  message: t("validBalance"),
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
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
              name="name"
              label={t("name")}
              rules={[{ required: true, message: t("validName") }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="subname" label={t("subname")}>
              <Input />
            </Form.Item>
            <Form.Item
              name="category"
              label={t("category")}
              rules={[{ required: true, message: t("validCategory") }]}
            >
              <Select>
                {categories?.map((category) => (
                  <Select.Option key={category?._id} value={category?._id}>
                    {category?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="description" label={t("description")}>
              <Input.TextArea />
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Form.Item
                label={t("avatar")}
                name="avatarUrl"
                rules={[{ required: true, message: t("avatarUrlRequired") }]}
              >
                <Upload
                  listType="picture-card"
                  fileList={updateAvatarFileList}
                  customRequest={(event) =>
                    handleUploadImage(
                      event,
                      "avatarUrl",
                      updateForm,
                      setUpdateAvatarFileList
                    )
                  }
                  onRemove={() => setUpdateAvatarFileList([])}
                >
                  {updateAvatarFileList?.length === 0 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>{t("uploadAvatar")}</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <Form.Item
                name="bannerUrl"
                label={t("banner")}
                rules={[{ required: true, message: t("bannerUrlRequired") }]}
                style={{ width: "48%" }}
              >
                <Upload
                  listType="picture-card"
                  fileList={updateBannerFileList}
                  customRequest={(event) =>
                    handleUploadImage(
                      event,
                      "bannerUrl",
                      updateForm,
                      setUpdateBannerFileList
                    )
                  }
                  onRemove={() => setUpdateBannerFileList([])}
                >
                  {updateBannerFileList?.length === 0 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>{t("Upload Banner")}</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </div>
            <Form.Item
              name="balance"
              label={t("balance")}
              rules={[
                {
                  type: "number",
                  min: 0,
                  message: t("validBalance"),
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              name="isActive"
              label={t("status")}
              rules={[
                {
                  required: true,
                  message: t("validStatus"),
                },
              ]}
            >
              <Select>
                <Select.Option value={true}>{t("Active")}</Select.Option>
                <Select.Option value={false}>{t("Inactive")}</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <Table
          columns={columns(showDetails, handleUpdate)}
          dataSource={result}
          rowKey="id"
          pagination={false}
        />
        <Modal
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              {t("close")}
            </Button>,
          ]}
          width={800}
        >
          {selectedClub && (
            <Card>
              <div style={{ position: "relative", textAlign: "center" }}>
                <Image
                  width="100%"
                  src={selectedClub?.bannerUrl}
                  alt="banner"
                  style={{ marginBottom: 16 }}
                />
                <Image
                  width={100}
                  src={selectedClub?.avatarUrl}
                  alt="avatar"
                  style={{
                    position: "absolute",
                    bottom: -50,
                    left: "50%",
                    transform: "translateX(-50%)",
                    border: "3px solid white",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <Descriptions
                title={t("clubInfo")}
                bordered
                column={1}
                style={{ marginTop: 50 }}
              >
                <Descriptions.Item
                  label={
                    <>
                      <UserOutlined /> {t("name")}
                    </>
                  }
                >
                  {selectedClub?.name}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <TagOutlined /> {t("subname")}
                    </>
                  }
                >
                  {selectedClub?.subname}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <InfoCircleOutlined /> {t("category")}
                    </>
                  }
                >
                  {selectedClub?.category?.name}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <InfoCircleOutlined /> {t("description")}
                    </>
                  }
                >
                  {selectedClub?.description}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <FireOutlined /> {t("activityPoint")}
                    </>
                  }
                >
                  {selectedClub?.activityPoint}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <DollarCircleOutlined /> {t("balance")}
                    </>
                  }
                >
                  {selectedClub?.balance}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <CalendarOutlined /> {t("createdAt")}
                    </>
                  }
                >
                  {new Date(selectedClub?.createdAt).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <CalendarOutlined /> {t("updatedAt")}
                    </>
                  }
                >
                  {new Date(selectedClub?.updatedAt).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <CheckCircleOutlined /> {t("status")}
                    </>
                  }
                >
                  {selectedClub?.isActive ? (
                    <Tag color="green">{t("active")}</Tag>
                  ) : (
                    <Tag color="red">{t("inactive")}</Tag>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </Modal>
        <Flex justify="flex-end">
          <Pagination
            defaultCurrent={page}
            total={total}
            onChange={handlePageChange}
          />
        </Flex>
      </S.TableWrapper>
    </S.PageWrapper>
  );
}

export default ClubsManagementModule;
