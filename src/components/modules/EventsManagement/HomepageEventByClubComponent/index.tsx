import { Image, List } from "antd";
import { ClockCircleOutlined, BankOutlined } from "@ant-design/icons";
import moment from "moment";

interface Event {
  _id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  type: string;
  bannerUrl: string;
  isApproved: boolean;
  location: {
    _id: string;
    name: string;
    building: string;
  };
  status: string;
}

function HomepageEventByClubComponent({ event }: { event: Event[] }) {
  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 5,
      }}
      dataSource={event}
      renderItem={(item: Event) => (
        <List.Item
          key={item?._id}
          extra={
            <Image
              width={272}
              height={(272 * 9) / 16}
              alt="Event banner"
              src={item?.bannerUrl}
              style={{ objectFit: "cover" }}
              fallback={"/images/no-data.png"}
            />
          }
        >
          <List.Item.Meta title={item?.name} />
          <ClockCircleOutlined />{" "}
          {`${moment(item?.startTime).format("DD/MM/YYYY hh:mm")}`} -{" "}
          {`${moment(item?.endTime).format("DD/MM/YYYY hh:mm")}`}
          <br></br>
          <BankOutlined /> {item?.location?.name} - {item?.location?.building}
        </List.Item>
      )}
    />
  );
}

export default HomepageEventByClubComponent;
