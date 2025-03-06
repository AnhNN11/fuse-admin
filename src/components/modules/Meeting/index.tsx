"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Flex,
  Input,
  Modal,
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
  PlusCircleOutlined,
  DeleteOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import moment from "moment";
import dayjs from "dayjs";

import { createQueryString } from "@/utils/queryString";
import useModal from "@/hooks/useModal";
import { RootState } from "@/store";
import { useAppSelector } from "@/hooks/redux-toolkit";
import {
  ChatToggle,
  ConnectionState,
  ParticipantAudioTile,
  StartAudio,
} from "@livekit/components-react";
import Typography from "@/components/core/common/Typography";

import * as S from "./styles";
import DrawerMeetingDetail from "@/components/core/common/DrawerMeetingDetail/Main";
import {
  useDeleteMeetingMutation,
  useGetAllMeetingQuery,
  useGetMeetingByIdQuery,
  useUpdateMeetingMutation,
} from "@/store/queries/meetingManagement";
import {
  Chat,
  ControlBar,
  DisconnectButton,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  PreJoin,
  RoomAudioRenderer,
  TrackToggle,
  useTracks,
  VideoConference,
  VideoTrack,
  VoiceAssistantControlBar,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";
import { useGetAllUsersQuery } from "@/store/queries/usersMangement";

interface DataType {
  key: string;
  _id: string;
  title: string;
  description: string;
  participants: { user: string }[];
  date: any[];
  endTime: string;
  startTime: string;
}

function Meeting() {
  const [token, setToken] = useState(""); // Token

  const router = useRouter();
  const searchParams = useSearchParams();

  const { currentClub, userInfo } = useAppSelector(
    (state: RootState) => state.auth
  );

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const date: any = searchParams.get("date") || "";
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [meetingId, setMeetingId] = useState<string>("");
  const [meetingData, setMeetingData] = useState<any>(null);

  const { data, isFetching: isFetchingMeetingData } = useGetMeetingByIdQuery(
    meetingId,
    {
      selectFromResult: ({ data, isFetching }) => ({
        data: data,
        isFetching,
      }),
      skip: !meetingId,
    }
  );

  const showModal = (record: DataType) => {
    setMeetingId(record._id);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setMeetingId("");
    setMeetingData(null);
  };

  const dateFormatted = date ? JSON.parse(date) : null;

  const createEventDrawer = useModal();

  const [deleteEvent] = useDeleteMeetingMutation();
  const [editEvent] = useUpdateMeetingMutation();
  const { result, isFetching, total, refetch } = useGetAllMeetingQuery(
    {
      page: page,
      limit: limit,
      search: search,
      filters: JSON.stringify({
        status,
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
        console.log(data);
        return {
          result: data,
          isFetching,
          total: data?.result?.totalCount,
        };
      },
    }
  );

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id).unwrap();
      message.success("Cập nhập cuộc họp thành công");
      refetch();
    } catch (error) {
      message.error("Rất tiếc, đã xảy ra lỗi khi Cập nhập cuộc họp");
    }
  };
  const [isInMeeting, setIsInMeeting] = useState(false);
  const handleJoinMeeting = async (roomId: string) => {
    try {
      const resp = await fetch(
        `/api/get-participant-token?room=${roomId}&username=${userInfo.email}`
      );
      const respData = await resp.json();
      setToken(respData.token);
      setIsInMeeting(true);
    } catch (e) {
      message.error("Đã xảy ra lỗi khi tham gia phòng họp.");
      console.error(e);
    }
  };
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    startTime: null as any,
    endTime: null as any,
    participants: [],
    description: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        id: data?._id,
        title: data?.title || "",
        startTime: data?.startTime ? dayjs(data?.startTime) : null,
        endTime: data?.endTime ? dayjs(data?.endTime) : null,
        participants: data?.participants?.map((item: any) => item.user) || [],
        description: data?.description || "",
      });
    }
  }, [data]);
  const { userList } = useGetAllUsersQuery(
    { page: page, page_size: 10, search: search },
    {
      selectFromResult: ({ data }) => {
        return {
          userList: data?.result?.map((item: any) => ({
            label: item.email,
            value: item._id,
          })),
        };
      },
    }
  );
  const handleChange = (key: any, value: any) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleEditMeeting = async () => {
    try {
      const transformedData = {
        ...formData,
        participants: formData.participants.map((id) => ({ user: id })),
      };
      console.log("Form", transformedData);
      await editEvent(transformedData).unwrap();
      message.success("Cập nhập cuộc họp thành công");
      refetch();
    } catch (error) {
      message.error("Rất tiếc, đã xảy ra lỗi khi cập nhập cuộc họp");
    }
  };
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "STT",
      dataIndex: "",
      key: "",
      width: 20,
      render: (text, _, index) => (
        <Typography.Text>{limit * (page - 1) + index + 1}</Typography.Text>
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Ngày diễn ra",
      dataIndex: "startTime",
      key: "startTime",
      render: (text) => {
        const date = dayjs(text);
        return date.isValid()
          ? date.format("HH:mm DD/MM/YYYY")
          : "Invalid Date";
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endTime",
      key: "endTime",
      render: (text) => {
        const date = dayjs(text);
        return date.isValid()
          ? date.format("HH:mm DD/MM/YYYY")
          : "Invalid Date";
      },
    },
    {
      title: "Tham gia",
      dataIndex: "meetingLink",
      key: "meetingLink",
      render: (meetingLink, record) => {
        // Calculate whether the current time is past the end date
        const isPastEndDate = dayjs().isAfter(dayjs(record.endTime));

        return (
          <Flex gap={8} align="center" justify="center">
            <Button
              type="primary"
              icon={<QrcodeOutlined />}
              onClick={() => handleJoinMeeting(meetingLink)}
              disabled={isPastEndDate} // Disable if past end date
            >
              Tham gia
            </Button>
          </Flex>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Flex gap={8} align="center" justify="center">
          <Tooltip title="Xem chi tiết">
            <Button
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Modal
            title="Chỉnh sửa cuộc họp"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={[
              <Button key="cancel" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button
                key="save"
                type="primary"
                onClick={() => handleEditMeeting()}
              >
                Edit
              </Button>,
            ]}
          >
            <div style={{ padding: "16px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Title:
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  style={{ marginBottom: "16px" }}
                />

                <label style={{ display: "block", marginBottom: "8px" }}>
                  Start Date:
                </label>
                <DatePicker
                  showTime
                  value={formData.startTime}
                  onChange={(date) => handleChange("startTime", date)}
                  style={{ marginBottom: "16px", width: "100%" }}
                />

                <label style={{ display: "block", marginBottom: "8px" }}>
                  End Date:
                </label>
                <DatePicker
                  showTime
                  value={formData.endTime}
                  onChange={(date) => handleChange("endTime", date)}
                  style={{ marginBottom: "16px", width: "100%" }}
                />

                <label style={{ display: "block", marginBottom: "8px" }}>
                  Người tham dự:
                </label>
                <Select
                  mode="multiple"
                  value={formData.participants}
                  options={userList}
                  onChange={(value) => handleChange("participants", value)}
                  style={{ marginBottom: "16px", width: "100%" }}
                />

                <label style={{ display: "block", marginBottom: "8px" }}>
                  Description:
                </label>
                <Input.TextArea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  style={{ marginBottom: "16px" }}
                />
              </div>
            </div>
          </Modal>
          <Tooltip title="Cập nhập cuộc họp">
            <Popconfirm
              title="Bạn có chắc chắn muốn Cập nhập cuộc họp này không?"
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

  return (
    <S.PageWrapper>
      {!isInMeeting ? (
        <>
          <S.Head>
            <Typography.Title level={2}>Quản lý cuộc họp</Typography.Title>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => createEventDrawer.open()}
              size="large"
            >
              Tạo phòng họp
            </Button>
          </S.Head>
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
        </>
      ) : (
        <S.TableWrapper>
          <S.Head>
            <Typography.Title level={2}>Quản lý cuộc họp</Typography.Title>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => setIsInMeeting(false)}
              size="large"
            >
              Trở về danh sách
            </Button>
          </S.Head>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <LiveKitRoom
              video={true}
              audio={true}
              token={token}
              serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
              data-lk-theme="default"
              style={{ width: "80vw", height: "80vh" }}
            >
              <MyVideoConference />
              <RoomAudioRenderer />
              <ControlBar />
            </LiveKitRoom>
          </div>
        </S.TableWrapper>
      )}

      <DrawerMeetingDetail
        open={createEventDrawer.visible}
        onClose={createEventDrawer.close}
        type="CREATE"
        refetch={refetch}
        clubId={currentClub?._id}
      />
    </S.PageWrapper>
  );
}

export default Meeting;

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}
