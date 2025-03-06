"use client";
import { Card, Col, Image, Row, Spin, Timeline } from "antd";
import {
  MailOutlined,
  UsergroupAddOutlined,
  CheckCircleOutlined,
  StopOutlined,
  StockOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useParams } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";

import StatusInterviewTag from "@/components/core/common/StatusInterviewTag";
import StatusEngagementTag from "@/components/core/common/StatusEngagementTag";
import PdfViewer from "../../PDFViewer/PdfViewer";

const { Meta } = Card;

interface DataType {
  key: string;
  _id: string;
  user: {
    _id: string;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    gender: string;
    isActive: boolean;
    avatarUrl: string;
    points: number;
  };
  department: {
    _id: string;
    name: string;
  };
  role: {
    name: string;
  };
  cvUrl: string;
  status: "NEW" | "REJECTED" | "MEMBER" | "DROP_OUT";
  createdAt: string;
  updatedAt: string;
  step: number;
  entranceInterview: {
    _id: string;
    startTime: string | null;
    endTime: string | null;
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

function ApplicationInfoModule({
  engagement,
  isFetching,
}: {
  engagement: DataType;
  isFetching: boolean;
}) {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "engagement");

  return (
    <Spin spinning={isFetching} tip="Loading...">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card
            style={{ width: "100%" }}
            cover={
              <Image
                src={engagement?.user?.avatarUrl}
                alt={engagement?.user?.username}
              />
            }
          >
            <Meta
              title={
                engagement?.user?.firstname + " " + engagement?.user?.lastname
              }
              description={engagement?.user?.username}
            />
          </Card>

          <Card style={{ width: "100%", marginTop: "16px" }}>
            <MailOutlined /> Email: {engagement?.user?.email}
            <br></br>
            <UsergroupAddOutlined /> {t("applicationInfo.gender")}:{" "}
            {engagement?.user?.gender}
            <br></br>
            {engagement?.user?.isActive ? (
              <CheckCircleOutlined />
            ) : (
              <StopOutlined />
            )}{" "}
            {t("applicationInfo.accountStatus")}:{" "}
            {engagement?.user?.isActive ? (
              <CheckCircleOutlined />
            ) : (
              <StopOutlined />
            )}
            <br></br>
            <StockOutlined /> {t("applicationInfo.point")}:{" "}
            {engagement?.user?.points}
          </Card>
          <Card style={{ width: "100%", marginTop: "16px" }}>
            {t("applicationInfo.department")}: {engagement?.department?.name}
            <br></br>
            {t("applicationInfo.interview")}:{" "}
            <StatusInterviewTag
              status={engagement?.entranceInterview?.status}
            />
            <br></br>
            {t("applicationInfo.result")}:{" "}
            <StatusEngagementTag status={engagement?.status} />
            <br></br>
            {t("applicationInfo.role")}: {engagement?.role?.name}
          </Card>
          <Card style={{ width: "100%", marginTop: "16px" }}>
            <Timeline
              items={[
                {
                  children: `${t("applicationInfo.createdAt")}: ${moment(
                    engagement?.createdAt
                  ).format("DD/MM/YYYY HH:mm ")}`,
                },
                {
                  children: `${t("applicationInfo.updatedAt")}: ${moment(
                    engagement?.updatedAt
                  ).format("DD/MM/YYYY HH:mm ")}`,
                },
              ]}
            />
          </Card>
        </Col>

        <Col span={16}>
          <PdfViewer url={`${engagement?.cvUrl}`} />
        </Col>
      </Row>
    </Spin>
  );
}

export default ApplicationInfoModule;
