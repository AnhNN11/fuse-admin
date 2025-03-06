"use client";

import {
  Button,
  Col,
  Flex,
  Input,
  Pagination,
  Row,
  Select,
  Table,
  TableProps,
  Tooltip,
} from "antd";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import _ from "lodash";
import moment from "moment";
import Image from "next/image";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import Typography from "@/components/core/common/Typography";
import * as S from "./styles";
import Link from "next/link";

import { useTranslation } from "@/app/i18n/client";
import { createQueryString } from "@/utils/queryString";
import { useGetAllEngagementWithPaginationQuery } from "@/store/queries/engagementManagement";
import { useGetAllDepartmentByClubQuery } from "@/store/queries/departmentManagement";

import StatusEngagementTag from "@/components/core/common/StatusEngagementTag";
import { useGetAllClubWithoutPaginationQuery } from "@/store/queries/clubManagement";

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
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  entranceInterview: {
    status:
      | "NEW"
      | "SENT_INTERVIEW"
      | "INTERVIEWED"
      | "APPROVED"
      | "REJECTED"
      | "CANCELED";
  };
  status: "NEW" | "REJECTED" | "MEMBER" | "DROP_OUT";
}

interface ClubDataType {
  key: string;
  _id: string;
  name: string;
  subname: string;
}

interface DepartmentDataType {
  key: string;
  _id: string;
  name: string;
}

function AdminHumanResourcesModule() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const clubId = searchParams.get("id") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const department = searchParams.get("department") || "";
  const status = searchParams.get("status") || "";

  const { t } = useTranslation(params?.locale as string, "adminHumanResources");

  const statusOptions = [
    { value: "NEW", label: t("statusFilter.NEW") },
    { value: "REJECTED", label: t("statusFilter.REJECTED") },
    { value: "MEMBER", label: t("statusFilter.MEMBER") },
    { value: "DROP_OUT", label: t("statusFilter.DROP_OUT") },
  ];

  const { result, isFetching, total } = useGetAllEngagementWithPaginationQuery(
    {
      id: clubId,
      page: page,
      limit: limit,
      search: search,
      filters: JSON.stringify({
        status,
        department,
      }),
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
      skip: !clubId,
    }
  );

  const { result: clubListResult, isFetching: clubListIsFetching } =
    useGetAllClubWithoutPaginationQuery(
      {},
      {
        selectFromResult: ({ data, isFetching }) => {
          const newClubData = data?.result?.map((club: ClubDataType) => ({
            label: `${club.subname} - ${club.name}`,
            value: club._id,
          }));
          return {
            result: newClubData ?? [],
            isFetching,
          };
        },
      }
    );

  const { result: departmentResult, isFetching: departmentIsFetching } =
    useGetAllDepartmentByClubQuery(
      {
        id: clubId,
      },
      {
        selectFromResult: ({ data, isFetching }) => {
          const newClubDepartmentData = data?.result?.map(
            (department: DepartmentDataType) => ({
              label: department.name,
              value: department._id,
            })
          );
          return {
            result: newClubDepartmentData ?? [],
            isFetching,
          };
        },
        skip: !clubId,
      }
    );

  const columns: TableProps<DataType>["columns"] = [
    {
      title: t("order"),
      dataIndex: "",
      key: "",
      width: 20,
      render: (text, _, index) => (
        <Typography.Text>{limit * (page - 1) + index + 1}</Typography.Text>
      ),
    },
    {
      title: t("name"),
      dataIndex: "user",
      key: "user",
      render: (_, record) => {
        return (
          <Flex align="center" gap={8}>
            {record?.user?.avatarUrl && (
              <Image
                alt=""
                src={record?.user?.avatarUrl}
                width={16}
                height={16}
                style={{ borderRadius: "50%" }}
              />
            )}

            <Typography.Text ellipsis style={{ width: 100 }}>
              {record?.user?.firstname + " " + record?.user?.lastname ||
                "--------"}
            </Typography.Text>
          </Flex>
        );
      },
    },
    {
      title: t("username"),
      dataIndex: "username",
      key: "username",
      render: (_, record) => (
        <Typography.Text>{record?.user?.username}</Typography.Text>
      ),
    },
    {
      title: t("department"),
      dataIndex: "department",
      key: "department",
      render: (_, record) => (
        <Typography.Text>{record?.department?.name}</Typography.Text>
      ),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (_, record) => <StatusEngagementTag status={record?.status} />,
    },
    {
      title: t("updatedAt"),
      dataIndex: "date",
      key: "date",
      render: (_, record) => (
        <Typography.Text>
          {`${moment(record?.updatedAt).format("DD/MM/YYYY HH:mm ")}`}
        </Typography.Text>
      ),
    },
    {
      title: t("action"),
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Flex gap={8} align="center" justify="center">
          <Tooltip title="Xem chi tiết">
            <Link href={`user-management/${record?.user?._id}`}>
              <Button shape="circle" icon={<EyeOutlined />} />
            </Link>
          </Tooltip>
        </Flex>
      ),
    },
  ];

  const handleSearch = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(createQueryString("search", `${e?.target?.value}`));
  }, 300);

  const handleFilterDepartment = _.debounce((e: string) => {
    router.push(createQueryString("department", `${e ?? ""}`));
  }, 300);

  const handleFilterClub = _.debounce((e: string) => {
    if (!e) {
      router.push("/admin/human-resources");
      router.refresh();
      return;
    }
    router.push(createQueryString("id", `${e ?? ""}`));
  }, 300);

  const handleFilterStatus = _.debounce((e: string) => {
    router.push(createQueryString("status", `${e ?? ""}`));
  }, 300);

  return (
    <S.PageWrapper>
      <S.Head>
        <Typography.Title level={2}>{t("title")}</Typography.Title>
      </S.Head>
      <S.FilterWrapper>
        <Row gutter={16}>
          <Col span={6}>
            <Typography.Title level={5}>{t("club")}</Typography.Title>
            <Select
              showSearch
              placeholder={t("club")}
              allowClear
              onChange={handleFilterClub}
              defaultValue={clubId || undefined}
              options={clubListResult}
              filterOption={(input, option: any) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Col>
        </Row>
      </S.FilterWrapper>
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
          <Col span={6}>
            <Typography.Title level={5}>{t("department")}</Typography.Title>
            <Select
              placeholder={t("department")}
              allowClear
              onChange={handleFilterDepartment}
              defaultValue={department || undefined}
              options={departmentResult}
            />
          </Col>
          <Col span={6}>
            <Typography.Title level={5}>{t("status")}</Typography.Title>
            <Select
              placeholder={t("status")}
              allowClear
              onChange={handleFilterStatus}
              options={statusOptions}
            />
          </Col>
        </Row>
      </S.FilterWrapper>
      {clubId && (
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
      )}
    </S.PageWrapper>
  );
}

export default AdminHumanResourcesModule;
