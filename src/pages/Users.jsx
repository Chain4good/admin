import { useState } from "react";
import ManageWrapper from "@/components/ManageWrapper";
import { useUser } from "@/hooks/useUser";
import {
  Table,
  Tag,
  Dropdown,
  Button,
  message,
  Input,
  Select,
  Space,
} from "antd";
import { LinkOutlined, MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { updateUserStatus } from "@/services/userService";
import debounce from "lodash/debounce";
import { truncate } from "lodash";

const { Option } = Select;

const Users = () => {
  const [filters, setFilters] = useState({
    email: "",
    role: undefined,
    status: undefined,
    page: 1,
    limit: 10,
  });

  const { data: users, isLoading, refetch } = useUser(filters);

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      await updateUserStatus(userId, !currentStatus);
      message.success("Cập nhật trạng thái thành công!");
      refetch();
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại!");
    }
  };

  const handleSearch = debounce((value) => {
    setFilters((prev) => ({ ...prev, email: value, page: 1 }));
  }, 500);

  const handleRoleFilter = (value) => {
    setFilters((prev) => ({ ...prev, role: value, page: 1 }));
  };

  const handleStatusFilter = (value) => {
    setFilters((prev) => ({ ...prev, status: value, page: 1 }));
  };

  const handleTableChange = (pagination) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  const getItems = (record) => [
    {
      key: "details",
      label: "Chi tiết",
      onClick: () => {
        console.log("View details", record);
      },
    },
    {
      key: "status",
      label: record.isActive ? "Vô hiệu hóa" : "Kích hoạt",
      danger: record.isActive,
      onClick: () => handleStatusChange(record.id, record.isActive),
    },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => <div>{truncate(name, { length: 20 }) ?? "-"}</div>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <div>{truncate(email, { length: 20 }) ?? "-"}</div>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phoneNumber) => <div>{phoneNumber ?? "-"}</div>,
    },
    {
      title: "Địa chỉ ví",
      dataIndex: "address",
      key: "address",
      render: (address) => (
        <a
          href={`https://sepolia.etherscan.io/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-primary"
        >
          {address.slice(0, 6)}...${address.slice(-4)}
          <LinkOutlined />
        </a>
      ),
    },
    {
      title: "Role",
      dataIndex: "roleId",
      key: "roleId",
      render: (roleId) => (
        <Tag color={roleId === 1 ? "blue" : "green"}>
          {roleId === 1 ? "Admin" : "User"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "success" : "error"}>
          {isActive ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Dropdown
          menu={{ items: getItems(record) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            className="border-none shadow-none"
            style={{
              fontSize: "20px",
              color: "#666",
              padding: "4px 8px",
            }}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <ManageWrapper
      title="Danh sách người dùng"
      subtitle="Quản lý người dùng"
      exportData={users?.data || []}
      exportColumns={columns}
      exportFileName="danh_sach_nguoi_dung"
    >
      <div className="mb-6 flex gap-4">
        <Input
          placeholder="Tìm kiếm theo tên, email, số điện thoại..."
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-xs"
          allowClear
        />
        <Select
          placeholder="Lọc theo vai trò"
          onChange={handleRoleFilter}
          className="min-w-[150px]"
          allowClear
        >
          <Option value={1}>Admin</Option>
          <Option value={2}>User</Option>
        </Select>
        <Select
          placeholder="Lọc theo trạng thái"
          onChange={handleStatusFilter}
          className="min-w-[150px]"
          allowClear
        >
          <Option value={true}>Hoạt động</Option>
          <Option value={false}>Không hoạt động</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={users?.data || []}
        loading={isLoading}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={{
          total: users?.total,
          pageSize: filters.limit,
          current: filters.page,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng số ${total} người dùng`,
        }}
        onChange={handleTableChange}
      />
    </ManageWrapper>
  );
};

export default Users;
