"use client";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Space,
  Typography,
  Image,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { useParams } from "next/navigation";
import { useState } from "react";
import Dragger from "antd/es/upload/Dragger";
import useModal from "./../../../hooks/useModal";
import * as S from "./styles";
import { useTranslation } from "@/app/i18n/client";

function BlogManagementModule() {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "adminHumanResources");

  const [form] = Form.useForm();
  const [isCommentMode, setIsCommentMode] = useState(false);
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([
    {
      name: "John Doe",
      timestamp: "2023-04-01 10:00",
      comment: "This is a great post!",
    },
    {
      name: "Jane Smith",
      timestamp: "2023-04-01 11:30",
      comment: "Really enjoyed reading this.",
    },
    {
      name: "Alice Johnson",
      timestamp: "2023-04-02 09:15",
      comment: "Thanks for sharing.",
    },
  ]);
  const [isModalVisiblePost, setIsModalVisiblePost] = useState(false);
  const {
    visible: isAddModalVisible,
    open: openAddModal,
    close: closeAddModal,
  } = useModal();
  const [expanded, setExpanded] = useState(false);

  const submitComment = () => {
    const newComment = {
      name: "New User",
      timestamp: new Date().toISOString(),
      comment: comment,
    };
    setCommentsList((prevComments) => [...prevComments, newComment]);
    setComment("");
  };

  const handleAddOk = async () => {
    try {
      const values = await form.validateFields();
      closeAddModal();
      form.resetFields();
    } catch (error) {
      message.error("Error adding club");
    }
  };

  const handleCancel = () => {
    closeAddModal();
  };

  const showModalPost = () => {
    setIsModalVisiblePost(true);
    setIsCommentMode(true);
  };

  const handleCancelPost = () => {
    setIsModalVisiblePost(false);
    setIsCommentMode(false);
  };

  const props = {
    name: "file",
    multiple: true,
    showUploadList: false,
    action: "//jsonplaceholder.typicode.com/posts/",
    onChange(info: any) {
      const status = info.file.status;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <S.PageWrapper>
      <Row justify="center">
        <Col span={24}>
          <Row justify="center">
            <Col span={8}>
              <Card bordered={false}>
                <Row justify="center" align="middle">
                  <Col>
                    <Avatar src="https://example.com/avatar.jpg" />
                  </Col>
                  <Col flex="auto">
                    <Input.TextArea
                      rows={1}
                      placeholder="What's on your mind?"
                      style={{ resize: "none" }}
                      onClick={openAddModal}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Modal
        title=""
        open={isAddModalVisible}
        onOk={handleAddOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="postContent"
            rules={[{ required: true, message: "Please input your post!" }]}
          >
            <Input.TextArea rows={4} placeholder="What's on your mind?" />
          </Form.Item>
          <Form.Item
            name="avatarUrl"
            rules={[{ required: true, message: t("avatarUrlRequired") }]}
          >
            <Dragger {...props}>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Post
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Row justify="center">
        <Col span={8}>
          <Card
            actions={[
              <SearchOutlined key="like" style={{ color: "red" }} />,
              <EyeOutlined key="comment" onClick={showModalPost} />,
              <ShareAltOutlined key="share" />,
            ]}
          >
            <Space align="center">
              <Avatar src="https://example.com/avatar2.png" />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Typography.Text>Nhat Anh</Typography.Text>
                <Typography.Text type="secondary">9:00AM</Typography.Text>
              </div>
            </Space>

            <Typography.Paragraph
              ellipsis={{
                rows: 2,
                expandable: true,
                expanded,
                onExpand: (_, info) => setExpanded(info.expanded),
              }}
              copyable
            >
              Khi số lượng người dùng ứng dụng của bạn ngày càng tăng lên, dữ
              liệu từ đó sẽ tăng trưởng ngày càng nhiều hơn mỗi ngày, database
              của dự án sẽ dần trở nên quá tải. Và đây chính là lúc cần thực
              hiện scale database.
            </Typography.Paragraph>
            <Image src="https://example.com/image.png" alt="" />
            <Modal
              title="Comments"
              open={isModalVisiblePost}
              onCancel={handleCancelPost}
              footer={null}
            >
              {isCommentMode && (
                <div>
                  <div
                    style={{
                      maxHeight: commentsList.length > 6 ? "300px" : "auto",
                      overflowY: commentsList.length > 6 ? "scroll" : "visible",
                    }}
                  >
                    {commentsList.map((item, index) => (
                      <div key={index} style={{ marginBottom: "10px" }}>
                        <strong>{item.name}</strong> at {item.timestamp}
                        <div>{item.comment}</div>
                      </div>
                    ))}
                  </div>
                  <Input.TextArea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment..."
                  />
                  <Button type="primary" onClick={submitComment}>
                    Submit Comment
                  </Button>
                </div>
              )}
            </Modal>
          </Card>
        </Col>
      </Row>
    </S.PageWrapper>
  );
}

export default BlogManagementModule;
