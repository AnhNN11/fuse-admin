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
import Image from "next/image";
import dayjs from "dayjs";

import { useTranslation } from "@/app/i18n/client";
import { createQueryString } from "@/utils/queryString";
import {
  useDeleteEventMutation,
  useGetAllEventsForAdminQuery,
  useGetAllEventsQuery,
  useUpdateEventMutation,
} from "@/store/queries/eventsMangement";
import useModal from "@/hooks/useModal";
import { useGetAllClubsQuery } from "@/store/queries/clubsManagement";
import { useGetAllLoactionsQuery } from "@/store/queries/LocationMangement";

import Typography from "@/components/core/common/Typography";
import DrawerEventDetail from "@/components/core/common/DrawerEventDetail/Main";

import * as S from "./styles";
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
}

function AdminEventManagement() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const clubId = searchParams.get("clubId") || "";
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
  const [updateEvent] = useUpdateEventMutation();

  const { result, isFetching, total, refetch } = useGetAllEventsForAdminQuery(
    {
      page: page,
      limit: limit,
      search: search,
      filters: JSON.stringify({
        status,
        club: clubId,
        location: location,
        // type: "PUBLIC",
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

  const { clubs } = useGetAllClubsQuery(
    {
      page: 1,
    },
    {
      selectFromResult: ({ data }) => {
        return {
          clubs: data?.data?.clubs ?? [],
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

  const handleChangeStatus = async (id: string, status: any) => {
    try {
      await updateEvent({
        id,
        body: {
          status,
        },
      }).unwrap();
      refetch();
      message.success("Xoá sự kiện thành công");
    } catch (error) {
      message.error("Rất tiếc, đã xảy ra lỗi!!!");
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
      title: t("columns.club"),
      dataIndex: "club",
      key: "club",
      render: (_, record) => {
        return (
          <Flex align="center" gap={8}>
            {record?.club?.avatarUrl && (
              <Image
                alt=""
                src={record?.club?.avatarUrl}
                width={16}
                height={16}
                style={{ borderRadius: "50%" }}
              />
            )}

            <Typography.Text ellipsis style={{ width: 100 }}>
              {record?.club?.name || "--------"}
            </Typography.Text>
          </Flex>
        );
      },
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
      title: t("columns.status"),
      dataIndex: "stauts",
      key: "status",
      // render: (_, record) => <StatusTag status={record?.status} />,
      render: (_, record) => (
        <S.SelectStatus
          defaultValue={record?.status}
          options={[
            { label: t("filters.pending"), value: "PENDING" },
            { label: t("filters.approved"), value: "APPROVED" },
            { label: t("filters.rejected"), value: "REJECTED" },
          ]}
          $status={record?.status}
          onChange={(value) => handleChangeStatus(record._id, value)}
        />
      ),
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

  const handleFilterClub = _.debounce((e: string) => {
    router.push(createQueryString("clubId", `${e ?? ""}`));
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
          <Typography.Title level={5}>{t("filters.club")}</Typography.Title>
          <Select
            placeholder={t("filters.club")}
            allowClear
            onChange={handleFilterClub}
            defaultValue={clubId || undefined}
            options={clubs?.map((club: any) => ({
              label: (
                <Flex align="center" gap={8}>
                  <Image
                    alt=""
                    width={20}
                    height={20}
                    src={club?.avatarUrl}
                    style={{
                      borderRadius: "50%",
                    }}
                  />
                  <Typography.Text>{club?.name}</Typography.Text>
                </Flex>
              ),
              value: club?._id,
            }))}
          />
        </Col>
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
      />
      <DrawerEventDetail
        open={createEventDrawer.visible}
        onClose={createEventDrawer.close}
        type="CREATE"
        refetch={refetch}
      />
      <QRCodeModal
        open={attendenceModal.visible}
        onClose={attendenceModal.close}
        eventId={eventId}
      />
    </S.PageWrapper>
  );
}

export default AdminEventManagement;
