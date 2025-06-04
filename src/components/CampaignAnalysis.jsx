import React from "react";
import {
  Modal,
  Progress,
  Typography,
  List,
  Tag,
  Divider,
  Alert,
  Spin,
} from "antd";
import {
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const CampaignAnalysis = ({ data, loading, visible, onClose }) => {
  if (!data && !loading) return null;

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
        return "success";
      case "negative":
        return "error";
      case "neutral":
        return "warning";
      default:
        return "default";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#52c41a";
    if (score >= 60) return "#faad14";
    return "#f5222d";
  };

  return (
    <Modal
      title="Phân tích độ tin cậy chiến dịch"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Trust Score */}
          <div className="text-center">
            <Progress
              type="circle"
              percent={data?.trustScore}
              strokeColor={getScoreColor(data?.trustScore)}
              format={(percent) => (
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{percent}%</div>
                  <div className="text-sm text-gray-500">Độ tin cậy</div>
                </div>
              )}
            />
          </div>

          {/* Sentiment */}
          <div className="text-center">
            <Tag
              color={getSentimentColor(data?.sentiment)}
              style={{ padding: "4px 12px", fontSize: "14px" }}
            >
              Cảm xúc: {data?.sentiment}
            </Tag>
          </div>

          <Divider />

          {/* Credibility Factors */}
          <div>
            <Title level={5}>
              <CheckCircleOutlined className="mr-2 text-green-500" />
              Yếu tố đáng tin cậy
            </Title>
            <List
              dataSource={data?.credibilityFactors}
              renderItem={(item) => (
                <List.Item>
                  <Text className="text-green-600">• {item}</Text>
                </List.Item>
              )}
            />
          </div>

          {/* Risk Factors */}
          <div>
            <Title level={5}>
              <WarningOutlined className="mr-2 text-red-500" />
              Yếu tố rủi ro
            </Title>
            <List
              dataSource={data?.riskFactors}
              renderItem={(item) => (
                <List.Item>
                  <Text className="text-red-600">• {item}</Text>
                </List.Item>
              )}
            />
          </div>

          {/* Recommendations */}
          <div>
            <Title level={5}>
              <InfoCircleOutlined className="mr-2 text-blue-500" />
              Khuyến nghị
            </Title>
            <List
              dataSource={data?.recommendations}
              renderItem={(item) => (
                <List.Item>
                  <Text className="text-blue-600">• {item}</Text>
                </List.Item>
              )}
            />
          </div>

          <Alert
            message="Lưu ý"
            description="Đây là phân tích tự động dựa trên AI. Vui lòng xem xét kỹ và thực hiện thêm các bước xác minh khi cần thiết."
            type="warning"
            showIcon
          />
        </div>
      )}
    </Modal>
  );
};

export default CampaignAnalysis;
