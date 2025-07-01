import React, { useState } from "react";
import ManageWrapper from "../components/ManageWrapper";
import { useCountry } from "@/hooks/useCountry";
import { Table, Dropdown, Button, Modal, Form, Input, message } from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import {
  createCountry,
  deleteCountry,
  updateCountry,
} from "@/services/countryService";

const Countries = () => {
  const { data: countries, refetch } = useCountry();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      if (editingCountry) {
        await updateCountry(editingCountry.id, values);
        message.success("Cập nhật quốc gia thành công!");
      } else {
        await createCountry(values);
        message.success("Thêm quốc gia thành công!");
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingCountry(null);
      refetch();
    } catch (error) {
      message.error(
        editingCountry ? "Cập nhật thất bại!" : "Thêm quốc gia thất bại!"
      );
    }
  };

  const handleEdit = (record) => {
    setEditingCountry(record);
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      phoneCode: record.phoneCode,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingCountry(null);
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
          await deleteCountry(record.id);
          message.success("Xóa quốc gia thành công!");
          refetch();
        } catch (error) {
          message.error("Xóa quốc gia thất bại!");
        }
      },
    },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên quốc gia",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mã quốc gia",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Mã điện thoại",
      dataIndex: "phoneCode",
      key: "phoneCode",
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
      title="Quốc gia"
      subtitle="Quản lý tất cả quốc gia"
      exportData={countries || []}
      exportColumns={columns}
      exportFileName="danh_sach_quoc_gia"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ background: "#2563eb" }}
        >
          Thêm quốc gia
        </Button>
      }
    >
      <Table columns={columns} dataSource={countries || []} />

      <Modal
        title={editingCountry ? "Cập nhật quốc gia" : "Thêm quốc gia mới"}
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
            label="Tên quốc gia"
            rules={[
              { required: true, message: "Vui lòng nhập tên quốc gia!" },
              {
                type: "string",
                min: 2,
                message: "Tên quốc gia phải từ 2 ký tự!",
              },
            ]}
          >
            <Input placeholder="Ví dụ: Việt Nam" />
          </Form.Item>

          <Form.Item
            name="code"
            label="Mã quốc gia"
            rules={[
              { required: true, message: "Vui lòng nhập mã quốc gia!" },
              {
                type: "string",
                len: 2,
                message: "Mã quốc gia phải đúng 2 ký tự!",
              },
              { pattern: /^[A-Z]+$/, message: "Chỉ chấp nhận chữ in hoa!" },
            ]}
          >
            <Input
              placeholder="Ví dụ: VN"
              style={{ textTransform: "uppercase" }}
            />
          </Form.Item>

          <Form.Item
            name="phoneCode"
            label="Mã điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập mã điện thoại!" },
              {
                pattern: /^\+\d+$/,
                message: "Mã điện thoại phải bắt đầu bằng + và chỉ chứa số!",
              },
            ]}
          >
            <Input placeholder="Ví dụ: +84" />
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
              {editingCountry ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </ManageWrapper>
  );
};

export default Countries;
