import React, { useState } from "react";
import ManageWrapper from "@/components/ManageWrapper";
import { useTopic } from "@/hooks/useTopic";
import {
  Table,
  Dropdown,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Image,
} from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { uploadFile } from "@/services/uploadService";
import { createTopic, deleteTopic, updateTopic } from "@/services/topicService";

const Topics = () => {
  const { data: topics, refetch } = useTopic();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file) => {
    try {
      setUploading(true);
      const response = await uploadFile(file);
      setImageUrl(response.url);
      form.setFieldValue("icon", response.url);
      message.success("Tải ảnh lên thành công!");
    } catch (error) {
      message.error("Tải ảnh lên thất bại!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingTopic) {
        await updateTopic(editingTopic.id, values);
        message.success("Cập nhật chủ đề thành công!");
      } else {
        await createTopic(values);
        message.success("Thêm chủ đề thành công!");
      }
      setIsModalOpen(false);
      form.resetFields();
      setImageUrl("");
      setEditingTopic(null);
      refetch();
    } catch (error) {
      message.error(
        editingTopic ? "Cập nhật thất bại!" : "Thêm chủ đề thất bại!"
      );
    }
  };

  const handleEdit = (record) => {
    setEditingTopic(record);
    setImageUrl(record.icon);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      icon: record.icon,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setImageUrl("");
    setEditingTopic(null);
  };

  const getItems = (record) => [
    {
      key: "edit",
      label: "Chỉnh sửa",
      onClick: () => handleEdit(record),
    },
    {
      key: "delete",
      label: "Xóa",
      danger: true,
      onClick: async () => {
        Modal.confirm({
          title: "Xác nhận xóa",
          content: "Bạn có chắc chắn muốn xóa chủ đề này?",
          okText: "Xóa",
          okType: "danger",
          cancelText: "Hủy",
          onOk: async () => {
            try {
              await deleteTopic(record.id);
              message.success("Xóa chủ đề thành công!");
              refetch();
            } catch (error) {
              message.error("Xóa chủ đề thất bại!");
            }
          },
        });
      },
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
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      width: 100,
      render: (icon) =>
        icon ? <Image src={icon} alt="icon" width={50} height={50} /> : "-",
    },
    {
      title: "Tên chủ đề",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
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
      title="Chủ đề"
      subtitle="Quản lý tất cả chủ đề"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ background: "#2563eb" }}
        >
          Thêm chủ đề
        </Button>
      }
    >
      <Table columns={columns} dataSource={topics || []} rowKey="id" />

      <Modal
        title={editingTopic ? "Cập nhật chủ đề" : "Thêm chủ đề mới"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Tên chủ đề"
            rules={[{ required: true, message: "Vui lòng nhập tên chủ đề!" }]}
          >
            <Input placeholder="Nhập tên chủ đề" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea placeholder="Nhập mô tả" rows={4} />
          </Form.Item>

          <Form.Item name="icon" label="Icon" className="overflow-hidden">
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={(file) => {
                handleUpload(file);
                return false;
              }}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="icon"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  preview={false}
                />
              ) : (
                <div>
                  {uploading ? "Đang tải..." : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Tải ảnh</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <Button onClick={handleCancel} className="mr-2">
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: "#2563eb" }}
            >
              {editingTopic ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </ManageWrapper>
  );
};

export default Topics;
