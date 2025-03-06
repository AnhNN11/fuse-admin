"use client";

import { Button, ButtonProps, Card, Col, Flex, Image, Popover, Row, Space, Table, Typography } from "antd";
import { useParams } from "next/navigation";
import { RightOutlined, QuestionOutlined, ProjectOutlined } from "@ant-design/icons";
import { useTranslation } from "@/app/i18n/client";
import CountUp from "react-countup";
import * as S from "./styles";
import { CSSProperties } from "styled-components";
import CategoriesChart from "./Admin/CategoriesChart;";
import VisitorsChartCard from "./Admin/Visitory";
import { useGetNumberMemberQuery } from "@/store/queries/dashboardManagement";
const cardStyles: CSSProperties = {
	height: "100%",
};
const POPOVER_BUTTON_PROPS: ButtonProps = {
	type: "text",
};

function DashboardModule() {
	const params = useParams();
	const { t } = useTranslation(params?.locale as string, "dashboard");

	const dataSource = [
		{
			key: "1",
			top: "1",
			name: "FU-DEVER",
			activityPoint: "12",
		},
		{
			key: "2",
			top: "2",

			name: "FUM",
			activityPoint: "12",
		},
		{
			key: "3",
			top: "3",

			name: "FVC",
			activityPoint: "12",
		},
	];

	const columns = [
		{
			title: "Top",
			dataIndex: "top",
			key: "top",
		},
		{
			title: "Club Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Activity Point",
			dataIndex: "activityPoint",
			key: "activityPoint",
		},
	];
	return (
		<S.PageWrapper>
			<S.Head>
				<Typography.Title level={2}>{t("title")}</Typography.Title>
			</S.Head>
			<Col>
				<Col span={24} style={{ marginBottom: "20px" }}>
					<VisitorsChartCard />
				</Col>
				<Row gutter={16}>
					<Col span={12}>
						<Row gutter={16}>
							<Col span={24}>
								<Space direction="vertical" size="large">
									<Card>
										<Flex justify="space-between" align="center" gap="middle">
											<Flex vertical gap="large" align="flex-start">
												<Typography.Title level={4} style={{ margin: 0 }}>
													You have <CountUp end={2} /> projects to finish this week
												</Typography.Title>
												<Typography.Text>
													You have already completed 68% of your monthly target. Keep going to
													achieve your goal.
												</Typography.Text>
												<Button type="primary" size="middle">
													Get started <RightOutlined />
												</Button>
											</Flex>
											<Image
												alt=''
												src="https://mnhoangoanh.chauduc-brvt.edu.vn/upload/53399/20221010/0000000732-vui-ve-tre-em-mam-non-tai-hinh-png-214_399b2.png"
												height={180}
												preview={false}
												style={{ objectFit: "cover" }}
											/>
										</Flex>
									</Card>
									<Col xs={24}>
										<Flex align="center" gap="middle">
											<Card>
												<Row gutter={20}>
													<Col>
														<ProjectOutlined
															style={{
																fontSize: "40px",
																transform: "translateY(50%)",
															}}
														/>
													</Col>
													<Col>
														<Flex vertical gap="middle">
															<Typography.Title style={{ margin: 0 }}>
																<CountUp end={2} />
															</Typography.Title>
															<Typography.Text>Active Projects</Typography.Text>
														</Flex>
													</Col>
												</Row>
											</Card>
											<Card>
												<Row gutter={20}>
													<Col>
														<ProjectOutlined
															style={{
																fontSize: "40px",
																transform: "translateY(50%)",
															}}
														/>
													</Col>
													<Col>
														<Flex vertical gap="middle">
															<Typography.Title style={{ margin: 0 }}>
																<CountUp end={2} />
															</Typography.Title>
															<Typography.Text>Active Projects</Typography.Text>
														</Flex>
													</Col>
												</Row>
											</Card>
											<Card>
												<Row gutter={20}>
													<Col>
														<ProjectOutlined
															style={{
																fontSize: "40px",
																transform: "translateY(50%)",
															}}
														/>
													</Col>
													<Col>
														<Flex vertical gap="middle">
															<Typography.Title style={{ margin: 0 }}>
																<CountUp end={2} />
															</Typography.Title>
															<Typography.Text>Active Projects</Typography.Text>
														</Flex>
													</Col>
												</Row>
											</Card>
										</Flex>
									</Col>
								</Space>
							</Col>
						</Row>
					</Col>

					<Col span={12}>
						<Card
							title="Number of members"
							extra={
								<Popover content="Sales per categories" title="Categories sales">
									<Button icon={<QuestionOutlined />} {...POPOVER_BUTTON_PROPS} />
								</Popover>
							}
							style={cardStyles}
						>
							<CategoriesChart />
						</Card>
					</Col>
				</Row>
				<Col span={24} style={{ marginBottom: "20px" }}></Col>

				<Col span={24} style={{ marginBottom: "20px" }}>
					<Table dataSource={dataSource} columns={columns} />;
				</Col>
			</Col>
		</S.PageWrapper>
	);
}

export default DashboardModule;
