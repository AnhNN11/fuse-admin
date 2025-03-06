"use client";
import { useGetClubBySubnameQuery } from "@/store/queries/clubManagement";
import { useParams } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";

import {
  Avatar,
  Button,
  Card,
  Col,
  Image,
  Modal,
  Row,
  Spin,
  Tag,
  Typography,
} from "antd";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import {
  UsergroupAddOutlined,
  UnorderedListOutlined,
  RightCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import HomepageEventByClubComponent from "../../EventsManagement/HomepageEventByClubComponent";
import { useState } from "react";
import { useAppSelector } from "@/hooks/redux-toolkit";
import JoinAClubModule from "../../JoinAClub";

const { Text } = Typography;

function HomepageClubInfomationContainer() {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "clubs");
  const { userInfo } = useAppSelector((state) => state.auth);
  const [isJoinAClubModalOpen, setIsJoinAClubModalOpen] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState("");

  const showJoinAClubModal = (clubId: string) => {
    setSelectedClubId(clubId);
    setIsJoinAClubModalOpen(true);
  };

  const handleJoinAClubCancel = () => {
    setIsJoinAClubModalOpen(false);
    setSelectedClubId("");
  };

  interface ClubDataType {
    _id: string;
    name: string;
    subname: string;
    category: {
      _id: string;
      name: string;
    };
    description: string;
    avatarUrl: string;
    bannerUrl: string;
    activityPoint: number;
    isActive: boolean;
    createdAt: Date;
    isMember: boolean;
    event?: Event[];
  }

  interface Event {
    _id: string;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    type: string;
    bannerUrl: string;
    isApproved: boolean;
    location: {
      _id: string;
      name: string;
      building: string;
    };
    status: string;
  }

  const {
    result: clubsResult,
    isFetching: clubsIsFetching,
    refetch,
  } = useGetClubBySubnameQuery(
    {
      subname: params?.subname as string,
      userId: userInfo?._id as string,
    },
    {
      selectFromResult: ({ data, isFetching }) => {
        return {
          result: {
            ...data?.clubInfo,
            event: data?.eventByClub.events ?? [],
          } as ClubDataType,
          total: data?.count ?? 0,
          isFetching,
        };
      },
    }
  );

  return (
    <Spin spinning={clubsIsFetching} tip="Loading...">
      <Content style={{ marginTop: "16px", marginBottom: "16px" }}>
        <Row justify="center">
          <Col xs={24} sm={18} md={18} lg={18}>
            <Image
              src={clubsResult?.bannerUrl}
              alt={clubsResult?.name}
              preview={false}
              style={{ objectFit: "cover" }}
              fallback={"/images/no-data.png"}
            />
          </Col>
        </Row>
        <Row justify="center" style={{ paddingTop: "16px" }}>
          <Col xs={10} sm={2} md={2} lg={2} style={{ paddingRight: "16px" }}>
            <Avatar
              shape="square"
              style={{ width: "100%", height: "auto" }}
              icon={
                <Image
                  src={clubsResult?.avatarUrl}
                  alt={clubsResult?.name}
                  fallback={"/images/no-data.png"}
                />
              }
            />
          </Col>
          <Col xs={10} sm={6} md={6} lg={6}>
            <Title level={3} color="primary">
              {clubsResult?.subname}
            </Title>
            <Title level={5}>{clubsResult?.name}</Title>
            <Tag color="red">{clubsResult?.category?.name}</Tag>
          </Col>
          <Col xs={20} sm={6} md={6} lg={6}></Col>
          <Col xs={20} sm={4} md={4} lg={4}>
            {clubsResult?.isMember ? (
              <Button
                disabled
                block
                type="primary"
                onClick={() => showJoinAClubModal(clubsResult?._id)}
                icon={<UsergroupAddOutlined />}
              >
                {t("joinNow")}
              </Button>
            ) : (
              <Button
                block
                type="primary"
                onClick={() => showJoinAClubModal(clubsResult?._id)}
                icon={<UsergroupAddOutlined />}
              >
                {t("joinNow")}
              </Button>
            )}
          </Col>
          <Col xs={20} sm={18} md={18} lg={18} style={{ marginTop: "16px" }}>
            <Card style={{ textAlign: "justify" }}>
              {clubsResult?.description}
            </Card>
          </Col>
          <Col xs={20} sm={18} md={18} lg={18} style={{ marginTop: "16px" }}>
            {clubsResult?.event?.length != 0 && (
              <HomepageEventByClubComponent
                event={clubsResult?.event as Event[]}
              />
            )}
          </Col>
          <Modal
            title={t("joinAClub")}
            open={isJoinAClubModalOpen}
            onCancel={handleJoinAClubCancel}
            footer={null}
          >
            <JoinAClubModule
              clubId={selectedClubId}
              refetch={refetch}
              onSaveSuccess={handleJoinAClubCancel}
            />
          </Modal>
        </Row>
      </Content>
    </Spin>
  );
}

export default HomepageClubInfomationContainer;
