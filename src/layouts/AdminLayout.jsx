import {
  AlertOutlined,
  BookOutlined,
  DashboardOutlined,
  FileTextOutlined,
  FlagOutlined,
  GlobalOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
  TagsOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { theme } from "../styles/theme";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Bảng điều khiển</Link>,
    },
    {
      key: "campaigns",
      icon: <FlagOutlined />,
      label: <Link to="/campaigns">Chiến dịch</Link>,
    },
    {
      key: "users",
      icon: <TeamOutlined />,
      label: <Link to="/users">Nguời dùng</Link>,
    },
    {
      key: "categories",
      icon: <TagsOutlined />,
      label: <Link to="/categories">Danh mục</Link>,
    },
    {
      key: "countries",
      icon: <GlobalOutlined />,
      label: <Link to="/countries">Quốc gia</Link>,
    },
    {
      key: "fundraiseTypes",
      icon: <BookOutlined />,
      label: <Link to="/fundraise-types">Loại chiến dịch</Link>,
    },
    {
      key: "notifications",
      icon: <NotificationOutlined />,
      label: <Link to="/notifications">Thông báo</Link>,
    },
    {
      key: "topics",
      icon: <TagsOutlined />,
      label: <Link to="/topics">Chủ đề</Link>,
    },
    {
      key: "posts",
      icon: <FileTextOutlined />,
      label: <Link to="/posts">Bài viết</Link>,
    },
    {
      key: "reports",
      icon: <AlertOutlined />,
      label: <Link to="/reports">Báo cáo</Link>,
    },
  ];

  return (
    <Layout
      style={{
        maxHeight: "100vh",
        minHeight: "100vh",
        background: theme.colors.background,
      }}
    >
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: theme.colors.sidebar.background,
          borderRadius: `0 ${theme.borderRadius.md} ${theme.borderRadius.md} 0`,
          //   margin: "16px 0 16px 16px",
          overflow: "hidden",
        }}
      >
        <div
          className="p-4 text-white text-2xl"
          style={{
            borderBottom: `1px solid ${theme.colors.sidebar.hover}`,
            marginBottom: "8px",
          }}
        >
          Chain4Good
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
          style={{
            background: "transparent",
            borderRight: 0,
          }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: theme.colors.white,
            borderRadius: theme.borderRadius.md,
            margin: "16px 16px 0 16px",
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            display: "flex",
            alignItems: "center",
          }}
        >
          {collapsed ? (
            <MenuUnfoldOutlined
              className="text-xl cursor-pointer transition-all hover:text-blue-600"
              onClick={() => setCollapsed(false)}
              style={{ color: theme.colors.text.secondary }}
            />
          ) : (
            <MenuFoldOutlined
              className="text-xl cursor-pointer transition-all hover:text-blue-600"
              onClick={() => setCollapsed(true)}
              style={{ color: theme.colors.text.secondary }}
            />
          )}
        </Header>
        <Content
          style={{
            margin: "16px",
            padding: "24px",
            minHeight: 280,
            background: theme.colors.white,
            borderRadius: theme.borderRadius.md,
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            overflow: "scroll",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
