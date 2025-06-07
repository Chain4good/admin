import { Card, Col, Row, Statistic, Table, Timeline } from "antd";
import {
  UserOutlined,
  FundProjectionScreenOutlined,
  MoneyCollectOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useDashboard } from "@/hooks/useDashboard";
import { Line } from "@ant-design/charts";
import React from "react";
import { CampaignStatus } from "@/constants/status";

const Dashboard = () => {
  const { data: statsData, isLoading: isStatsLoading } = useDashboard("stats");

  const { data: campaignStats, isLoading: isCampaignStatsLoading } =
    useDashboard("campaigns-stats");

  const { data: donationStats, isLoading: isDonationStatsLoading } =
    useDashboard("donations-stats");

  const { data: recentActivities, isLoading: isActivitiesLoading } =
    useDashboard("recent-activities");

  const { data: topCampaigns, isLoading: isTopCampaignsLoading } =
    useDashboard("top-campaigns");

  const { data: userGrowth, isLoading: isUserGrowthLoading } =
    useDashboard("user-growth");

  // Stats cards configuration
  const statsCards = [
    {
      title: "Tổng số người dùng",
      value: statsData?.totalUsers || 0,
      icon: <UserOutlined />,
      color: "#2563eb",
    },
    {
      title: "Tổng số chiến dịch",
      value: statsData?.totalCampaigns || 0,
      icon: <FundProjectionScreenOutlined />,
      color: "#059669",
    },
    {
      title: "Tổng số quyên góp",
      value: statsData?.totalDonations || 0,
      icon: <MoneyCollectOutlined />,
      color: "#F59E0B",
    },
    {
      title: "Chiến dịch đang hoạt động",
      value: statsData?.activeCampaigns || 0,
      icon: <TeamOutlined />,
      color: "#8B5CF6",
    },
  ];

  // Campaign status chart configuration
  const campaignStatusConfig = {
    data:
      campaignStats?.map((item) => ({
        ...item,
        status: CampaignStatus[item.status] || item.status,
      })) || [],
    xField: "status",
    yField: "_count",
    color: "#2563eb",
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: false,
        autoEllipsis: true,
      },
    },
  };

  // Donation trend chart configuration
  const donationTrendConfig = {
    data: donationStats || [],
    yField: "amount",
    xField: "donatedAt",
    color: "#059669",
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: false,
        autoEllipsis: true,
      },
    },
  };

  // User growth chart configuration
  const userGrowthConfig = {
    data:
      userGrowth?.map((item) => ({
        date: new Date(item.createdAt).toLocaleDateString("vi-VN"),
        value: item._count,
      })) || [],
    xField: "date",
    yField: "value",
    smooth: true,
    color: "#8B5CF6",
  };

  // Thêm console.log để debug
  console.log("userGrowth data:", userGrowth);
  console.log("userGrowthConfig:", userGrowthConfig);

  // Top campaigns table columns
  const topCampaignsColumns = [
    {
      title: "Tên chiến dịch",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Số tiền quyên góp (VND)",
      dataIndex: "goal",
      key: "goal",
      render: (value) => `${value?.toLocaleString()}`,
    },
    {
      title: "Quyên góp (ETH)",
      dataIndex: "ethGoal",
      key: "ethGoal",
      render: (value) => `${value?.toLocaleString()}`,
    },
    {
      title: "Số người tham gia",
      dataIndex: ["_count", "donations"],
      key: "donorsCount",
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
    <div className="space-y-6">
      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        {statsCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card loading={isStatsLoading}>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={React.cloneElement(stat.icon, {
                  style: { color: stat.color },
                })}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title="Thống kê chiến dịch theo trạng thái"
            loading={isCampaignStatsLoading}
          >
            <Line {...campaignStatusConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Xu hướng quyên góp" loading={isDonationStatsLoading}>
            <Line {...donationTrendConfig} />
          </Card>
        </Col>
      </Row>

      {/* Bottom Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Top chiến dịch" loading={isTopCampaignsLoading}>
            <Table
              columns={topCampaignsColumns}
              dataSource={topCampaigns || []}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Hoạt động gần đây" loading={isActivitiesLoading}>
            <Timeline
              items={
                recentActivities?.map((activity) => ({
                  color: "blue",
                  children: (
                    <div>
                      <p className="font-medium">
                        {activity.campaign.title}{" "}
                        <strong className="text-green-400 font-semibold">
                          + {activity.amount} {activity.token || "ETH"}
                        </strong>
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDateTime(activity.donatedAt)}
                      </p>
                    </div>
                  ),
                })) || []
              }
            />
          </Card>
        </Col>
      </Row>

      {/* User Growth Chart */}
      <Row>
        <Col span={24}>
          <Card
            title="Thống kê tăng trưởng người dùng"
            loading={isUserGrowthLoading}
          >
            <Line
              {...userGrowthConfig}
              onReady={(plot) => {
                console.log("Chart ready:", plot);
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
