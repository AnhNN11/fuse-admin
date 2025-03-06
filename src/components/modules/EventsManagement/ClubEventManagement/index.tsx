"use client";

import { useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Flex,
  Input,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Table,
  TableProps,
  Tooltip,
  message,
} from "antd";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import {
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  QrcodeOutlined,
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
import QRCodeModal from "@/components/core/common/QRCodeModal";

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

function ClubEventManagement() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { currentClub } = useAppSelector((state: RootState) => state.auth);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const status = searchParams.get("status") || "";
  const location = searchParams.get("location") || "";
  const date: any = searchParams.get("date") || "";

  const dateFormatted = date ? JSON.parse(date) : null;

  const [eventId, setEventId] = useState<string>("");

  const { t } = useTranslation(params?.locale as string, "eventsManagement");

  const eventDetailDrawer = useModal();
  const createEventDrawer = useModal();
  const attendenceModal = useModal();

  const [deleteEvent] = useDeleteEventMutation();

  const { result, isFetching, total, refetch } = useGetAllEventsForManagerQuery(
    {
      page: page,
      limit: limit,
      search: search,
      filters: JSON.stringify({
        status,
        // club: currentClub?._id,
        location: location,
        type: type,
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

  const { locationList } = useGetAllLoactionsQuery(undefined, {
    selectFromResult: ({ data }) => {
      return {
        locationList: data?.result?.map((item: any) => ({
          label: item.name,
          value: item._id,
        })),
      };
    },
  });

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id).unwrap();
      message.success("Xoá sự kiện thành công");
      refetch();
    } catch (error) {
      message.error("Rất tiếc, đã xảy ra lỗi khi xoá sự kiện");
    }
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: t("columns.order"),
      dataIndex: "",
      key: "",
      width: 20,
      render: (text, _, index) => (
        <Typography.Text>{limit * (page - 1) + index + 1}</Typography.Text>
      ),
    },
    {
      title: t("columns.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("columns.location"),
      dataIndex: "location",
      key: "location",
      render: (_, record) => (
        <Typography.Text>{record?.location?.name}</Typography.Text>
      ),
    },
    {
      title: t("columns.date"),
      dataIndex: "date",
      key: "date",
      render: (_, record) => (
        <Typography.Text>
          {`${moment(record?.createdAt).format("L")}`}
        </Typography.Text>
      ),
    },
    {
      title: t("columns.type"),
      dataIndex: "type",
      key: "type",
      render: (_, record) => <EventTypeTag type={record?.type} />,
    },
    {
      title: t("columns.status"),
      dataIndex: "stauts",
      key: "status",
      render: (_, record) => <StatusTag status={record?.status} />,
    },
    {
      title: t("columns.actions"),
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Flex gap={8} align="center" justify="center">
          <Tooltip title="Xem chi tiết">
            <Button
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => {
                setEventId(record?._id);
                eventDetailDrawer.open();
              }}
            />
          </Tooltip>
          <Tooltip title="Mã điểm danh">
            <Button
              shape="circle"
              icon={<QrcodeOutlined />}
              onClick={() => {
                setEventId(record?._id);
                attendenceModal.open();
              }}
            />
          </Tooltip>
          <Tooltip title="Tải kế hoạch">
            <Button shape="circle" icon={<DownloadOutlined />} />
          </Tooltip>
          <Tooltip title="Xoá sự kiện">
            <Popconfirm
              title="Bạn có chắc chắn muốn xoá sự kiện này không?"
              description="Sự kiện sẽ không thể khôi phục sau khi xoá."
              onConfirm={() => handleDeleteEvent(record._id)}
              okText="Xác nhận"
              cancelText="Huỷ"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Flex>
      ),
    },
  ];

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
        <Typography.Title level={2}>{t("title")}</Typography.Title>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => createEventDrawer.open()}
          size="large"
        >
          {t("create")}
        </Button>
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
      <Row gutter={16}>
        <Col span={6}>
          <Typography.Title level={5}>{t("filters.location")}</Typography.Title>
          <Select
            placeholder={t("filters.location")}
            allowClear
            onChange={handleFilterLocation}
            options={locationList?.map((item: any) => ({
              label: item.label,
              value: item.value,
            }))}
            defaultValue={location || undefined}
          />
        </Col>
        <Col span={6}>
          <Typography.Title level={5}>{t("filters.date")}</Typography.Title>
          <DatePicker.RangePicker
            showTime
            onChange={handleFilterDate}
            defaultValue={
              dateFormatted
                ? [dayjs(dateFormatted?.$gte), dayjs(dateFormatted?.$lte)]
                : [null, null]
            }
          />
        </Col>
        <Col span={6}>
          <Typography.Title level={5}>{t("filters.type")}</Typography.Title>
          <Select
            placeholder={t("filters.type")}
            allowClear
            onChange={handleFilterType}
            options={[
              { label: t("filters.internal"), value: "INTERNAL" },
              { label: t("filters.public"), value: "PUBLIC" },
            ]}
            defaultValue={type || undefined}
          />
        </Col>
        <Col span={6}>
          <Typography.Title level={5}>{t("filters.status")}</Typography.Title>
          <Select
            placeholder={t("filters.status")}
            allowClear
            onChange={handleFilterStatus}
            options={[
              { label: t("filters.pending"), value: "PENDING" },
              { label: t("filters.approved"), value: "APPROVED" },
              { label: t("filters.rejected"), value: "REJECTED" },
            ]}
            defaultValue={status || undefined}
          />
        </Col>
      </Row>
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
      <DrawerEventDetail
        eventId={eventId}
        open={eventDetailDrawer.visible}
        onClose={eventDetailDrawer.close}
        refetch={refetch}
        type="EDIT"
        clubId={currentClub?._id}
      />
      <DrawerEventDetail
        open={createEventDrawer.visible}
        onClose={createEventDrawer.close}
        type="CREATE"
        refetch={refetch}
        clubId={currentClub?._id}
      />
      <QRCodeModal
        open={attendenceModal.visible}
        onClose={attendenceModal.close}
        eventId={eventId}
      />
    </S.PageWrapper>
  );
}

export default ClubEventManagement;
