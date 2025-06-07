import ManageWrapper from "@/components/ManageWrapper";
import CampaignAnalysis from "@/components/CampaignAnalysis";
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
  Button,
  Dropdown,
  Input,
  message,
  Modal,
  Pagination,
  Select,
  Table,
  Tag,
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
      fixed: "left",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      width: 200,
      fixed: "left",
      render: (title) => <p>{truncate(title, { length: 20 })}</p>,
    },
    {
      title: "Chi tiết",
      dataIndex: "description",
      width: 200,
      render: (description) => <p>{truncate(description, { length: 20 })}</p>,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "createdAt",
      width: 150,
      render: (createdAt) => <p>{new Date(createdAt).toLocaleString()}</p>,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "deadline",
      width: 150,
      render: (deadline) => <p>{new Date(deadline).toLocaleString()}</p>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (status) => (
        <Tag color={CampaignStatusColor[status]}>{CampaignStatus[status]}</Tag>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: ["category", "name"],
      width: 150,
    },
    {
      title: "Mục tiêu (ETH)",
      dataIndex: "ethGoal",
      width: 120,
    },
    {
      title: "Mục tiêu (VND)",
      dataIndex: "goal",
      width: 150,
      render: (goal) => <p>{goal.toLocaleString()}</p>,
    },
    {
      title: "Người tạo",
      dataIndex: ["user", "name"],
      width: 150,
    },
    {
      title: "Hash",
      dataIndex: ["txHash"],
      width: 200,
      render: (txHash) => <p>{truncate(txHash, { length: 20 })}</p>,
    },
    {
      title: "Hình thức",
      dataIndex: ["fundraiseType", "name"],
      width: 150,
    },
    {
      title: "Số quyên góp",
      dataIndex: ["_count", "donations"],
      width: 120,
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 80,
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
    <ManageWrapper title="Chiến dịch" subtitle="Quản lý tất cả chiến dịch">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Input
          placeholder="Tìm kiếm theo tiêu đề"
          allowClear
          size="large"
          onChange={(e) => handleChangeFilter("search", e.target.value)}
        />

        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          size="large"
          onChange={(value) => handleChangeFilter("status", value)}
        >
          {Object.entries(CampaignStatus).map(([key, value]) => (
            <Select.Option key={key} value={key}>
              {value}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Lọc theo loại chiến dịch"
          allowClear
          size="large"
          onChange={(value) => handleChangeFilter("fundraiseTypeId", value)}
        >
          {fundraiseTypes?.map((type) => (
            <Select.Option key={type.id} value={type.id}>
              {type.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Lọc theo danh mục"
          allowClear
          size="large"
          onChange={(value) => handleChangeFilter("categoryId", value)}
        >
          {categories?.data?.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Sắp xếp theo"
          allowClear
          size="large"
          onChange={(value) => {
            const [sort, sortBy] = value.split("-");
            handleChangeFilter("sort", sort);
            handleChangeFilter("sortBy", sortBy);
          }}
        >
          <Select.Option value="desc-createdAt">Mới nhất</Select.Option>
          <Select.Option value="asc-createdAt">Cũ nhất</Select.Option>
        </Select>
      </div>
      <Table
        dataSource={campaigns?.data}
        columns={columns}
        loading={isFetching}
        scroll={{ x: 1500 }} // Enable horizontal scrolling
        rowKey="id"
        pagination={false}
      />

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
