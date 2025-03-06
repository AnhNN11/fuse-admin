"use client";

import {
  Alert,
  Button,
  ButtonProps,
  Card,
  Col,
  Flex,
  Image,
  Popover,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import {
  RightOutlined,
  QuestionOutlined,
  ProjectOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useTranslation } from "@/app/i18n/client";
import CountUp from "react-countup";
import * as S from "./styles";
import { CSSProperties } from "styled-components";
import { StatsCard } from "./Manager/chart";

const cardStyles: CSSProperties = {
  height: "100%",
};
const POPOVER_BUTTON_PROPS: ButtonProps = {
  type: "text",
};

function DashboardManagerModule() {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "dashboard");
  const dataSource = [
    {
      product_name: "Table Cloth 54x54 White",
      brand:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIpSURBVDjLpZNPSFRRFMZ/749/Kt3IqFTSRoSMmrGIYTTbpEJtjBCCok1Em9JVG1dRC8FFEES5aGFEgRRZWq1iLKKxBiNqLDcltQgmHR9hY6LOu+feFm+YGVsZXbh8nHO53/nud8+xjDH8z3IB7r5avGgMZ8XoBq01okFpjYhGtEGJLtmCKINo/XbgVFPUBdDG9PVEq0P/UvnSvdlwQYFoHQIY/3obpRVKFL5W+OIXUVThrL91AN+XihKCwIeTu85sqPryqsJXUvRARAMwkshsiKB7fw25UgKVJwA40V7H/cl5jh+oL+RGk/P0xIqxl11dr8AXjTYG14HRNxkcx+ZhMoNlg52/ND6VAWMoc6F5+2Zy/l9PMIDrWByL1jI+tcDRaN06BaXxbDqLUnq9AqPBteHpuwUcJ0AIcgBXH93h+/wEyyuLrPk5cmv7gNY8gdIYYyhz4PDeWuIpj85IsS2ujQ2zJAk6DkZpqGnixcwYyU+PifUOX7Eh6DoAx7aIpzwA4imPeMrj+bTH+88PaNkZQWwhsrULsXxie9oAzgcESgUe2NAZCeE6AXZGQhwKh/Cyc5RZVXQ39wFwoeMmjXVhgMqiB8awe0cVP36u0Fi/iW9zvwuzkF3+xUz6Nal0gv6uWww+O02lUwGwmv8FM3l55EtLTvQWXwm+EkRpfNEoUZRXHCE5PUFbuJ0nH4cot1wSH14C3LA2Os6x3m2DwDmgGlgChpLX0/1/AIu8MA7WsWBMAAAAAElFTkSuQmCC",
      price: 41.99,
      quantity_sold: 719,
      category: "household",
      expiration_date: "6/22/2022",
      customer_reviews: 341,
      average_rating: 2.7,
      is_featured: true,
      image_url:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJOSURBVDjLpZI9T1RBFIaf3buAoBgJ8rl6QVBJVNDCShMLOhBj6T+wNUaDjY0WmpBIgYpAjL/AShJ+gVYYYRPIony5IETkQxZ2770zc2fGYpflQy2MJzk5J5M5z/vO5ESstfxPxA4erL4Zuh4pLnoaiUZdq7XAGKzRJVbIBZ3JPLJaD9c/eCj/CFgZfNl5qK5q8EhTXdxxLKgQjAFr0NK0ppOpt9n51D2gd2cmsvOElVcvOoprKvuPtriNzsY8rH+H0ECoQEg4WklY1czP8akZby51p6G3b6QAWBl43llSVTlUfuZE3NmYh9Vl0HkHSuVq4ENFNWFdC+uJ5JI/9/V2Y//rkShA1HF6yk/VxJ0f07CcgkCB7+fSC8Dzcy7mp4l9/khlUzwecaI9hT+wRrsOISylcsphCFLl1RXIvBMpYDZJrKYRjHELACNEgC/KCQQofWBQ5nuV64UAP8AEfrDrQEiLlJD18+p7BguwfAoBUmKEsLsAGZSiFWxtgWWP4gGAkuB5YDRWylKAKIDJZBa1H8Kx47C1Cdls7qLnQTZffQ+20lB7EiU1ent7sQBQ6+vdq2PJ5dC9ABW1sJnOQbL5Qc/HpNOYehf/4lW+jY4vh2tr3fsWafrWzRtlDW5f9aVzjUVj72FmCqzBypBQCKzbjLp8jZUPo7OZyYm7bYkvw/sAAFMd7V3lp5sGqs+fjRcZhVYKY0xupwysfpogk0jcb5ucffbbKu9Esv1Kl1N2+Ekk5rg2DIXRmog1Jdr3F/Tm5mO0edc6MSP/CvjX+AV0DoH1Z+D54gAAAABJRU5ErkJggg==",
      product_id: "d17dbd54-aa51-49e7-9bed-4d5096139944",
    },
    {
      product_name: "Wine - Domaine Boyar Royal",
      brand:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIjSURBVDjLY/j//z8DJZiBqgb4dN1jDpnycL5Xx111z7a7/JVrnn8Aibs13DKrXv38t0/b3XkEXeDVdjetZOWzJx7Nd4y82+5McKm9pVm56tnPgK67a4n2glvjraicRU/vudTc5AzsurcmdOKDg3i9YGdnx52VlVXa2tr6bt68ef9ramoeJqXnXwHJ5eTkSAD5d0HiIHmQOpB6uAFGRkZsPj4+XRMnTvz/4sWL/3fv3v1/8ODB/42NjfdACqqrqw/dvHnzB0j8yJEj/0HqQOpB+sAGGBoa+hUXF3+4evXqu4iIiG3e3t5/UlNT/0+aNCkPpCA/P/8/iA8SB8mvWLHiIUg9SB/MBV1NTU3fJ0+enA5U+Mne3p5j7969HOfOneMAKTh06BDH2rVrOYDiakD5JyB1IPUgfWADdHV1M9PT099PmzatJCgoaKejo+MvNze3/4GBgf9BCoC0PogPEgfJg9SB1IP0gQ3QBAJfX9/rvb2971etWvV23bp1/6dPn/6/sLAQbEBFRQWYDxIHyYPUgdSD9IENUFNTYwY6z8DLy+t+SkrKl+zs7O9A/DM8PDwOpCAhOfc6kP8JJA6SB6kDqQfpw5kOPKtvHHTIu7JGL/wMZ0DzrXvaIaejiM4LTgVX1yZOuvdTN+yMplHk+QmaIaeNAhpuPlEPPJFG0ACr9Ivz4ife+60TesYMxA9tu/UBqJFfPeCEulHk2fmqfseZqZ4bAf27e9aCOQHGAAAAAElFTkSuQmCC",
      price: 37.89,
      quantity_sold: 961,
      category: "food",
      expiration_date: "3/6/2022",
      customer_reviews: 435,
      average_rating: 3.3,
      is_featured: true,
      image_url:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADpSURBVCjPY/jPgB8y0EmBHXdWaeu7ef9rHuaY50jU3J33v/VdVqkdN1SBEZtP18T/L/7f/X/wf+O96kM3f9z9f+T/xP8+XUZsYAWGfsUfrr6L2Ob9J/X/pP+V/1P/e/+J2LbiYfEHQz+ICV1N3yen+3PZf977/9z/Q//X/rf/7M81Ob3pu1EXWIFuZvr7aSVBOx1/uf0PBEK3/46/gnZOK0l/r5sJVqCp6Xu99/2qt+v+T/9f+L8CSK77v+pt73vf65qaYAVqzPYGXvdTvmR/z/4ZHhfunP0p+3vKF6/79gZqzPQLSYoUAABKPQ+kpVV/igAAAABJRU5ErkJggg==",
      product_id: "1585126d-e4c0-40ab-8f3a-32fb73b3186d",
    },
  ];
  const PRODUCTS_COLUMNS = [
    {
      title: "Name",
      dataIndex: "product_name",
      key: "product_name",
      render: (_: any, { product_name, brand }: any) => (
        <Flex gap="small" align="center">
          <Image src={brand} width={16} height={16} alt='' />
          <h2>Nhat</h2>
        </Flex>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_: any) => <span className="text-capitalize">{_}</span>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_: any) => <span>$ {_}</span>,
    },
    {
      title: "Avg rating",
      dataIndex: "average_rating",
      key: "average_rating",
      render: (_: any) => (
        <Flex align="center" gap="small">
          {_}
          <StarFilled style={{ fontSize: 12 }} />{" "}
        </Flex>
      ),
    },
  ];

  // Transform data to match the expected structure
  const transformData = (data: number[]): { x: string; y: number }[] => {
    return data.map((value, index) => ({ x: `Point ${index + 1}`, y: value }));
  };

  return (
    <S.PageWrapper>
      <S.Head>
        <Typography.Title level={2}>{t("title")}</Typography.Title>
      </S.Head>

      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            data={transformData([274, 337, 81, 497])}
            title="impressions"
            diff={12.5}
            value={16826}
            style={{ height: "100%" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            data={transformData([20, 40, 80, 50])}
            title="clicks"
            diff={-2.1}
            value={2216869}
            style={{ height: "100%" }}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ marginBottom: "20px", marginTop: "20px" }}>
          <Card title="Popular products" style={cardStyles}>
            <Table
              columns={PRODUCTS_COLUMNS}
              dataSource={dataSource}
              className="overflow-scroll"
            />
          </Card>
        </Col>
      </Row>
    </S.PageWrapper>
  );
}

export default DashboardManagerModule;
