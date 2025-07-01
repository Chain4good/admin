import React from "react";
import { Card, Col, Row, Statistic, Table, Timeline, Typography, Avatar, Tag } from "antd";
import {
  UserOutlined,
  FundProjectionScreenOutlined,
  MoneyCollectOutlined,
  RiseOutlined,
  TrophyOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { Line } from "@ant-design/charts";
import "../styles/dashboard.css";

const DashboardDemo = () => {
  const { Text, Title } = Typography;

  // Mock data for demo
  const mockStatsData = {
    totalUsers: 1250,
    totalCampaigns: 89,
    totalDonations: 3420,
    activeCampaigns: 23,
  };

  const mockCampaignStats = [
    { status: "ACTIVE", _count: 23 },
    { status: "PENDING", _count: 12 },
    { status: "COMPLETED", _count: 45 },
    { status: "CANCELLED", _count: 9 },
  ];

  const mockTopCampaigns = [
    {
      id: 1,
      title: "Giúp đỡ trẻ em vùng cao Sapa",
      goal: 50000000,
      ethGoal: 20,
      _count: { donations: 125 },
    },
    {
      id: 2,
      title: "Xây dựng trường học tại Hà Giang",
      goal: 200000000,
      ethGoal: 80,
      _count: { donations: 89 },
    },
    {
      id: 3,
      title: "Hỗ trợ y tế cho người nghèo",
      goal: 100000000,
      ethGoal: 40,
      _count: { donations: 67 },
    },
  ];

  const mockRecentActivities = [
    {
      campaign: { title: "Giúp đỡ trẻ em vùng cao" },
      amount: "0.5",
      token: "ETH",
      donatedAt: "2024-01-15T10:30:00Z",
    },
    {
      campaign: { title: "Xây dựng trường học" },
      amount: "1.2",
      token: "ETH",
      donatedAt: "2024-01-15T09:15:00Z",
    },
    {
      campaign: { title: "Hỗ trợ y tế" },
      amount: "0.8",
      token: "ETH",
      donatedAt: "2024-01-15T08:45:00Z",
    },
  ];

  // Stats cards configuration
  const statsCards = [
    {
      title: "👥 Tổng số người dùng",
      value: mockStatsData.totalUsers,
      icon: <UserOutlined />,
      color: "#3b82f6",
      className: "stats-card-users",
      suffix: "người",
    },
    {
      title: "🎯 Tổng số chiến dịch",
      value: mockStatsData.totalCampaigns,
      icon: <FundProjectionScreenOutlined />,
      color: "#10b981",
      className: "stats-card-campaigns",
      suffix: "chiến dịch",
    },
    {
      title: "💰 Tổng số quyên góp",
      value: mockStatsData.totalDonations,
      icon: <MoneyCollectOutlined />,
      color: "#f59e0b",
      className: "stats-card-donations",
      suffix: "lượt",
    },
    {
      title: "⚡ Chiến dịch đang hoạt động",
      value: mockStatsData.activeCampaigns,
      icon: <RiseOutlined />,
      color: "#8b5cf6",
      className: "stats-card-active",
      suffix: "hoạt động",
    },
  ];

  // Chart configurations
  const campaignStatusConfig = {
    data: mockCampaignStats.map((item) => ({
      status: item.status,
      count: item._count,
    })),
    xField: "status",
    yField: "count",
    color: "#3b82f6",
  };

  // Top campaigns table columns
  const topCampaignsColumns = [
    {
      title: "🏆 Tên chiến dịch",
      dataIndex: "title",
      key: "title",
      width: 300,
      render: (title) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <TrophyOutlined style={{ color: "#f59e0b" }} />
          <Text strong style={{ color: "#1e293b" }}>
            {title?.length > 40 ? title.substring(0, 40) + "..." : title}
          </Text>
        </div>
      ),
    },
    {
      title: "💵 Mục tiêu (VND)",
      dataIndex: "goal",
      key: "goal",
      width: 150,
      align: "right",
      render: (value) => (
        <Text strong style={{ color: "#10b981" }}>
          {value?.toLocaleString("vi-VN")} ₫
        </Text>
      ),
    },
    {
      title: "⚡ Mục tiêu (ETH)",
      dataIndex: "ethGoal",
      key: "ethGoal",
      width: 120,
      align: "right",
      render: (value) => (
        <Tag color="orange" style={{ fontWeight: "500" }}>
          {value?.toLocaleString()} ETH
        </Tag>
      ),
    },
    {
      title: "👥 Người tham gia",
      dataIndex: ["_count", "donations"],
      key: "donorsCount",
      width: 120,
      align: "center",
      render: (count) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          <HeartOutlined style={{ color: "#ef4444" }} />
          <Text strong style={{ color: "#1e293b" }}>
            {count || 0}
          </Text>
        </div>
      ),
    },
  ];

  // Timeline formatting
  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="dashboard-container">
      {/* Page Title */}
      <div style={{ marginBottom: "32px" }}>
        <Title level={2} style={{ margin: 0, color: "#1e293b" }}>
          📊 Dashboard Demo - Giao Diện Đẹp
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          Demo giao diện Dashboard mới với styling hiện đại và chuyên nghiệp
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} className="dashboard-row">
        {statsCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className={`stats-card ${stat.className}`} hoverable>
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                prefix={React.cloneElement(stat.icon, {
                  style: { color: stat.color, fontSize: "24px" },
                })}
                valueStyle={{
                  color: stat.color,
                  fontWeight: "700",
                  fontSize: "28px",
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts Row */}
      <Row gutter={[24, 24]} className="dashboard-row">
        <Col xs={24} lg={12}>
          <Card title="📈 Thống kê chiến dịch theo trạng thái" className="chart-card">
            <div className="chart-container">
              <Line {...campaignStatusConfig} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="💹 Xu hướng quyên góp" className="chart-card">
            <div className="chart-container">
              <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
                📊 Chart sẽ hiển thị ở đây
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bottom Row */}
      <Row gutter={[24, 24]} className="dashboard-row">
        <Col xs={24} lg={16}>
          <Card title="🏆 Top chiến dịch nổi bật" className="table-card">
            <Table
              columns={topCampaignsColumns}
              dataSource={mockTopCampaigns}
              pagination={false}
              rowKey="id"
              size="middle"
              scroll={{ x: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="🔔 Hoạt động gần đây" className="timeline-card">
            <Timeline
              items={mockRecentActivities.map((activity) => ({
                color: "#3b82f6",
                children: (
                  <div className="activity-item">
                    <div className="activity-title">{activity.campaign.title}</div>
                    <div className="activity-amount">
                      + {activity.amount} {activity.token || "ETH"}
                    </div>
                    <div className="activity-time">{formatDateTime(activity.donatedAt)}</div>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardDemo;
