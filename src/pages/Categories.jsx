import React, { useState } from "react";
import ManageWrapper from "../components/ManageWrapper";
import { useCategory } from "@/hooks/useCategory";
import {
  Image,
  Table,
  Dropdown,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
} from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { uploadFile } from "@/services/uploadService";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/services/categoryService";

const Categories = () => {
  const { data: categories, refetch } = useCategory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
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
      if (editingCategory) {
        // Update existing category
        await updateCategory(editingCategory.id, values);
        message.success("Cập nhật danh mục thành công!");
      } else {
        // Create new category
        await createCategory(values);
        message.success("Thêm danh mục thành công!");
      }
      setIsModalOpen(false);
      form.resetFields();
      setImageUrl("");
      setEditingCategory(null);
      refetch(); // Refresh the categories list
    } catch (error) {
      message.error(
        editingCategory ? "Cập nhật thất bại!" : "Thêm danh mục thất bại!"
      );
    }
  };

  const handleEdit = (record) => {
    setEditingCategory(record);
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
    setEditingCategory(null);
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
          await deleteCategory(record.id);
          message.success("Xóa danh mục thành công!");
          refetch(); // Refresh the categories list
        } catch (error) {
          message.error("Xóa danh mục thất bại!");
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
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      render: (icon) => (
        <Image preview src={icon} alt="icon" width={50} height={50} />
      ),
    },
    {
      title: "Tên danh mục",
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
      width: 160,
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
      title="Danh mục"
      subtitle="Quản lý tất cả danh mục"
      exportData={categories?.data || []}
      exportColumns={columns}
      exportFileName="danh_sach_danh_muc"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ background: "#2563eb" }}
        >
          Thêm danh mục
        </Button>
      }
    >
      <Table columns={columns} dataSource={categories?.data || []} />

      <Modal
        title={editingCategory ? "Cập nhật danh mục" : "Thêm danh mục mới"}
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
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea placeholder="Nhập mô tả" rows={4} />
          </Form.Item>

          <Form.Item
            name="icon"
            label="Icon"
            className="overflow-hidden"
            rules={[{ required: true, message: "Vui lòng tải lên icon!" }]}
          >
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
              {editingCategory ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </ManageWrapper>
  );
};

export default Categories;
