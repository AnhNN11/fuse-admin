import React from "react";
import { Input, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface FilterBarProps {
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (value: string, field: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
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
