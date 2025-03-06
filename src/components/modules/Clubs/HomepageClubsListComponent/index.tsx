"use client";

import { useGetAllClubCategoryQuery } from "@/store/queries/clubCategoryManagement";
import { useGetClubBySubnamev2Query } from "@/store/queries/clubManagement";
import { createQueryString } from "@/utils/queryString";
import * as S from "./styles";

import {
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
import { useAppSelector } from "@/hooks/redux-toolkit";

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
  isMember: boolean;
}

function HomepageClubsListComponent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
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

  const { t } = useTranslation(params?.locale as string, "clubs");

  const { result: categoryResult, isFetching: categoryIsFetching } =
    useGetAllClubCategoryQuery(undefined, {
      selectFromResult: ({ data, isFetching }) => {
        const newClubDepartmentData = data?.data?.map(
          (category: ClubCategoryDataType) => ({
            label: category.name,
            value: category._id,
          })
        );
        return {
          result: newClubDepartmentData ?? [],
          isFetching,
        };
      },
    });

  const { userInfo } = useAppSelector((state) => state.auth);

  const {
    result: clubsResult,
    isFetching: clubsIsFetching,
    total,
    refetch,
  } = useGetClubBySubnamev2Query(
    {
      subname: "",
      userId: userInfo?._id,
      page: page,
      limit: 10,
    },
    {
      selectFromResult: ({ data, isFetching }) => ({
        result: data?.data ?? [],
        total: data?.result ?? 0,
        isFetching,
      }),
    }
  );
  console.log(clubsResult);
  const handlePageChange = (page: number) => {
    router.push(createQueryString("page", `${page}`));
  };

  const handleSearch = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(createQueryString("search", `${e?.target?.value}`));
  }, 300);

  const handleFilterClubCategory = _.debounce((e) => {
    router.push(createQueryString("category", `${e ?? ""}`));
  }, 300);

  return (
    <S.PageWrapper>
      <Row style={{ marginBottom: "16px" }}>
        <Col span={20} style={{ paddingRight: "16px" }}>
          <Input
            placeholder={t("searchClub")}
            prefix={<SearchOutlined />}
            onChange={handleSearch}
            defaultValue={search}
          />
        </Col>
        <Col span={4}>
          <Select
            style={{ width: "100%", height: "100%" }}
            options={categoryResult}
            loading={categoryIsFetching}
            onChange={handleFilterClubCategory}
            placeholder={t("chooseClubCategory")}
            allowClear
            defaultValue={category}
          />
        </Col>
      </Row>

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
        dataSource={clubsResult?.clubs}
        loading={clubsIsFetching}
        renderItem={(item: ClubDataType) => (
          <List.Item key={item?._id}>
            <Card
              hoverable
              cover={
                <Image
                  src={item?.avatarUrl}
                  alt={item?.name}
                  preview={false}
                  fallback="/images/no-data.png"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onClick={() => router.push(`clubs/${item?.subname}`)}
                />
              }
              actions={[
                <Row
                  style={{ padding: "0 16px" }}
                  gutter={[16, 16]}
                  key={item?._id}
                >
                  {item?.isMember ? (
                    <Col span={24} style={{ textAlign: "center" }}>
                      <Link href={`clubs/${item?.subname}`}>
                        <Button block>{t("viewMore")}</Button>
                      </Link>
                    </Col>
                  ) : (
                    <>
                      <Col span={12}>
                        <Link href={`clubs/${item?.subname}`}>
                          <Button block>{t("viewMore")}</Button>
                        </Link>
                      </Col>
                      <Col span={12}>
                        <Button
                          block
                          type="primary"
                          onClick={() => showJoinAClubModal(item?._id)}
                        >
                          {t("joinNow")}
                        </Button>
                      </Col>
                    </>
                  )}
                </Row>,
              ]}
            >
              <Tag style={{ marginBottom: "16px" }} color="success">
                {item?.category?.name}
              </Tag>
              <Meta title={item?.subname} description={item?.name} />
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
            </Card>
          </List.Item>
        )}
      />
      <Flex justify="flex-end">
        <Pagination
          defaultCurrent={page}
          total={total}
          onChange={handlePageChange}
        />
      </Flex>
    </S.PageWrapper>
  );
}

export default HomepageClubsListComponent;
