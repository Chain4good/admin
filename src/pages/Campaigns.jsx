import ManageWrapper from "@/components/ManageWrapper";
import CampaignAnalysis from "@/components/CampaignAnalysis";
import "../styles/table.css";
import { CampaignStatus, CampaignStatusColor } from "@/constants/status";
import { useCampaign } from "@/hooks/useCampaign";
import { useCategory } from "@/hooks/useCategory";
import { useFundraiseType } from "@/hooks/useFundraiseType";
import {
  checkOnChain,
  deleteCampaign,
  sendEmailToOwner,
  summarizeByAI,
  updateCampaignStatus,
  analyzeCampaignTrust,
} from "@/services/campaignService";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  message,
  Modal,
  Pagination,
  Select,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { truncate } from "lodash";
import { useState } from "react";

const Campaigns = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: undefined,
    email: undefined,
    sort: undefined,
    sortBy: undefined,
    categoryId: undefined,
    fundraiseTypeId: undefined,
    countryId: undefined,
  });
  const { data: campaigns, isFetching, refetch } = useCampaign(filters);
  const { data: categories } = useCategory();
  const { data: fundraiseTypes } = useFundraiseType();
  const [analysisVisible, setAnalysisVisible] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const handleChangeFilter = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateCampaignStatus(id, newStatus);
      message.success("Cập nhật trạng thái thành công!");
      refetch();
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại!");
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa chiến dịch này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteCampaign(id);
          message.success("Xóa chiến dịch thành công!");
          refetch();
        } catch (error) {
          message.error("Xóa chiến dịch thất bại!");
        }
      },
    });
  };

  const handleCheckOnChain = async (txHash) => {
    try {
      const result = await checkOnChain(txHash);
      Modal.info({
        title: "Thông tin On-Chain",
        content: (
          <div>
            <p>Status: {result.status}</p>
            <p>Block Number: {result.blockNumber}</p>
            <p>Gas Used: {result.gasUsed}</p>
          </div>
        ),
      });
    } catch (error) {
      message.error("Kiểm tra on-chain thất bại!");
    }
  };

  const handleAISummary = async (id) => {
    try {
      const summary = await summarizeByAI(id);
      Modal.info({
        title: "Tóm tắt chiến dịch",
        width: 600,
        content: summary,
      });
    } catch (error) {
      message.error("Không thể tạo tóm tắt!");
    }
  };

  const handleSendEmail = async (id, userEmail) => {
    try {
      await sendEmailToOwner(id, userEmail);
      message.success("Gửi email thành công!");
    } catch (error) {
      message.error("Gửi email thất bại!");
    }
  };

  const handleAnalyze = async (id) => {
    try {
      setAnalysisVisible(true);
      setAnalysisLoading(true);
      const data = await analyzeCampaignTrust(id);
      setAnalysisData(data);
    } catch (error) {
      message.error("Không thể phân tích chiến dịch!");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const getStatusItems = (record) => [
    {
      key: "PENDING",
      label: "Chờ duyệt",
      disabled: record.status === "PENDING",
    },
    {
      key: "APPROVED",
      label: "Duyệt",
      disabled: record.status === "APPROVED",
    },
    {
      key: "REJECTED",
      label: "Từ chối",
      disabled: record.status === "REJECTED",
    },
    {
      key: "ACTIVE",
      label: "Kích hoạt",
      disabled: record.status === "ACTIVE",
    },
    {
      key: "FINISHED",
      label: "Hoàn thành",
      disabled: record.status === "FINISHED",
    },
  ];

  const getItems = (record) => [
    {
      key: "status",
      label: "Cập nhật trạng thái",
      children: getStatusItems(record).map((item) => ({
        ...item,
        onClick: () => handleStatusChange(record.id, item.key),
      })),
    },
    {
      key: "onchain",
      label: "Kiểm tra On-Chain",
      onClick: () => handleCheckOnChain(record.txHash),
    },
    {
      key: "ai",
      label: "Tóm tắt bằng AI",
      onClick: () => handleAISummary(record.id),
    },
    {
      key: "email",
      label: "Gửi email",
      onClick: () => handleSendEmail(record.id, record.user.email),
    },
    {
      key: "analyze",
      label: "Phân tích độ tin cậy",
      onClick: () => handleAnalyze(record.id),
    },
    {
      key: "delete",
      label: "Xóa chiến dịch",
      danger: true,
      onClick: () => handleDelete(record.id),
    },
  ];

  const { Text } = Typography;

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 70,
      fixed: "left",
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
      width: 250,
      fixed: "left",
      render: (title) => (
        <Tooltip title={title} placement="topLeft">
          <Text strong style={{ color: "#262626" }}>
            {truncate(title, { length: 30 })}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Chi tiết",
      dataIndex: "description",
      width: 200,
      render: (description) => (
        <Tooltip title={description} placement="topLeft">
          <Text type="secondary">{truncate(description, { length: 25 })}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 130,
      render: (createdAt) => (
        <Text style={{ fontSize: "12px" }}>
          {new Date(createdAt).toLocaleDateString("vi-VN")}
        </Text>
      ),
    },
    {
      title: "Hạn chót",
      dataIndex: "deadline",
      width: 130,
      render: (deadline) => {
        const isExpired = new Date(deadline) < new Date();
        return (
          <Text
            style={{
              fontSize: "12px",
              color: isExpired ? "#ff4d4f" : "#52c41a",
            }}
          >
            {new Date(deadline).toLocaleDateString("vi-VN")}
          </Text>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      align: "center",
      render: (status) => (
        <Tag
          color={CampaignStatusColor[status]}
          style={{
            borderRadius: "6px",
            fontWeight: "500",
            fontSize: "11px",
          }}
        >
          {CampaignStatus[status]}
        </Tag>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: ["category", "name"],
      width: 130,
      render: (name) => (
        <Tag color="blue" style={{ borderRadius: "4px" }}>
          {name}
        </Tag>
      ),
    },
    {
      title: "Mục tiêu (ETH)",
      dataIndex: "ethGoal",
      width: 120,
      align: "right",
      render: (ethGoal) => (
        <Text strong style={{ color: "#fa8c16" }}>
          {ethGoal} ETH
        </Text>
      ),
    },
    {
      title: "Mục tiêu (VND)",
      dataIndex: "goal",
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
      width: 180,
      render: (name, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar size="small" style={{ backgroundColor: "#1890ff" }}>
            {name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Text style={{ fontSize: "13px" }}>{name}</Text>
        </div>
      ),
    },
    {
      title: "Hash",
      dataIndex: ["txHash"],
      width: 180,
      render: (txHash) => (
        <Tooltip title={txHash} placement="topLeft">
          <Text
            code
            // style={{
            //   fontSize: "11px",
            //   backgroundColor: "#f5f5f5",
            //   padding: "2px 6px",
            //   borderRadius: "4px",
            // }}
          >
            {truncate(txHash, { length: 15 }) || "-"}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Hình thức",
      dataIndex: ["fundraiseType", "name"],
      width: 120,
      render: (name) => (
        <Tag color="purple" style={{ borderRadius: "4px", fontSize: "11px" }}>
          {name}
        </Tag>
      ),
    },
    {
      title: "Quyên góp",
      dataIndex: ["_count", "donations"],
      width: 100,
      align: "center",
      render: (count) => (
        <div
          style={{
            backgroundColor: "#f0f0f0",
            borderRadius: "12px",
            padding: "4px 8px",
            display: "inline-block",
          }}
        >
          <Text strong style={{ color: "#1890ff", fontSize: "12px" }}>
            {count || 0}
          </Text>
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 80,
      align: "center",
      render: (_, record) => (
        <Dropdown
          menu={{ items: getItems(record) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            className="border-none shadow-none hover:bg-gray-100"
            style={{
              fontSize: "18px",
              color: "#666",
              padding: "4px 8px",
              borderRadius: "6px",
            }}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <ManageWrapper
      title="Chiến dịch"
      subtitle="Quản lý tất cả chiến dịch"
      exportData={campaigns?.data || []}
      exportColumns={columns}
      exportFileName="danh_sach_chien_dich"
    >
      <div className="filter-section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <Input
            placeholder="🔍 Tìm kiếm theo tiêu đề..."
            allowClear
            size="large"
            onChange={(e) => handleChangeFilter("search", e.target.value)}
            // style={{ borderRadius: "8px" }}
          />

          <Select
            placeholder="📊 Lọc theo trạng thái"
            allowClear
            size="large"
            onChange={(value) => handleChangeFilter("status", value)}
            style={{ borderRadius: "8px" }}
          >
            {Object.entries(CampaignStatus).map(([key, value]) => (
              <Select.Option key={key} value={key}>
                <Tag
                  color={CampaignStatusColor[key]}
                  style={{ marginRight: 8 }}
                >
                  {value}
                </Tag>
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="🎯 Lọc theo loại chiến dịch"
            allowClear
            size="large"
            onChange={(value) => handleChangeFilter("fundraiseTypeId", value)}
            style={{ borderRadius: "8px" }}
          >
            {fundraiseTypes?.map((type) => (
              <Select.Option key={type.id} value={type.id}>
                {type.name}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="📁 Lọc theo danh mục"
            allowClear
            size="large"
            onChange={(value) => handleChangeFilter("categoryId", value)}
            style={{ borderRadius: "8px" }}
          >
            {categories?.data?.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="🔄 Sắp xếp theo"
            allowClear
            size="large"
            onChange={(value) => {
              const [sort, sortBy] = value.split("-");
              handleChangeFilter("sort", sort);
              handleChangeFilter("sortBy", sortBy);
            }}
            style={{ borderRadius: "8px" }}
          >
            <Select.Option value="desc-createdAt">📅 Mới nhất</Select.Option>
            <Select.Option value="asc-createdAt">📅 Cũ nhất</Select.Option>
          </Select>
        </div>
      </div>
      <div className="table-container">
        <Table
          dataSource={campaigns?.data}
          columns={columns}
          loading={isFetching}
          scroll={{ x: 1600 }}
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

      <Pagination
        current={filters.page}
        pageSize={campaigns?.meta?.limit}
        total={campaigns?.meta?.total}
        onChange={(page, limit) => {
          handleChangeFilter("page", page);
          handleChangeFilter("limit", limit);
        }}
        align="end"
        showTotal={(total) => `Tổng ${total} chiến dịch`}
        style={{ marginTop: "16px" }}
      />

      <CampaignAnalysis
        visible={analysisVisible}
        loading={analysisLoading}
        data={analysisData}
        onClose={() => {
          setAnalysisVisible(false);
          setAnalysisData(null);
        }}
      />
    </ManageWrapper>
  );
};

export default Campaigns;
