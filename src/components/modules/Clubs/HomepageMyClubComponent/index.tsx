"use client";

import { useGetAllClubCategoryQuery } from "@/store/queries/clubCategoryManagement";
import { useGetAllClubWithPaginationQuery } from "@/store/queries/clubManagement";
import { createQueryString } from "@/utils/queryString";
import * as S from "./styles";

import {
  Avatar,
  Button,
  Card,
  Col,
  Flex,
  Image,
  Input,
  List,
  Modal,
  Pagination,
  Row,
  Select,
  Tag,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";

import _ from "lodash";
import { useRouter } from "next-nprogress-bar";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import Link from "next/link";
import JoinAClubModule from "../../JoinAClub";
import { useState } from "react";
import { useGetMyClubsQuery } from "@/store/queries/engagementManagement";
import { useAppSelector } from "@/hooks/redux-toolkit";
import { RootState } from "@/store";

export interface ClubCategoryDataType {
  _id: string;
  name: string;
}
export interface ClubDataType {
  _id: string;
  name: string;
  subname: string;
  category: ClubCategoryDataType;
  avatarUrl: string;
}

function HomepageMyClubComponent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const [isJoinAClubModalOpen, setIsJoinAClubModalOpen] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState("");
  const { userInfo } = useAppSelector((state: RootState) => state.auth);

  const { t } = useTranslation(params?.locale as string, "clubs");

  const {
    result: clubsResult,
    isFetching: clubsIsFetching,
    refetch,
  } = useGetMyClubsQuery(userInfo?._id, {
    selectFromResult: ({ data, isFetching }) => {
      console.log(data);

      return {
        result: data?.result ?? [],
        total: data?.total ?? 0,
        isFetching,
      };
    },
  });

  return (
    <S.PageWrapper>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 4,
          xxl: 6,
        }}
        dataSource={clubsResult}
        loading={clubsIsFetching}
        renderItem={(item: any) => (
          <List.Item key={item?._id}>
            <Card
              hoverable
              cover={
                <Image
                  src={item?.club?.avatarUrl}
                  alt={item?.club?.name}
                  preview={false}
                  fallback="/images/no-data.png"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onClick={() =>
                    router.push(
                      `/club-management/${item?.club?.subname}/event-management`
                    )
                  }
                />
              }
            >
              <Meta
                title={item?.club?.subname}
                description={item?.club?.name}
              />
            </Card>
          </List.Item>
        )}
      />
    </S.PageWrapper>
  );
}

export default HomepageMyClubComponent;
