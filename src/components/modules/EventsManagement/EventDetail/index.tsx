"use client";

import Button from "@/components/core/common/Button";
import EventTypeTag from "@/components/core/common/EventTypeTag";
import Typography from "@/components/core/common/Typography";
import { useAppSelector } from "@/hooks/redux-toolkit";
import useModal from "@/hooks/useModal";
import { useGetEventByIdQuery } from "@/store/queries/eventsMangement";
import { getFullLocation } from "@/utils/getFullLocation";
import { Flex, message } from "antd";
import moment from "moment";
import Image from "next/image";
import { useParams } from "next/navigation";

function EventDEtailModule() {
  const params = useParams();

  const { userInfo } = useAppSelector((state) => state.auth);

  const modal = useModal();

  const { data } = useGetEventByIdQuery(params?.eventId, {
    selectFromResult: ({ data, isFetching }) => {
      return {
        data: data?.result,
        isFetching,
      };
    },
    skip: !params?.eventId,
  });

  console.log("🚀 ~ EventDEtailModule ~ data:", data);
  return (
    <Flex
      vertical
      style={{
        width: 1000,
        margin: "0 auto",
        paddingBottom: 80,
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: "20px 20px 0 0",
        }}
      >
        <Image
          alt=""
          src={data?.bannerUrl}
          width={1920}
          height={1080}
          style={{
            width: 1000,
            height: 450,
            objectFit: "cover",
            margin: "0 auto",
            display: "block",
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        />
        {/* give me a overlay gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)",
            borderRadius: "0 0 20px 20px ",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "20px 40px",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <Typography.Title level={1} $color="white">
            {data?.name}
          </Typography.Title>
          <Button
            size="large"
            type="primary"
            style={{
              width: "300px",
              marginTop: 20,
              background: "#f5f5f5",
              color: "#000",
            }}
            onClick={() =>
              userInfo?.email
                ? modal.open()
                : message.error("Please login to register")
            }
            disabled={data?.isRegistered}
          >
            {data?.isRegistered ? "Đã đăng ký" : "Đăng ký ngay"}
          </Button>
        </div>
      </div>

      <Flex
        justify="space-between"
        style={{
          padding: "20px 0",
        }}
      >
        <Flex vertical gap={20} align="flex-start">
          <EventTypeTag type={data?.type} />
          <Flex gap={8} align="center">
            <Image
              src={data?.club?.avatarUrl || "/images/logo/fpt.png"}
              alt=""
              width={40}
              height={40}
              style={{
                borderRadius: "50%",
              }}
            />
            <Typography.Title level={5}>
              {data?.club?.subname || "FPT University"}
            </Typography.Title>
          </Flex>
        </Flex>
        <Flex vertical gap={20} align="flex-end">
          <Flex gap={8}>
            <Typography.Title level={4}>
              {`${moment(data?.startTime)?.format("LT")} - ${moment(
                data?.endTime
              )?.format("LT")}`}
            </Typography.Title>
            <Typography.Title level={4} $textTransform="capitalize">
              {moment(data?.startTime)?.format("dddd")},
            </Typography.Title>
            <Typography.Title level={4}>
              {moment(data?.startTime)?.format("DD/MM/YYYY")}
            </Typography.Title>
          </Flex>
          <Flex gap={8}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                fill="black"
              />
            </svg>

            <Typography.Text>{getFullLocation(data?.location)}</Typography.Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        vertical
        style={{
          marginTop: 40,
        }}
      >
        <Typography.Title level={2}>Thông tin về sự kiện</Typography.Title>
        <div
          style={{
            marginTop: 40,
          }}
          dangerouslySetInnerHTML={{ __html: data?.description }}
        />
      </Flex>
    </Flex>
  );
}

export default EventDEtailModule;
