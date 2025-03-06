import { Card, CardProps, Col, Row, Tag, Typography } from "antd";
import { Column } from "@ant-design/charts"; // Use Column instead of TinyColumn or TinyArea

import CountUp from "react-countup";

type ChartData = { x: string; y: number }[];

type StatsColumnChartProps = {
  data: ChartData;
  color?: string;
};

const ColumnChart = ({ data, color }: StatsColumnChartProps) => {
  const brandColor = color || "#5B8FF9";
  const config = {
    height: 64,
    autoFit: true,
    data,
    xField: "x",
    yField: "y",
    color: brandColor,
    tooltip: {
      customContent: function (x: any, data: any) {
        return `NO.${x}: ${data[0]?.data?.y.toFixed(2)}`;
      },
    },
  };
  return <Column {...config} />;
};

type Props = {
  title: string;
  value: number | string;
  data: ChartData;
  diff: number;
  asCurrency?: boolean;
} & CardProps;

export const StatsCard = ({
  data,
  diff,
  title,
  value,
  asCurrency,
  ...others
}: Props) => {
  return (
    <Card {...others}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Typography.Text className="text-capitalize m-0">
          {title}
        </Typography.Text>
        <Row>
          <Col span={14}>
            <Typography.Title level={2}>
              {typeof value === "number" ? (
                <>
                  {asCurrency && <span>$</span>}
                  <CountUp end={value} />
                </>
              ) : (
                value
              )}
            </Typography.Title>
          </Col>
          <Col span={10}>
            <ColumnChart data={data} />
          </Col>
        </Row>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tag color={diff < 0 ? "red" : "green"}>{diff}%</Tag>
          <Typography.Text>compared to last month.</Typography.Text>
        </div>
      </div>
    </Card>
  );
};
