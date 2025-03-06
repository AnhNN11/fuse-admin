"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import { useGetNotificationByIdQuery } from "@/store/queries/notificationManagement";
import {
  Typography,
  Spin,
  Alert,
  Card,
  Space,
  Divider,
  Row,
  Col,
  Tag,
} from "antd";
import {
  InfoCircleOutlined,
  ClockCircleOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const NotificationDetail: React.FC = () => {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "notification");
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data, error, isLoading } = useGetNotificationByIdQuery({ id });

  const notification = data?.data?.notification;

  console.log(notification);
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to load notification details"
        type="error"
        showIcon
        icon={<InfoCircleOutlined />}
        style={{ margin: "20px" }}
      />
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Card
        bordered={false}
        style={{
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={2}>
              <BellOutlined style={{ marginRight: "8px" }} />
              {notification?.title}
            </Title>
          </Col>
          <Col span={24}>
            <Paragraph>
              <div
                dangerouslySetInnerHTML={{ __html: notification?.message }}
              />
            </Paragraph>
          </Col>
          <Col span={24}>
            <Divider />
            <Space direction="vertical">
              <Text type="secondary">
                <ClockCircleOutlined style={{ marginRight: "4px" }} />
                {t("createdAt")}:
                {` ${new Date(notification?.createdAt).toLocaleString()}`}
              </Text>
              <Text type="secondary">
                <InfoCircleOutlined style={{ marginRight: "4px" }} />
                {t("type")}: {notification?.type.toUpperCase()}
              </Text>
              <Text type="secondary">
                <UserOutlined style={{ marginRight: "4px" }} />
                {t("createdBy")}:{" "}
                {notification?.createdBy?.username || t("unknown")}
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default NotificationDetail;
