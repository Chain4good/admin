import React, { useState } from "react";
import ManageWrapper from "@/components/ManageWrapper";
import { usePost } from "@/hooks/usePost";
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
  Select,
  Switch,
  Tag,
} from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { uploadFile } from "@/services/uploadService";
import { createPost, deletePost, updatePost } from "@/services/postService";
import { truncate } from "lodash";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Cookies from "js-cookie";

const Posts = () => {
  const { data: posts, refetch } = usePost();
  const { data: topics } = useTopic();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const editorConfig = {
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "|",
        "uploadImage", // Change from imageUpload to uploadImage
        "blockQuote",
        "insertTable",
        "undo",
        "redo",
      ],
    },
    image: {
      upload: {
        types: ["jpeg", "png", "gif", "jpg", "webp"],
      },
      toolbar: [
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "toggleImageCaption",
        "imageTextAlternative",
      ],
    },
  };

  const customUploadAdapter = (loader) => {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          loader.file.then(async (file) => {
            try {
              const response = await uploadFile(file);
              resolve({
                default: response.url,
              });
            } catch (error) {
              reject(error);
            }
          });
        });
      },
    };
  };

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return customUploadAdapter(loader);
    };
  }

  const handleUpload = async (file) => {
    try {
      setUploading(true);
      const response = await uploadFile(file);
      setImageUrl(response.url);
      form.setFieldValue("thumbnail", response.url);
      message.success("Tải ảnh lên thành công!");
    } catch (error) {
      message.error("Tải ảnh lên thất bại!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id, values);
        message.success("Cập nhật bài viết thành công!");
      } else {
        await createPost(values);
        message.success("Thêm bài viết thành công!");
      }
      setIsModalOpen(false);
      form.resetFields();
      setImageUrl("");
      setEditingPost(null);
      refetch();
    } catch (error) {
      message.error(
        editingPost ? "Cập nhật thất bại!" : "Thêm bài viết thất bại!"
      );
    }
  };

  const handleEdit = (record) => {
    setEditingPost(record);
    setImageUrl(record.thumbnail);
    form.setFieldsValue({
      title: record.title,
      content: record.content,
      thumbnail: record.thumbnail,
      topicId: record.topicId,
      published: record.published,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setImageUrl("");
    setEditingPost(null);
  };

  const handleImageUpload = (loader) => {
    return new Promise((resolve, reject) => {
      const file = loader.file;

      uploadFile(file)
        .then((response) => {
          resolve({ default: response.url });
        })
        .catch((error) => {
          reject(error);
        });
    });
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
          content: "Bạn có chắc chắn muốn xóa bài viết này?",
          okText: "Xóa",
          okType: "danger",
          cancelText: "Hủy",
          onOk: async () => {
            try {
              await deletePost(record.id);
              message.success("Xóa bài viết thành công!");
              refetch();
            } catch (error) {
              message.error("Xóa bài viết thất bại!");
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
      title: "Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: 120,
      render: (thumbnail) =>
        thumbnail ? (
          <Image src={thumbnail} alt="thumbnail" width={100} height={60} />
        ) : (
          "-"
        ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (title) => truncate(title, { length: 50 }),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      width: 300,
      render: (content) => (
        <div
          dangerouslySetInnerHTML={{
            __html: truncate(content, { length: 150, separator: " " }),
          }}
          className="prose prose-sm max-w-none"
        />
      ),
    },
    {
      title: "Chủ đề",
      dataIndex: ["topic", "name"],
      key: "topic",
    },
    {
      title: "Trạng thái",
      dataIndex: "published",
      key: "published",
      render: (published) => (
        <Tag color={published ? "success" : "default"}>
          {published ? "Đã xuất bản" : "Nháp"}
        </Tag>
      ),
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
  console.log(posts);

  return (
    <ManageWrapper
      title="Bài viết"
      subtitle="Quản lý tất cả bài viết"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ background: "#2563eb" }}
        >
          Thêm bài viết
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={posts?.data?.data || []}
        rowKey="id"
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingPost ? "Cập nhật bài viết" : "Thêm bài viết mới"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <CKEditor
              editor={ClassicEditor}
              config={{
                ...editorConfig,
                extraPlugins: [uploadPlugin],
              }}
              data={form.getFieldValue("content") || ""}
              onChange={(event, editor) => {
                const data = editor.getData();
                form.setFieldValue("content", data);
              }}
            />
          </Form.Item>

          <Form.Item name="thumbnail" label="Ảnh bìa">
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
                  alt="thumbnail"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
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

          <Form.Item
            name="topicId"
            label="Chủ đề"
            rules={[{ required: true, message: "Vui lòng chọn chủ đề!" }]}
          >
            <Select placeholder="Chọn chủ đề">
              {topics?.map((topic) => (
                <Select.Option key={topic.id} value={topic.id}>
                  {topic.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="published" label="Xuất bản" valuePropName="checked">
            <Switch />
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
              {editingPost ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </ManageWrapper>
  );
};

export default Posts;
