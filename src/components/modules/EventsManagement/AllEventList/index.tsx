"use client";

import { useState } from "react";
import {
  Button,
  Col,
  Flex,
  Popconfirm,
  Row,
  Skeleton,
  TableProps,
  Tooltip,
  message,
} from "antd";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import {
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import moment from "moment";
import dayjs from "dayjs";

import { useTranslation } from "@/app/i18n/client";
import { createQueryString } from "@/utils/queryString";
import {
  useDeleteEventMutation,
  useGetAllEventsForManagerQuery,
  useGetAllEventsQuery,
} from "@/store/queries/eventsMangement";
import useModal from "@/hooks/useModal";
import { RootState } from "@/store";
import { useGetAllLoactionsQuery } from "@/store/queries/LocationMangement";
import { useAppSelector } from "@/hooks/redux-toolkit";

import Typography from "@/components/core/common/Typography";
import DrawerEventDetail from "@/components/core/common/DrawerEventDetail/Main";
import StatusTag from "@/components/core/common/StatusTag";
import EventTypeTag from "@/components/core/common/EventTypeTag";

import * as S from "./styles";
import webStorageClient from "@/utils/webStorageClient";
import { constants } from "@/settings";
import AttendanceModal from "../../GuestEvent/AttendanceModal";
import EventItem from "@/components/core/common/EventItem";

interface DataType {
  key: string;
  _id: string;
  club: {
    avatarUrl: string;
    name: string;
  };
  createdAt: string;
  location: {
    name: string;
  };
  status: "PENDING" | "APPROVED" | "REJECTED";
  type: "INTERNAL" | "PUBLIC";
}

function AllEventList() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { currentClub } = useAppSelector((state: RootState) => state.auth);

  const modal = useModal();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const status = searchParams.get("status") || "";
  const location = searchParams.get("location") || "";
  const date: any = searchParams.get("date") || "";

  const dateFormatted = date ? JSON.parse(date) : null;

  const { t } = useTranslation(params?.locale as string, "eventsManagement");

  const { result, isFetching, total, refetch } = useGetAllEventsQuery(
    {
      page: page,
      limit: limit,
      search: search,
      filters: JSON.stringify({
        // club: currentClub?._id,
        type: "PUBLIC",
        status: "APPROVED",
        createdAt: dateFormatted
          ? {
              $gte: dayjs(dateFormatted?.$gte).format(),
              $lte: dayjs(dateFormatted?.$lte).format(),
            }
          : "",
      }),
    },
    {
      selectFromResult: ({ data, isFetching }) => {
        return {
          result: data?.result?.events,
          isFetching,
          total: data?.result?.totalCount,
        };
      },
    }
  );

  console.log("result", result);

  const handleSearch = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(createQueryString("search", `${e?.target?.value}`));
  }, 300);

  const handleFilterType = _.debounce((e: string) => {
    router.push(createQueryString("type", `${e ?? ""}`));
  }, 300);

  const handleFilterStatus = _.debounce((e: string) => {
    router.push(createQueryString("status", `${e ?? ""}`));
  }, 300);

  const handleFilterLocation = _.debounce((e) => {
    router.push(createQueryString("location", `${e ?? ""}`));
  }, 300);

  const handleFilterDate = _.debounce((e) => {
    router.push(
      createQueryString(
        "date",
        `${
          e
            ? JSON.stringify({
                $gte: dayjs(e?.[0]).format(),
                $lte: dayjs(e?.[1]).format(),
              })
            : ""
        }`
      )
    );
  }, 300);

  return (
    <S.PageWrapper>
      <S.Head>
        <Typography.Title level={2}>Sự kiện sắp diễn ra</Typography.Title>
        <Button type="primary" onClick={modal.open} size="large">
          Điểm danh
        </Button>
      </S.Head>
      {isFetching ? (
        <S.BodyList>
          {[1, 2, 3]?.map((item: any) => (
            <Flex gap={40} key={item}>
              <Flex
                vertical
                gap={8}
                align="flex-start"
                style={{
                  width: 200,
                }}
              >
                <Skeleton paragraph={{ rows: 2 }} />
              </Flex>
              <S.CardWrapper>
                <Flex
                  gap={20}
                  vertical
                  style={{
                    padding: 20,
                    backgroundColor: "white",
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4,
                  }}
                  flex={1}
                >
                  <Skeleton paragraph={{ rows: 3 }} />
                </Flex>
                <Skeleton.Image
                  active
                  style={{
                    width: 300,
                    height: 300,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                />
              </S.CardWrapper>
            </Flex>
          ))}
        </S.BodyList>
      ) : (
        <S.BodyList>
          {result?.map((item: any) => (
            <EventItem key={item?._id} data={item} refetch={refetch} />
          ))}
        </S.BodyList>
      )}
      <AttendanceModal open={modal.visible} onClose={modal.close} />
    </S.PageWrapper>
  );
}

export default AllEventList;
