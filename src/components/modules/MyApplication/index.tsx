"use client";

import {
  Col,
  Flex,
  Input,
  Pagination,
  Row,
  Select,
  Table,
  TableProps,
} from "antd";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import _ from "lodash";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
import Typography from "@/components/core/common/Typography";
import * as S from "./styles";

import { useTranslation } from "@/app/i18n/client";
import { createQueryString } from "@/utils/queryString";
import { useGetMyApplicationQuery } from "@/store/queries/engagementManagement";

import StatusEngagementTag from "@/components/core/common/StatusEngagementTag";
import StatusInterviewTag from "@/components/core/common/StatusInterviewTag";
import { useAppSelector } from "@/hooks/redux-toolkit";
import { RootState } from "@/store";

interface DataType {
  key: string;
  _id: string;
  club: {
    subname: string;
    name: string;
  };
  department: {
    name: string;
  };
  user: {
    username: string;
    firstname: string;
    lastname: string;
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

function MyApplicationModule() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const { t } = useTranslation(params?.locale as string, "my-application");
  const { userInfo } = useAppSelector((state: RootState) => state.auth);

  const statusOptions = [
    { value: "NEW", label: t("statusFilter.NEW") },
    { value: "REJECTED", label: t("statusFilter.REJECTED") },
    { value: "MEMBER", label: t("statusFilter.MEMBER") },
    { value: "DROP_OUT", label: t("statusFilter.DROP_OUT") },
  ];

  const { result, isFetching, total } = useGetMyApplicationQuery(
    {
      id: userInfo?._id,
      page: page,
      limit: limit,
      search: search,
      filters: JSON.stringify({
        status,
      }),
    },
    {
      selectFromResult: ({ data, isFetching }) => {
        return {
          result: data?.result?.engagements,
          isFetching,
          total: data?.result?.totalCount,
        };
      },
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
      title: t("club"),
      dataIndex: "club",
      key: "club",
      render: (_, record) => {
        return <Typography.Text>{record?.club?.subname}</Typography.Text>;
      },
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
      title: t("statusInteview"),
      dataIndex: "statusInteview",
      key: "statusInteview",
      render: (_, record) => (
        <StatusInterviewTag status={record?.entranceInterview?.status} />
      ),
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
  ];

  const handleSearch = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(createQueryString("search", `${e?.target?.value}`));
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
            <Typography.Title level={5}>{t("search")}</Typography.Title>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              onChange={handleSearch}
              defaultValue={search}
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

export default MyApplicationModule;
