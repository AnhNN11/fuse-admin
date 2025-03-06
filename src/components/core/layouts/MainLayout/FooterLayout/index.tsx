"use client";

import { Col, Row, Space, Typography } from "antd";
import Divider from "@/components/core/common/Divider";
import { Footer } from "antd/es/layout/layout";

import Link from "next/link";

const { Title, Text } = Typography;

function FooterLayoutComponent() {
  return (
    <Footer>
      <Row justify="space-around" style={{ marginBottom: "16px" }}>
        <Col span={4} xs={24} md={4}>
          <Space direction="vertical">
            <Title level={4}>Hà Nội</Title>
            <Text>
              <Text strong>Điện thoại: </Text>(024) 7300 5588
            </Text>
            <Text>
              <Text strong>Website: </Text>
              <Link href="https://university.fpt.edu.vn/" target="_blank">
                university.fpt.edu.vn
              </Link>
            </Text>
          </Space>
        </Col>
        <Col span={4} xs={24} md={4}>
          <Space direction="vertical">
            <Title level={4}>TP. Hồ Chí Minh</Title>
            <Text>
              <Text strong>Điện thoại: </Text>(028) 7300 5588
            </Text>
            <Text>
              <Text strong>Website: </Text>
              <Link href="https://university.fpt.edu.vn/" target="_blank">
                university.fpt.edu.vn
              </Link>
            </Text>
          </Space>
        </Col>
        <Col span={4} xs={24} md={4}>
          <Space direction="vertical">
            <Title level={4}>Đà Nẵng</Title>
            <Text>
              <Text strong>Điện thoại: </Text>(0236) 730 0999
            </Text>
            <Text>
              <Text strong>Website: </Text>
              <Link href="https://university.fpt.edu.vn/" target="_blank">
                university.fpt.edu.vn
              </Link>
            </Text>
          </Space>
        </Col>
        <Col span={4} xs={24} md={4}>
          <Space direction="vertical">
            <Title level={4}>Quy Nhơn</Title>
            <Text>
              <Text strong>Điện thoại: </Text>(0256) 730 1866
            </Text>
            <Text>
              <Text strong>Website: </Text>
              <Link href="https://university.fpt.edu.vn/" target="_blank">
                university.fpt.edu.vn
              </Link>
            </Text>
          </Space>
        </Col>
        <Col span={4} xs={24} md={4}>
          <Space direction="vertical">
            <Title level={4}>Cần Thơ</Title>
            <Text>
              <Text strong>Điện thoại: </Text>(0292) 360 1996
            </Text>
            <Text>
              <Text strong>Website: </Text>
              <Link href="https://university.fpt.edu.vn/" target="_blank">
                university.fpt.edu.vn
              </Link>
            </Text>
          </Space>
        </Col>
      </Row>
      <Divider />
      <Row style={{ textAlign: "center", marginTop: "16px" }}>
        <Col span={24}>
          <Text>
            <Text strong>
              ©{new Date().getFullYear()}{" "}
              <Link href="university.fpt.edu.vn/" target="_blank">
                NextTeam
              </Link>
            </Text>
          </Text>
        </Col>
      </Row>
    </Footer>
  );
}
export default FooterLayoutComponent;
