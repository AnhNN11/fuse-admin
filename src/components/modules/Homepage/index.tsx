"use client";
import {
  Button,
  Carousel,
  Col,
  Divider,
  FloatButton,
  Image,
  Modal,
  Input,
  Row,
  message,
} from "antd";
import * as S from "./styles";
import { Typography } from "antd";
import {
  CommentOutlined,
  CustomerServiceOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useRouter } from "next-nprogress-bar";

const { Text, Link, Title } = Typography;

function HomepageModule() {
  const router = useRouter();

  return (
    <>
      <Carousel arrows autoplay>
        <div>
          <Image
            alt=""
            preview={false}
            src="https://university.fpt.edu.vn/da-nang/wp-content/uploads/2024/08/Banner-Website-thang-8_2024-scaled.jpg"
          />
        </div>
        <div>
          <Image
            alt=""
            preview={false}
            src="https://university.fpt.edu.vn/da-nang/wp-content/uploads/2023/10/Website-Cover-FB-tha%CC%81ng-11-2023-.jpg"
          />
        </div>
      </Carousel>
      <S.PageWrapper>
        <Row gutter={30}>
          <Col span={12}>
            <Title>TRẢI NGHIỆM THÀNH CÔNG</Title>
            <Divider />
            <Text style={{ marginTop: 10 }}>
              Để việc học tập không nhàm chán, Đại học FPT luôn tạo điều kiện
              tốt nhất có thể để sinh viên phát triển năng lực cá nhân. Các câu
              lạc bộ tại Đại học FPT chính là ngôi nhà thứ hai, nơi mà sinh viên
              có thể nuôi dưỡng đam mê và giải tỏa căng thẳng sau những giờ học
              mệt mỏi. Tùy vào sở thích và mong muốn phát triển bản thân, sinh
              viên khi theo học tại Đại học FPT sẽ có cơ hội lựa chọn CLB mà
              mình yêu thích. Cùng chúng mình khám phá vũ trụ các câu lạc bộ tại
              Đại học FPT nhé!
            </Text>
            <div style={{ marginTop: 30 }}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => router.push(`/clubs/`)}
              >
                Khám phá câu lạc bộ
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <S.Image src="https://university.fpt.edu.vn/da-nang/wp-content/uploads/2023/01/trai-nghiem1.jpg" />
          </Col>
        </Row>
      </S.PageWrapper>
    </>
  );
}

export default HomepageModule;
