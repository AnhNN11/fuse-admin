"use client";

import { useGetAllClubCategoryQuery } from "@/store/queries/clubCategoryManagement";
import { useGetTop5ClubsQuery } from "@/store/queries/clubManagement";
import { createQueryString } from "@/utils/queryString";
import * as S from "./styles";

import {
  Badge,
  Button,
  Card,
  Col,
  Flex,
  Image,
  List,
  Row,
  Tag,
  Typography,
  Space,
} from "antd";
import { StarFilled } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";

import _ from "lodash";
import { useRouter } from "next-nprogress-bar";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import Link from "next/link";

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
  activityPoint: number;
}

function HomepageClubsListComponent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
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

  const { result: clubsResult, isFetching: clubsIsFetching } =
    useGetTop5ClubsQuery(
      {},
      {
        selectFromResult: ({ data, isFetching }) => {
          const newClubData = data?.data?.topClubs;
          console.log(data?.data?.topClubs);
          return {
            result: newClubData ?? [],
            isFetching,
          };
        },
      }
    );
  console.log();
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
      <Flex justify="center" style={{ marginBottom: "16px" }}>
        <Typography.Title level={3}>{t("top5Clubs")}</Typography.Title>
      </Flex>

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
        loading={clubsIsFetching}
        dataSource={clubsResult}
        renderItem={(item: ClubDataType, index: number) => (
          <List.Item key={item?._id}>
            <Badge.Ribbon
              text={`#${index + 1}`} // Hiển thị thứ hạng
              color="gold"
            >
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
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                }
                actions={[
                  <Row
                    style={{ padding: "0 16px" }}
                    gutter={[16, 16]}
                    key={item?._id}
                  >
                    <Col span={24}>
                      <Link href={`clubs/${item?.subname}`}>
                        <Button block>{t("viewMore")}</Button>
                      </Link>
                    </Col>
                  </Row>,
                ]}
              >
                <Tag style={{ marginBottom: "8px" }} color="success">
                  {item?.category?.name}
                </Tag>
                <Meta title={item?.name} description={item?.subname} />
                <Typography>
                  {" "}
                  {t("activityPoint")}: {item?.activityPoint}
                </Typography>
              </Card>
            </Badge.Ribbon>
          </List.Item>
        )}
      />
    </S.PageWrapper>
  );
}

export default HomepageClubsListComponent;
