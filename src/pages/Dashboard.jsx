import {
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Timeline,
  Progress,
  Tag,
  AutoComplete,
  Input,
  Avatar,
  Dropdown,
  Button,
  Space,
  Modal,
  Typography,
  Image,
} from "antd";
import {
  UserOutlined,
  FundProjectionScreenOutlined,
  MoneyCollectOutlined,
  TeamOutlined,
  TrophyOutlined,
  HeartOutlined,
  RiseOutlined,
  FireOutlined,
  LoadingOutlined,
  SearchOutlined,
  DashboardOutlined,
  FileTextOutlined,
  UsergroupAddOutlined,
  SettingOutlined,
  BellOutlined,
  GlobalOutlined,
  LogoutOutlined,
  DownOutlined,
  CrownOutlined,
  EyeOutlined,
  CalendarOutlined,
  EditOutlined,
  CommentOutlined,
  ShareAltOutlined,
  BookOutlined,
} from "@ant-design/icons";

const { Text, Title, Paragraph } = Typography;
import { useDashboard } from "@/hooks/useDashboard";
import { Line, Column } from "@ant-design/charts";
import React, { useState, useMemo } from "react";
import { CampaignStatus } from "@/constants/status";
import "@/styles/dashboard.css";

const Dashboard = () => {
  // Search state
  const [searchValue, setSearchValue] = useState("");
  const [searchOptions, setSearchOptions] = useState([]);

  // Post preview state
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
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

  // Search suggestions data
  const searchSuggestions = useMemo(
    () => [
      {
        value: "dashboard",
        label: "Dashboard Tổng Quan",
        icon: <DashboardOutlined />,
        description: "Xem tổng quan hệ thống",
      },
      {
        value: "campaigns",
        label: "Quản Lý Chiến Dịch",
        icon: <FundProjectionScreenOutlined />,
        description: "Danh sách và quản lý chiến dịch",
      },
      {
        value: "users",
        label: "Quản Lý Người Dùng",
        icon: <UsergroupAddOutlined />,
        description: "Danh sách và quản lý người dùng",
      },
      {
        value: "posts",
        label: "Quản Lý Bài Viết",
        icon: <FileTextOutlined />,
        description: "Danh sách và quản lý bài viết",
      },
      {
        value: "categories",
        label: "Quản Lý Danh Mục",
        icon: <SettingOutlined />,
        description: "Cấu hình danh mục",
      },
      {
        value: "countries",
        label: "Quản Lý Quốc Gia",
        icon: <GlobalOutlined />,
        description: "Danh sách quốc gia",
      },
      {
        value: "notifications",
        label: "Thông Báo",
        icon: <BellOutlined />,
        description: "Quản lý thông báo hệ thống",
      },
      {
        value: "reports",
        label: "Báo Cáo",
        icon: <FileTextOutlined />,
        description: "Xem báo cáo thống kê",
      },
    ],
    []
  );

  // Search functionality
  const handleSearch = (value) => {
    setSearchValue(value);
    if (value) {
      const filteredOptions = searchSuggestions
        .filter(
          (item) =>
            item.label.toLowerCase().includes(value.toLowerCase()) ||
            item.description.toLowerCase().includes(value.toLowerCase())
        )
        .map((item) => ({
          value: item.value,
          label: (
            <div className="flex items-center gap-3 p-2">
              <div className="text-blue-500 text-lg">{item.icon}</div>
              <div>
                <div className="font-medium text-gray-800">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </div>
          ),
        }));
      setSearchOptions(filteredOptions);
    } else {
      setSearchOptions([]);
    }
  };

  const handleSelect = (value) => {
    // Navigate to selected page
    console.log("Navigating to:", value);
    // You can add navigation logic here
    // For example: window.location.href = `/${value}`;
  };

  // User info - you can replace this with actual user data from context/store
  const userInfo = {
    name: "Nguyễn Văn Admin",
    email: "admin@charity.com",
    role: "Quản trị viên",
    avatar: null, // You can add avatar URL here
  };

  // Logout functionality
  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
    // localStorage.removeItem('token');
    // window.location.href = '/login';
  };

  // User dropdown menu items
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin cá nhân",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      handleLogout();
    } else if (key === "profile") {
      console.log("Navigate to profile");
    } else if (key === "settings") {
      console.log("Navigate to settings");
    }
  };

  // Sample posts data - replace with actual data from API
  const recentPosts = [
    {
      id: 1,
      title: "Hành trình xây dựng trường học tại vùng cao",
      excerpt:
        "Chúng tôi đã hoàn thành việc xây dựng ngôi trường học đầu tiên tại vùng cao, mang lại cơ hội học tập cho hàng trăm trẻ em...",
      content: `
        <h3>Dự án xây dựng trường học tại vùng cao</h3>
        <p>Sau 6 tháng triển khai, chúng tôi đã hoàn thành việc xây dựng ngôi trường học đầu tiên tại vùng cao Tây Bắc. Dự án này không chỉ mang lại cơ hội học tập cho hàng trăm trẻ em mà còn tạo ra những thay đổi tích cực trong cộng đồng địa phương.</p>
        
        <h4>Những thành tựu đạt được:</h4>
        <ul>
          <li>Xây dựng hoàn thành 8 phòng học với đầy đủ trang thiết bị</li>
          <li>Cung cấp sách vở, dụng cụ học tập cho 200 học sinh</li>
          <li>Tạo việc làm cho 15 giáo viên địa phương</li>
          <li>Xây dựng hệ thống nước sạch và nhà vệ sinh</li>
        </ul>
        
        <p>Chúng tôi tin rằng giáo dục là chìa khóa để thay đổi tương lai. Với sự đóng góp của các nhà hảo tâm, chúng ta đã mang lại hy vọng và cơ hội cho những đứa trẻ vùng cao.</p>
      `,
      author: "Nguyễn Minh Anh",
      publishDate: "2024-01-15",
      category: "Giáo dục",
      image:
        "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=400&fit=crop",
      readTime: "5 phút đọc",
      likes: 156,
      comments: 23,
      shares: 12,
    },
    {
      id: 2,
      title: "Chương trình cấp nước sạch cho miền Trung",
      excerpt:
        "Dự án cung cấp nước sạch đã tiếp cận được 50 hộ gia đình tại các tỉnh miền Trung, cải thiện đáng kể chất lượng cuộc sống...",
      content: `
        <h3>Chương trình cấp nước sạch cho miền Trung</h3>
        <p>Trong bối cảnh hạn hán kéo dài và ô nhiễm nguồn nước ngày càng nghiêm trọng, chương trình cấp nước sạch của chúng tôi đã mang lại những thay đổi tích cực cho cộng đồng miền Trung.</p>
        
        <h4>Kết quả triển khai:</h4>
        <ul>
          <li>Lắp đặt 25 máy lọc nước tại các khu vực trọng điểm</li>
          <li>Cung cấp nước sạch cho 50 hộ gia đình (khoảng 200 người)</li>
          <li>Giảm 80% bệnh tật liên quan đến nguồn nước ô nhiễm</li>
          <li>Tổ chức 10 buổi tập huấn về vệ sinh an toàn thực phẩm</li>
        </ul>
        
        <p>Chúng tôi cam kết tiếp tục mở rộng chương trình này đến nhiều khu vực khác, góp phần bảo vệ sức khỏe cộng đồng và phát triển bền vững.</p>
      `,
      author: "Trần Văn Hòa",
      publishDate: "2024-01-12",
      category: "Môi trường",
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=400&fit=crop",
      readTime: "4 phút đọc",
      likes: 134,
      comments: 18,
      shares: 8,
    },
    {
      id: 3,
      title: "Tết yêu thương - Mang niềm vui đến các em nhỏ",
      excerpt:
        "Chương trình Tết yêu thương đã trao tặng 500 phần quà và học bổng cho trẻ em có hoàn cảnh khó khăn...",
      content: `
        <h3>Tết yêu thương - Mang niềm vui đến các em nhỏ</h3>
        <p>Nhân dịp Tết Nguyên đán, chương trình "Tết yêu thương" đã được tổ chức nhằm mang lại niềm vui và những món quà ý nghĩa đến các em nhỏ có hoàn cảnh khó khăn.</p>
        
        <h4>Hoạt động chính:</h4>
        <ul>
          <li>Trao tặng 500 phần quà Tết (quần áo, bánh kẹo, đồ chơi)</li>
          <li>Cấp 100 học bổng cho học sinh giỏi nghèo</li>
          <li>Tổ chức 5 buổi biểu diễn văn nghệ tại các trại trẻ mồ côi</li>
          <li>Xây dựng 3 sân chơi mới cho trẻ em</li>
        </ul>
        
        <p>Nụ cười hạnh phúc của các em chính là động lực lớn nhất để chúng tôi tiếp tục những hoạt động thiện nguyện ý nghĩa này.</p>
      `,
      author: "Lê Thị Mai",
      publishDate: "2024-01-08",
      category: "Cộng đồng",
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=400&fit=crop",
      readTime: "3 phút đọc",
      likes: 289,
      comments: 45,
      shares: 32,
    },
  ];

  // Handle post preview
  const handlePreviewPost = (post) => {
    setSelectedPost(post);
    setIsPreviewVisible(true);
  };

  const handleClosePreview = () => {
    setIsPreviewVisible(false);
    setSelectedPost(null);
  };

  // Enhanced stats cards configuration with gradients and animations
  const statsCards = [
    {
      title: "Tổng số người dùng",
      value: statsData?.totalUsers || 0,
      icon: <UserOutlined />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#667eea",
      growth: "+12%",
    },
    {
      title: "Tổng số chiến dịch",
      value: statsData?.totalCampaigns || 0,
      icon: <FundProjectionScreenOutlined />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      color: "#f093fb",
      growth: "+8%",
    },
    {
      title: "Tổng số quyên góp",
      value: statsData?.totalDonations || 0,
      icon: <MoneyCollectOutlined />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      color: "#4facfe",
      growth: "+24%",
    },
    {
      title: "Chiến dịch đang hoạt động",
      value: statsData?.activeCampaigns || 0,
      icon: <TeamOutlined />,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      color: "#43e97b",
      growth: "+5%",
    },
  ];

  // Enhanced campaign status chart configuration
  const campaignStatusConfig = {
    data:
      campaignStats?.map((item) => ({
        ...item,
        status: CampaignStatus[item.status] || item.status,
      })) || [],
    xField: "status",
    yField: "_count",
    seriesField: "status",
    color: ["#667eea", "#f093fb", "#4facfe", "#43e97b", "#ffecd2"],
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: false,
        autoEllipsis: true,
        style: {
          fontSize: 12,
          fontWeight: 500,
        },
      },
    },
    yAxis: {
      grid: {
        line: {
          style: {
            stroke: "#f0f0f0",
            lineWidth: 1,
            lineDash: [4, 5],
          },
        },
      },
    },
  };

  // Enhanced donation trend chart configuration
  const donationTrendConfig = {
    data: donationStats || [],
    yField: "amount",
    xField: "donatedAt",
    smooth: true,
    color: "#4facfe",
    lineStyle: {
      lineWidth: 3,
    },
    point: {
      size: 5,
      shape: "diamond",
      style: {
        fill: "#4facfe",
        stroke: "#fff",
        lineWidth: 2,
      },
    },
    area: {
      style: {
        fill: "linear-gradient(270deg, #4facfe 0%, rgba(79, 172, 254, 0.1) 100%)",
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: false,
        autoEllipsis: true,
        style: {
          fontSize: 12,
          fontWeight: 500,
        },
      },
    },
    yAxis: {
      grid: {
        line: {
          style: {
            stroke: "#f0f0f0",
            lineWidth: 1,
            lineDash: [4, 5],
          },
        },
      },
    },
  };

  // Enhanced user growth chart configuration
  const userGrowthConfig = {
    data:
      userGrowth?.map((item) => ({
        date: new Date(item.createdAt).toLocaleDateString("vi-VN"),
        value: item._count,
      })) || [],
    xField: "date",
    yField: "value",
    smooth: true,
    color: "#43e97b",
    lineStyle: {
      lineWidth: 3,
    },
    point: {
      size: 5,
      shape: "circle",
      style: {
        fill: "#43e97b",
        stroke: "#fff",
        lineWidth: 2,
      },
    },
    area: {
      style: {
        fill: "linear-gradient(270deg, #43e97b 0%, rgba(67, 233, 123, 0.1) 100%)",
      },
    },
  };

  // Enhanced top campaigns table columns
  const topCampaignsColumns = [
    {
      title: (
        <span className="flex items-center gap-2">
          <TrophyOutlined className="text-yellow-500" />
          Tên chiến dịch
        </span>
      ),
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <MoneyCollectOutlined className="text-green-500" />
          Mục tiêu (VND)
        </span>
      ),
      dataIndex: "goal",
      key: "goal",
      render: (value) => (
        <span className="font-semibold text-green-600">
          {value?.toLocaleString()} VND
        </span>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <FireOutlined className="text-orange-500" />
          Mục tiêu (ETH)
        </span>
      ),
      dataIndex: "ethGoal",
      key: "ethGoal",
      render: (value) => (
        <span className="font-semibold text-orange-600">
          {value?.toLocaleString()} ETH
        </span>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <HeartOutlined className="text-red-500" />
          Người tham gia
        </span>
      ),
      dataIndex: ["_count", "donations"],
      key: "donorsCount",
      render: (value) => (
        <Tag color="blue" className="px-3 py-1 rounded-full">
          {value} người
        </Tag>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className=" mx-auto space-y-8">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <CrownOutlined className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Xin chào, {userInfo.name}! 👋
                </h2>
                <p className="text-sm text-gray-600">{userInfo.role}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button
              type="text"
              icon={<BellOutlined />}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-50 transition-colors duration-200"
              style={{ fontSize: "18px" }}
            />

            {/* User Profile Dropdown */}
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleMenuClick,
              }}
              placement="bottomRight"
              arrow
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  className="bg-gradient-to-r from-blue-500 to-purple-500"
                  src={userInfo.avatar}
                />
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-800">
                    {userInfo.name}
                  </div>
                  <div className="text-xs text-gray-500">{userInfo.email}</div>
                </div>
                <DownOutlined className="text-gray-400 text-xs" />
              </div>
            </Dropdown>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Dashboard Quản Trị
          </h1>
          <p className="text-gray-600 mb-6">
            Tổng quan về hoạt động quyên góp từ thiện
          </p>

          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto mb-4">
            <AutoComplete
              value={searchValue}
              options={searchOptions}
              onSearch={handleSearch}
              onSelect={handleSelect}
              size="large"
              placeholder="Tìm kiếm chức năng, trang, hoặc thống kê..."
              className="w-full"
              dropdownClassName="search-dropdown"
              style={{
                fontSize: "16px",
              }}
            >
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                className="rounded-full border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors duration-300"
                style={{
                  height: "50px",
                  fontSize: "16px",
                  paddingLeft: "20px",
                }}
              />
            </AutoComplete>
          </div>

          {/* Quick Access Buttons */}
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              {
                icon: <DashboardOutlined />,
                label: "Dashboard",
                color: "#667eea",
              },
              {
                icon: <FundProjectionScreenOutlined />,
                label: "Chiến dịch",
                color: "#f093fb",
              },
              {
                icon: <UsergroupAddOutlined />,
                label: "Người dùng",
                color: "#4facfe",
              },
              {
                icon: <FileTextOutlined />,
                label: "Bài viết",
                color: "#43e97b",
              },
            ].map((item, index) => (
              <button
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                style={{ color: item.color }}
                onClick={() => handleSelect(item.label.toLowerCase())}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <Row gutter={[24, 24]}>
          {statsCards.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                loading={isStatsLoading}
                className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                bodyStyle={{ padding: 0 }}
              >
                <div
                  className="p-6 text-white relative"
                  style={{ background: stat.gradient }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white/80 text-sm mb-1">
                        {stat.title}
                      </div>
                      <div className="text-3xl font-bold mb-2">
                        {stat.value.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-white/90">
                        <RiseOutlined />
                        <span className="text-sm">{stat.growth}</span>
                      </div>
                    </div>
                    <div className="text-4xl opacity-80">
                      {React.cloneElement(stat.icon)}
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Enhanced Charts Row */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <span className="flex items-center gap-2 text-lg font-semibold">
                  <FireOutlined className="text-orange-500" />
                  Thống kê chiến dịch theo trạng thái
                </span>
              }
              loading={isCampaignStatsLoading}
              className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300"
              headStyle={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <Column {...campaignStatusConfig} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title={
                <span className="flex items-center gap-2 text-lg font-semibold">
                  <RiseOutlined className="text-blue-500" />
                  Xu hướng quyên góp
                </span>
              }
              loading={isDonationStatsLoading}
              className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300"
              headStyle={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <Line {...donationTrendConfig} />
            </Card>
          </Col>
        </Row>

        {/* Enhanced Bottom Row */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              title={
                <span className="flex items-center gap-2 text-lg font-semibold">
                  <TrophyOutlined className="text-yellow-500" />
                  Top chiến dịch nổi bật
                </span>
              }
              loading={isTopCampaignsLoading}
              className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300"
              headStyle={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <Table
                columns={topCampaignsColumns}
                dataSource={topCampaigns || []}
                pagination={false}
                rowKey="id"
                className="custom-table"
                rowClassName="hover:bg-blue-50 transition-colors duration-200"
              />
            </Card>
          </Col>
          <Col xs={24} lg={8} className="w-full">
            <Card
              title={
                <span className="flex items-center gap-2 text-lg font-semibold">
                  <HeartOutlined className="text-red-500" />
                  Hoạt động gần đây
                </span>
              }
              loading={isActivitiesLoading}
              className="shadow-lg border-0 hover:shadow-xl h-[580px] overflow-scroll transition-shadow duration-300"
              headStyle={{
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                color: "white",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <Timeline
                pendingDot={<LoadingOutlined />}
                items={
                  recentActivities?.map((activity, index) => ({
                    color: index % 2 === 0 ? "#4facfe" : "#43e97b",
                    children: (
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg mb-2 hover:shadow-md transition-shadow duration-200">
                        <p className="font-medium text-gray-800 mb-1">
                          {activity.campaign.title}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <MoneyCollectOutlined className="text-green-500" />
                          <span className="text-green-600 font-semibold">
                            + {activity.amount} {activity.token || "ETH"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
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

        {/* Enhanced User Growth Chart */}
        <Row>
          <Col span={24}>
            <Card
              title={
                <span className="flex items-center gap-2 text-lg font-semibold">
                  <UserOutlined className="text-purple-500" />
                  Thống kê tăng trưởng người dùng
                </span>
              }
              loading={isUserGrowthLoading}
              className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300"
              headStyle={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: "8px 8px 0 0",
              }}
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

        {/* Recent Posts Section */}
        <Row>
          <Col span={24}>
            <Card
              title={
                <span className="flex items-center gap-2 text-lg font-semibold">
                  <BookOutlined className="text-indigo-500" />
                  Bài viết gần đây
                </span>
              }
              className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300"
              headStyle={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "white",
                borderRadius: "8px 8px 0 0",
              }}
              extra={
                <Button
                  type="text"
                  style={{ color: "white" }}
                  icon={<EditOutlined />}
                >
                  Xem tất cả
                </Button>
              }
            >
              <Row gutter={[24, 24]}>
                {recentPosts.map((post) => (
                  <Col xs={24} md={12} lg={8} key={post.id}>
                    <Card
                      hoverable
                      className="h-full post-card overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                      cover={
                        <div className="relative overflow-hidden">
                          <Image
                            alt={post.title}
                            src={post.image}
                            className="h-48 w-full object-cover transition-transform duration-300 hover:scale-110"
                            preview={false}
                          />
                          <div className="absolute top-4 left-4">
                            <Tag
                              color="blue"
                              className="px-3 py-1 rounded-full font-medium"
                            >
                              {post.category}
                            </Tag>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      }
                      actions={[
                        <Button
                          key="preview"
                          type="text"
                          icon={<EyeOutlined />}
                          onClick={() => handlePreviewPost(post)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Xem trước
                        </Button>,
                        <div
                          key="stats"
                          className="flex items-center gap-4 text-gray-500"
                        >
                          <span className="flex items-center gap-1">
                            <HeartOutlined />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <CommentOutlined />
                            {post.comments}
                          </span>
                          <span className="flex items-center gap-1">
                            <ShareAltOutlined />
                            {post.shares}
                          </span>
                        </div>,
                      ]}
                    >
                      <div className="p-2">
                        <Title
                          level={5}
                          className="mb-2 line-clamp-2 min-h-[3rem]"
                        >
                          {post.title}
                        </Title>
                        <Paragraph
                          className="text-gray-600 mb-3 line-clamp-3"
                          ellipsis={{ rows: 3, expandable: false }}
                        >
                          {post.excerpt}
                        </Paragraph>
                        <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <Avatar size={24} icon={<UserOutlined />} />
                            <span className="font-medium">{post.author}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <CalendarOutlined />
                              {new Date(post.publishDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Post Preview Modal */}
        <Modal
          title={
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <BookOutlined className="text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">{selectedPost?.title}</div>
                <div className="text-sm text-gray-500 font-normal">
                  {selectedPost?.author} • {selectedPost?.readTime}
                </div>
              </div>
            </div>
          }
          open={isPreviewVisible}
          onCancel={handleClosePreview}
          footer={[
            <Button key="edit" type="primary" icon={<EditOutlined />}>
              Chỉnh sửa
            </Button>,
            <Button key="close" onClick={handleClosePreview}>
              Đóng
            </Button>,
          ]}
          width={800}
          className="post-preview-modal"
        >
          {selectedPost && (
            <div className="post-preview-content">
              <div className="mb-4">
                <Image
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <Tag color="blue" className="px-3 py-1 rounded-full">
                  {selectedPost.category}
                </Tag>
                <span className="text-gray-600">
                  <CalendarOutlined className="mr-1" />
                  {new Date(selectedPost.publishDate).toLocaleDateString(
                    "vi-VN"
                  )}
                </span>
                <span className="text-gray-600">{selectedPost.readTime}</span>
              </div>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Avatar icon={<UserOutlined />} />
                  <div>
                    <div className="font-medium">{selectedPost.author}</div>
                    <div className="text-sm text-gray-500">Tác giả</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-gray-600">
                  <span className="flex items-center gap-1">
                    <HeartOutlined />
                    {selectedPost.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <CommentOutlined />
                    {selectedPost.comments}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShareAltOutlined />
                    {selectedPost.shares}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
