"use client";

import {
  Avatar,
  Card,
  Col,
  Flex,
  Input,
  List,
  Modal,
  Pagination,
  Row,
} from "antd";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import _ from "lodash";
import { SearchOutlined } from "@ant-design/icons";
import Typography from "@/components/core/common/Typography";
import * as S from "./styles";

import { useTranslation } from "@/app/i18n/client";
import { createQueryString } from "@/utils/queryString";

import { useAppSelector } from "@/hooks/redux-toolkit";
import { RootState } from "@/store";
import { useState } from "react";
import UserInformationModal from "@/components/core/common/UserInformationModal";
import { useGetAllEngagementWithPaginationQuery } from "@/store/queries/engagementManagement";

interface DataType {
  key: string;
  _id: string;
  user: {
    _id: string;
    username: string;
    firstname: string;
    lastname: string;
    avatarUrl: string;
  };
  department: {
    _id: string;
    name: string;
  };
  role: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  status: "NEW" | "REJECTED" | "MEMBER" | "DROP_OUT";
}

function MemberListModule() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const { t } = useTranslation(params?.locale as string, "memberManagement");
  const { currentClub } = useAppSelector((state: RootState) => state.auth);
  const [isMemberInfoModalOpen, setIsMemberInfoModalOpen] = useState(false);
  const [memberId, setMemberId] = useState("");

  const { result, isFetching, total } = useGetAllEngagementWithPaginationQuery(
    {
      id: currentClub?._id,
      page: page,
      limit: limit,
      search: search,
      filters: JSON.stringify({}),
    },
    {
      selectFromResult: ({ data, isFetching }) => {
        const filteredEngagements = data?.result?.engagements.filter(
          (engagement: DataType) =>
            ["MEMBER", "DROP_OUT"].includes(engagement.status)
        );
        return {
          result: filteredEngagements,
          isFetching,
          total: data?.result?.totalCount,
        };
      },
    }
  );

  const showMemberInfoModal = (id: string) => {
    setIsMemberInfoModalOpen(true);
    setMemberId(id);
  };

  const handleMemberInfoCancel = () => {
    setIsMemberInfoModalOpen(false);
    setMemberId("");
  };

  const handleSearch = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(createQueryString("search", `${e?.target?.value}`));
  }, 300);

  return (
    <S.PageWrapper>
      <S.Head>
        <Typography.Title level={2}>{t("memberListTitle")}</Typography.Title>
      </S.Head>
      <S.FilterWrapper>
        <Row gutter={16}>
          <Col span={6}>
            <Typography.Title level={5}>{t("search")}</Typography.Title>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              onChange={handleSearch}
              defaultValue={search}
            />
          </Col>
        </Row>
      </S.FilterWrapper>
      <S.TableWrapper>
        <Card>
          <List
            dataSource={result}
            loading={isFetching}
            renderItem={(item: DataType, index) => (
              <List.Item
                key={index}
                onClick={() => showMemberInfoModal(item?.user?._id)}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item?.user?.avatarUrl} />}
                  title={item?.user?.firstname + " " + item?.user?.lastname}
                  description={item?.department?.name}
                />
              </List.Item>
            )}
          />
        </Card>
        <br />
        <Modal
          title={t("memberInfo")}
          open={isMemberInfoModalOpen}
          onCancel={handleMemberInfoCancel}
          style={{ top: 0 }}
          footer={null}
          width={1000}
        >
          <UserInformationModal _id={memberId} isEditModal={false} />
        </Modal>
        <Flex justify="flex-end">
          <Pagination
            defaultCurrent={page}
            total={total}
            onChange={(page) =>
              router.push(createQueryString("page", `${page}`))
            }
          />
        </Flex>
      </S.TableWrapper>
    </S.PageWrapper>
  );
}

export default MemberListModule;
