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
  requestAdditionalVerification,
} from "@/services/campaignService";
import {
  MoreOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
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
  Form,
  Space,
} from "antd";
import { truncate } from "lodash";
import { useState } from "react";

const { TextArea } = Input;

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

  // Additional verification modal state
  const [verificationVisible, setVerificationVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [verificationForm] = Form.useForm();

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
    } catch {
      message.error("Cập nhật trạng thái thất bại!");
    }
  };

  const handleRequestVerification = (campaign) => {
    setSelectedCampaign(campaign);
    setVerificationVisible(true);
    verificationForm.resetFields();
  };

  const handleVerificationSubmit = async (values) => {
    try {
      await requestAdditionalVerification(
        selectedCampaign.id,
        values.message,
        values.reason
      );
      message.success("Đã gửi yêu cầu xác minh bổ sung!");
      setVerificationVisible(false);
      verificationForm.resetFields();
      setSelectedCampaign(null);
      refetch();
    } catch {
      message.error("Gửi yêu cầu thất bại!");
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
        } catch {
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
    } catch {
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
    } catch {
      message.error("Không thể tạo tóm tắt!");
    }
  };

  const handleSendEmail = async (id, userEmail) => {
    try {
      await sendEmailToOwner(id, userEmail);
      message.success("Gửi email thành công!");
    } catch {
      message.error("Gửi email thất bại!");
    }
  };

  const handleAnalyze = async (id) => {
    try {
      setAnalysisVisible(true);
      setAnalysisLoading(true);
      const data = await analyzeCampaignTrust(id);
      setAnalysisData(data);
    } catch {
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
      key: "NEED_VERIFICATION",
      label: "Cần xác minh bổ sung",
      disabled: record.status === "NEED_VERIFICATION",
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
      label: "Xóa",
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
      render: (status, record) => (
        <Space direction="vertical" size="small">
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
          {status === "PENDING" && (
            <Button
              type="primary"
              size="small"
              icon={<ExclamationCircleOutlined />}
              onClick={() => handleRequestVerification(record)}
              className="verification-request-btn"
              style={{
                background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
                border: "none",
                fontSize: "11px",
                fontWeight: "500",
                borderRadius: "6px",
                boxShadow: "0 2px 4px rgba(249, 115, 22, 0.2)",
              }}
            >
              Yêu cầu xác minh bổ sung
            </Button>
          )}
          {status === "NEED_VERIFICATION" && record.verificationMessage && (
            <Tooltip title={record.verificationMessage}>
              <Text type="secondary" style={{ fontSize: "11px" }}>
                {truncate(record.verificationMessage, { length: 30 })}
              </Text>
            </Tooltip>
          )}
        </Space>
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
      render: (name) => (
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
        <Space>
          {record.status === "PENDING" && (
            <>
              <Tooltip title="Duyệt">
                <Button
                  type="text"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleStatusChange(record.id, "APPROVED")}
                  style={{ color: "#10B981" }}
                />
              </Tooltip>
              <Tooltip title="Từ chối">
                <Button
                  type="text"
                  size="small"
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleStatusChange(record.id, "REJECTED")}
                  style={{ color: "#EF4444" }}
                />
              </Tooltip>
            </>
          )}
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
        </Space>
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

      {/* Additional Verification Modal */}
      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: "#F97316" }} />
            <span>Yêu cầu xác minh bổ sung</span>
          </Space>
        }
        open={verificationVisible}
        onCancel={() => {
          setVerificationVisible(false);
          setSelectedCampaign(null);
          verificationForm.resetFields();
        }}
        footer={null}
        width={600}
        className="verification-modal"
      >
        {selectedCampaign && (
          <div className="campaign-info-section">
            <Typography.Text strong>Chiến dịch: </Typography.Text>
            <Typography.Text>{selectedCampaign.title}</Typography.Text>
            <br />
            <Typography.Text strong>Người tạo: </Typography.Text>
            <Typography.Text>{selectedCampaign.user?.email}</Typography.Text>
          </div>
        )}

        <Form
          form={verificationForm}
          layout="vertical"
          onFinish={handleVerificationSubmit}
        >
          <Form.Item name="reason" label="Lý do yêu cầu xác minh (tùy chọn)">
            <Select
              placeholder="Chọn lý do yêu cầu xác minh..."
              allowClear
              options={[
                {
                  value: "DOCUMENT_VERIFICATION",
                  label: "🗂️ Xác minh tài liệu",
                },
                {
                  value: "IDENTITY_VERIFICATION",
                  label: "👤 Xác minh danh tính",
                },
                {
                  value: "FINANCIAL_VERIFICATION",
                  label: "💰 Xác minh tài chính",
                },
                {
                  value: "BUSINESS_VERIFICATION",
                  label: "🏢 Xác minh doanh nghiệp",
                },
                { value: "PROJECT_DETAILS", label: "📋 Chi tiết dự án" },
                { value: "COMPLIANCE_CHECK", label: "✅ Kiểm tra tuân thủ" },
                { value: "OTHER", label: "🔍 Khác" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="message"
            label="Tin nhắn yêu cầu xác minh"
            rules={[
              { required: true, message: "Vui lòng nhập tin nhắn!" },
              { min: 10, message: "Tin nhắn phải có ít nhất 10 ký tự!" },
            ]}
          >
            <TextArea
              rows={6}
              placeholder="Nhập tin nhắn chi tiết về những thông tin cần được xác minh hoặc bổ sung thêm cho chiến dịch này..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button
                onClick={() => {
                  setVerificationVisible(false);
                  setSelectedCampaign(null);
                  verificationForm.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ background: "#F97316", borderColor: "#F97316" }}
              >
                Gửi yêu cầu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Campaign Analysis Modal */}
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
