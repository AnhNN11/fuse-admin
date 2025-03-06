import {
  Button,
  Col,
  Divider,
  Flex,
  Modal,
  Row,
  Typography,
  message,
} from "antd";
import moment from "moment";
import Image from "next/image";
import { useParams } from "next/navigation";

import EventTypeTag from "@/components/core/common/EventTypeTag";

import { getFullLocation } from "@/utils/getFullLocation";
import { useTranslation } from "@/app/i18n/client";
import useModal from "@/hooks/useModal";
import { useAppSelector } from "@/hooks/redux-toolkit";
import { useRegisterEventMutation } from "@/store/queries/eventsMangement";

import * as S from "./styles";
import { useRouter } from "next-nprogress-bar";

function EventItem({ data, refetch }: any) {
  const params = useParams();
  const router = useRouter();

  const { t } = useTranslation(params?.locale as string, "eventsManagement");

  const { userInfo } = useAppSelector((state) => state.auth);

  const modal = useModal();

  const [registerEvent, { isLoading }] = useRegisterEventMutation();

  const handleRegister = async () => {
    try {
      const res = await registerEvent(data?._id).unwrap();
      message.success("Register event success");
      modal.close();
      refetch();
    } catch (error) {
      message.error("Register event fail");
    }
  };
  return (
    <Flex gap={40}>
      <Flex
        vertical
        gap={8}
        align="flex-start"
        style={{
          width: 200,
        }}
      >
        <EventTypeTag type={data?.type} />
        <Typography.Title level={4}>
          {moment(data?.startTime)?.format("DD/MM/YYYY")}
        </Typography.Title>
        <Typography.Text>
          {moment(data?.startTime)?.format("dddd").toUpperCase()}
        </Typography.Text>
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
          <Typography.Title level={5}>
            {`${moment(data?.startTime)?.format("LT")} - ${moment(
              data?.endTime
            )?.format("LT")}`}
          </Typography.Title>
          <Flex flex={1} justify="flex-start" align="flex-start">
            <Typography.Title level={4}>{data?.name}</Typography.Title>
          </Flex>
          <Flex vertical gap={8}>
            <Flex gap={8}>
              <Image
                src={data?.club?.avatarUrl || "/images/logo/fpt.png"}
                alt=""
                width={24}
                height={24}
                style={{
                  borderRadius: "50%",
                }}
              />
              <Typography.Text>
                {data?.club?.subname || "FPT University"}
              </Typography.Text>
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

              <Typography.Text>
                {getFullLocation(data?.location)}
              </Typography.Text>
            </Flex>
          </Flex>
          <Row gutter={20}>
            <Col span={12}>
              <Button
                size="large"
                type="default"
                style={{
                  width: "100%",
                }}
                onClick={() => router.push(`/events/${data?._id}`)}
              >
                {t("eventList.view")}
              </Button>
            </Col>
            <Col span={12}>
              <Button
                size="large"
                type="primary"
                style={{
                  width: "100%",
                }}
                onClick={() =>
                  userInfo?.email
                    ? modal.open()
                    : message.error("Please login to register")
                }
                disabled={data?.isRegistered}
              >
                {data?.isRegistered
                  ? t("eventList.registered")
                  : t("eventList.register")}
              </Button>
            </Col>
          </Row>
        </Flex>
        <Image
          src={data?.bannerUrl}
          alt=""
          width={300}
          height={300}
          style={{
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
            objectFit: "cover",
          }}
        />
      </S.CardWrapper>
      <Modal
        open={modal.visible}
        onCancel={modal.close}
        footer={[]}
        width={900}
      >
        <S.ModalContent>
          <Flex vertical gap={8} align="center">
            <Typography.Title level={4}>
              {t("registration.title")}
            </Typography.Title>
            <Typography.Text
              style={{
                marginBottom: 20,
              }}
            >
              {t("registration.subTitle")}
            </Typography.Text>
          </Flex>
          <Typography.Title
            level={5}
            style={{
              marginBottom: 8,
            }}
          >
            {t("registration.eventInfo")}
          </Typography.Title>
          <Flex vertical>
            <Flex>
              <Typography.Text
                style={{
                  width: 160,
                }}
              >
                {t("registration.eventName")}:
              </Typography.Text>
              <Typography.Text
                style={{
                  flex: 1,
                }}
              >
                {data?.name}
              </Typography.Text>
            </Flex>
            <Flex>
              <Typography.Text
                style={{
                  width: 160,
                }}
              >
                {t("registration.eventTime")}:
              </Typography.Text>
              <Typography.Text
                style={{
                  flex: 1,
                }}
              >
                {`${moment(data?.startTime)?.format("LT")} - ${moment(
                  data?.endTime
                )?.format("LT")}`}
              </Typography.Text>
            </Flex>
            <Flex>
              <Typography.Text
                style={{
                  width: 160,
                }}
              >
                {t("registration.eventLocation")}:
              </Typography.Text>
              <Typography.Text
                style={{
                  flex: 1,
                }}
              >
                {getFullLocation(data?.location)}
              </Typography.Text>
            </Flex>
          </Flex>
          <Divider />
          <Typography.Title
            level={5}
            style={{
              marginBottom: 8,
            }}
          >
            {t("registration.userInfo")}
          </Typography.Title>
          <Flex
            vertical
            style={{
              marginBottom: 20,
            }}
          >
            <Flex>
              <Typography.Text
                style={{
                  width: 160,
                }}
              >
                {t("registration.fullName")}:
              </Typography.Text>
              <Typography.Text
                style={{
                  flex: 1,
                }}
              >
                {`${userInfo?.firstname} ${userInfo?.lastname}`}
              </Typography.Text>
            </Flex>
            <Flex>
              <Typography.Text
                style={{
                  width: 160,
                }}
              >
                {t("registration.email")}:
              </Typography.Text>
              <Typography.Text
                style={{
                  flex: 1,
                }}
              >
                {userInfo?.email}
              </Typography.Text>
            </Flex>
            <Flex>
              <Typography.Text
                style={{
                  width: 160,
                }}
              >
                {t("registration.phone")}:
              </Typography.Text>
              <Typography.Text
                style={{
                  flex: 1,
                }}
              >
                {userInfo?.phoneNumber}
              </Typography.Text>
            </Flex>
            <Flex>
              <Typography.Text
                style={{
                  width: 160,
                }}
              >
                {t("registration.studentCode")}:
              </Typography.Text>
              <Typography.Text
                style={{
                  flex: 1,
                }}
              >
                {userInfo?.username}
              </Typography.Text>
            </Flex>
          </Flex>
          <Flex gap={8} justify="center">
            <Button type="default" onClick={modal.close}>
              {t("eventList.cancel")}
            </Button>

            <Button type="primary" onClick={handleRegister} loading={isLoading}>
              {t("eventList.register")}
            </Button>
          </Flex>
        </S.ModalContent>
      </Modal>
    </Flex>
  );
}

export default EventItem;
