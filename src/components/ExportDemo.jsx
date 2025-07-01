import React from "react";
import ManageWrapper from "./ManageWrapper";
import { Table, Tag, Avatar, Typography, Tooltip } from "antd";
import "../styles/table.css";

const ExportDemo = () => {
  const { Text } = Typography;

  // Sample data for testing
  const sampleData = [
    {
      id: 1,
      title: "Giúp đỡ trẻ em vùng cao",
      description:
        "Chiến dịch quyên góp sách vở và đồ dùng học tập cho trẻ em vùng cao",
      goal: 50000000,
      ethGoal: 20,
      status: "ACTIVE",
      createdAt: "2024-01-15",
      deadline: "2024-12-31",
      user: { name: "Nguyễn Văn A" },
      category: { name: "Giáo dục" },
      fundraiseType: { name: "Quyên góp" },
      txHash: "0x1234567890abcdef1234567890abcdef12345678",
      _count: { donations: 25 },
    },
    {
      id: 2,
      title: "Xây dựng trường học",
      description: "Xây dựng trường học mới cho vùng sâu vùng xa",
      goal: 200000000,
      ethGoal: 80,
      status: "PENDING",
      createdAt: "2024-02-01",
      deadline: "2024-06-30",
      user: { name: "Trần Thị B" },
      category: { name: "Giáo dục" },
      fundraiseType: { name: "Xây dựng" },
      txHash: "0xabcdef1234567890abcdef1234567890abcdef12",
      _count: { donations: 12 },
    },
  ];

  const statusColors = {
    ACTIVE: "green",
    PENDING: "orange",
    COMPLETED: "blue",
    CANCELLED: "red",
  };

  const statusLabels = {
    ACTIVE: "Đang hoạt động",
    PENDING: "Chờ duyệt",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      align: "center",
      render: (id) => (
        <Text strong style={{ color: "#1890ff" }}>
          #{id}
        </Text>
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 250,
      render: (title) => (
        <Tooltip title={title} placement="topLeft">
          <Text strong style={{ color: "#262626" }}>
            {title?.length > 30 ? title.substring(0, 30) + "..." : title}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 200,
      render: (description) => (
        <Tooltip title={description} placement="topLeft">
          <Text type="secondary">
            {description?.length > 25
              ? description.substring(0, 25) + "..."
              : description}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status) => (
        <Tag
          color={statusColors[status]}
          style={{
            borderRadius: "6px",
            fontWeight: "500",
            fontSize: "11px",
          }}
        >
          {statusLabels[status]}
        </Tag>
      ),
    },
    {
      title: "Mục tiêu (VND)",
      dataIndex: "goal",
      key: "goal",
      width: 150,
      align: "right",
      render: (goal) => (
        <Text strong style={{ color: "#52c41a" }}>
          {goal?.toLocaleString("vi-VN")} ₫
        </Text>
      ),
    },
    {
      title: "Người tạo",
      dataIndex: ["user", "name"],
      key: "user",
      width: 180,
      render: (name) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar size="small" style={{ backgroundColor: "#1890ff" }}>
            {name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Text style={{ fontSize: "13px" }}>{name}</Text>
        </div>
      ),
    },
  ];

  return (
    <ManageWrapper
      title="Demo Table Đẹp"
      subtitle="Test giao diện table mới với styling đẹp"
      exportData={sampleData}
      exportColumns={columns}
      exportFileName="demo_table_dep"
    >
      <div className="table-container">
        <Table
          columns={columns}
          dataSource={sampleData}
          rowKey="id"
          pagination={false}
          size="middle"
          className="custom-table"
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            overflow: "hidden",
          }}
          rowClassName={(_, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
        />
      </div>
    </ManageWrapper>
  );
};

export default ExportDemo;
