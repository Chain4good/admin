import React, { useState } from "react";
import ManageWrapper from "../components/ManageWrapper";
import { useFundraiseType } from "@/hooks/useFundraiseType";
import { Table, Dropdown, Button, Modal, Form, Input, message } from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import {
  createFundraiseType,
  deleteFundraiseType,
  updateFundraiseType,
} from "@/services/fundraiseTypeService";

const FundraiseTypes = () => {
  const { data: fundraiseTypes, refetch } = useFundraiseType();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      if (editingType) {
        await updateFundraiseType(editingType.id, values);
        message.success("Cập nhật loại chiến dịch thành công!");
      } else {
        await createFundraiseType(values);
        message.success("Thêm loại chiến dịch thành công!");
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingType(null);
      refetch();
    } catch (error) {
      message.error(
        editingType ? "Cập nhật thất bại!" : "Thêm loại chiến dịch thất bại!"
      );
    }
  };

  const handleEdit = (record) => {
    setEditingType(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingType(null);
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
        try {
          await deleteFundraiseType(record.id);
          message.success("Xóa loại chiến dịch thành công!");
          refetch();
        } catch (error) {
          message.error("Xóa loại chiến dịch thất bại!");
        }
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
      title: "Tên loại chiến dịch",
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
    <ManageWrapper
      title="Loại chiến dịch"
      subtitle="Quản lý tất cả loại chiến dịch"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ background: "#2563eb" }}
        >
          Thêm loại chiến dịch
        </Button>
      }
    >
      <Table columns={columns} dataSource={fundraiseTypes || []} />

      <Modal
        title={
          editingType ? "Cập nhật loại chiến dịch" : "Thêm loại chiến dịch mới"
        }
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
            label="Tên loại chiến dịch"
            rules={[
              { required: true, message: "Vui lòng nhập tên loại chiến dịch!" },
              {
                type: "string",
                min: 2,
                message: "Tên phải từ 2 ký tự trở lên!",
              },
            ]}
          >
            <Input placeholder="Nhập tên loại chiến dịch" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea placeholder="Nhập mô tả" rows={4} />
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
              {editingType ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </ManageWrapper>
  );
};

export default FundraiseTypes;
