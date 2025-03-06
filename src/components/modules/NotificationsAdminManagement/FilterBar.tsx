import React from "react";
import { Input, Select, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Club } from "./types";
const { Option } = Select;

interface FilterBarProps {
  clubsData: Club[];
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (value: string, field: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  clubsData,
  handleSearch,
  handleFilterChange,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "10px",
      }}
    >
      <Input
        placeholder="Search by title..."
        prefix={<SearchOutlined />}
        style={{ flex: 1, minWidth: "200px" }}
        onChange={handleSearch}
      />
      <Select
        placeholder="Filter by club"
        style={{ flex: 1, minWidth: "200px" }}
        onChange={(value) => handleFilterChange(value, "clubId")}
        allowClear
      >
        {clubsData?.map((club: Club) => (
          <Option key={club._id} value={club._id}>
            {club.name}
          </Option>
        ))}
      </Select>
      <DatePicker
        placeholder="Filter by date"
        style={{ flex: 1, minWidth: "200px" }}
        onChange={(value) => {
          const dateString = value ? value.format("YYYY-MM-DD") : "";
          handleFilterChange(dateString, "createdAt");
        }}
      />
    </div>
  );
};

export default FilterBar;
