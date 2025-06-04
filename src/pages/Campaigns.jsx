import ManageWrapper from "@/components/ManageWrapper";
import CampaignAnalysis from "@/components/CampaignAnalysis";
import { CampaignStatus, CampaignStatusColor } from "@/constants/status";
import { useCampaign } from "@/hooks/useCampaign";
import {
  checkOnChain,
  deleteCampaign,
  sendEmailToOwner,
  summarizeByAI,
  updateCampaignStatus,
  analyzeCampaignTrust,
} from "@/services/campaignService";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, message, Modal, Table, Tag } from "antd";
import { truncate } from "lodash";
import { useState } from "react";

const Campaigns = () => {
  const { data: campaigns, isFetching, refetch } = useCampaign();
  const [analysisVisible, setAnalysisVisible] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

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
      <Table
        dataSource={campaigns?.data}
        columns={columns}
        loading={isFetching}
        scroll={{ x: 1500 }} // Enable horizontal scrolling
        rowKey="id"
        pagination={{
          total: campaigns?.total,
          pageSize: campaigns?.per_page,
          current: campaigns?.current_page,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
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
