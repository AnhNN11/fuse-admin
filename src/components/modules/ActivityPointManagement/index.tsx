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
  message,
  Badge,
  Card,
  Descriptions,
  Tag,
} from "antd";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  UserOutlined,
  TagOutlined,
  InfoCircleOutlined,
  DollarCircleOutlined,
  FireOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import React, { useState } from "react";
import _ from "lodash";

import { useTranslation } from "@/app/i18n/client";
import { useGetAllClubsQuery } from "@/store/queries/clubsManagement";
import { createQueryString } from "@/utils/queryString";

import * as S from "./styles";
import { useGetAllPointsQuery } from "@/store/queries/pointManagement";
import { log } from "console";

interface DataType {
  key: string;
  _id: string;
  name: string;
  username: string;
  points: number;
}

function ActivityPointModule() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const { t } = useTranslation(params?.locale as string, "clubsManagement");

  const { result, isFetching, total, refetch } = useGetAllPointsQuery(
    {
      page: page,
      limit: limit,
    },
    {
      selectFromResult: ({ data, isFetching }) => {
        return {
          result: data?.data,
          isFetching,
          total: data?.total,
        };
      },
    }
  );
  console.log("result", result);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: t("table.number"),
      dataIndex: "_id",
      key: "_id",
      width: 50,
      render: (text, _, index) => (
        <Typography.Text>{index + 1}</Typography.Text>
      ),
    },
    {
      title: "Tên câu lạc bộ",
      dataIndex: "username",
      key: "username",
      width: 200,
    },

    {
      title: t("firstname"),
      dataIndex: "firstname",
      key: "firstname",
      width: 250,
    },
    {
      title: t("lastname"),
      dataIndex: "lastname",
      key: "lastname",
      width: 200,
    },
    {
      title: "Điểm",
      dataIndex: "points",
      key: "points",
      width: 200,
    },
  ];
  console.log(result);

  const handleSearch = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(createQueryString("search", `${e?.target?.value}`));
  }, 300);

  return (
    <S.PageWrapper>
      <S.Head>
        <Typography.Title level={2}>{t("title")}</Typography.Title>
      </S.Head>
      <S.FilterWrapper>
        <Typography.Title level={5}>{t("search")}</Typography.Title>
        <Input
          placeholder={t("searchPlaceholder")}
          prefix={<SearchOutlined />}
          onChange={handleSearch}
          defaultValue={search}
        />
      </S.FilterWrapper>
      <S.TableWrapper>
        <Table
          columns={columns}
          dataSource={result}
          loading={isFetching}
          rowKey={(record) => record._id}
          pagination={false}
        />
        <br />
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

export default ActivityPointModule;
