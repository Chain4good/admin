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
  Card,
  Typography,
  Space,
  Avatar,
  Row,
  Col,
  Tooltip,
  Badge,
  Divider,
} from "antd";
import {
  MoreOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  UserOutlined,
  TagOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { uploadFile } from "@/services/uploadService";
import { createPost, deletePost, updatePost } from "@/services/postService";
import { truncate } from "lodash";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Cookies from "js-cookie";
import "../styles/dashboard.css";

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const Posts = () => {
  const { data: posts, refetch } = usePost();
  const { data: topics } = useTopic();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'table'

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
        "uploadImage",
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

  const handlePreview = (post) => {
    setPreviewPost(post);
    setIsPreviewOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setImageUrl("");
    setEditingPost(null);
  };

  const handleDelete = (record) => {
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
        } catch {
          message.error("Xóa bài viết thất bại!");
        }
      },
    });
  };

  const getItems = (record) => [
    {
      key: "preview",
      label: "Xem trước",
      icon: <EyeOutlined />,
      onClick: () => handlePreview(record),
    },
    {
      key: "edit",
      label: "Chỉnh sửa",
      icon: <EditOutlined />,
      onClick: () => handleEdit(record),
    },
    {
      key: "delete",
      label: "Xóa",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDelete(record),
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
          <Image
            src={thumbnail}
            alt="thumbnail"
            width={100}
            height={60}
            style={{ borderRadius: "8px" }}
          />
        ) : (
          <div className="w-[100px] h-[60px] bg-gray-100 rounded-lg flex items-center justify-center">
            <FileTextOutlined className="text-gray-400" />
          </div>
        ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (title) => (
        <Text strong className="text-gray-800">
          {truncate(title, { length: 50 })}
        </Text>
      ),
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
          className="prose prose-sm max-w-none text-gray-600"
        />
      ),
    },
    {
      title: "Chủ đề",
      dataIndex: ["topic", "name"],
      key: "topic",
      render: (topicName) => (
        <Tag className="post-category-tag">
          <TagOutlined className="mr-1" />
          {topicName}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "published",
      key: "published",
      render: (published) => (
        <Badge
          status={published ? "success" : "default"}
          text={published ? "Đã xuất bản" : "Nháp"}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem trước">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
              className="text-blue-500 hover:text-blue-700"
            />
          </Tooltip>
          <Dropdown
            menu={{ items: getItems(record) }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              className="text-gray-500 hover:text-gray-700"
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const renderCardView = () => {
    const postsData = posts?.data?.data || [];

    return (
      <Row gutter={[24, 24]}>
        {postsData.map((post) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={post.id}>
            <Card
              className="post-card h-full"
              hoverable
              cover={
                <div className="relative overflow-hidden">
                  {post.thumbnail ? (
                    <Image
                      alt={post.title}
                      src={post.thumbnail}
                      height={200}
                      width="100%"
                      style={{ objectFit: "cover" }}
                      preview={false}
                    />
                  ) : (
                    <div className="h-[200px] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                      <FileTextOutlined className="text-4xl text-gray-400" />
                    </div>
                  )}
                  <div className="post-image-overlay" />
                </div>
              }
              actions={[
                <Tooltip title="Xem trước">
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => handlePreview(post)}
                    className="post-preview-btn"
                  >
                    Xem trước
                  </Button>
                </Tooltip>,
                <Tooltip title="Chỉnh sửa">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(post)}
                    className="post-preview-btn"
                  >
                    Chỉnh sửa
                  </Button>
                </Tooltip>,
                <Dropdown
                  menu={{ items: getItems(post) }}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <Button
                    type="text"
                    icon={<MoreOutlined />}
                    className="post-preview-btn"
                  >
                    Khác
                  </Button>
                </Dropdown>,
              ]}
            >
              <div className="flex flex-col h-full">
                <div className="mb-3">
                  <Tag className="post-category-tag mb-2">
                    <TagOutlined className="mr-1" />
                    {post.topic?.name || "Chưa phân loại"}
                  </Tag>
                  <Badge
                    status={post.published ? "success" : "default"}
                    text={post.published ? "Đã xuất bản" : "Nháp"}
                    className="float-right"
                  />
                </div>

                <Title level={5} className="line-clamp-2 mb-2">
                  {post.title}
                </Title>

                <div
                  className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow"
                  dangerouslySetInnerHTML={{
                    __html: post.content
                      ? post.content.replace(/<[^>]*>/g, "")
                      : "",
                  }}
                />

                <div className="post-author border-t pt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Avatar size="small" icon={<UserOutlined />} />
                      <span>Admin</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarOutlined />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <ManageWrapper
      title="Quản lý bài viết"
      subtitle="Tạo và quản lý tất cả bài viết của bạn"
      exportData={posts?.data?.data || []}
      exportColumns={columns}
      exportFileName="danh_sach_bai_viet"
      extra={
        <Space>
          <Button.Group>
            <Tooltip title="Hiển thị dạng thẻ">
              <Button
                type={viewMode === "card" ? "primary" : "default"}
                icon={<AppstoreOutlined />}
                onClick={() => setViewMode("card")}
              />
            </Tooltip>
            <Tooltip title="Hiển thị dạng bảng">
              <Button
                type={viewMode === "table" ? "primary" : "default"}
                icon={<UnorderedListOutlined />}
                onClick={() => setViewMode("table")}
              />
            </Tooltip>
          </Button.Group>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 border-none hover:from-blue-600 hover:to-blue-700"
          >
            Thêm bài viết
          </Button>
        </Space>
      }
    >
      {viewMode === "card" ? (
        renderCardView()
      ) : (
        <Table
          columns={columns}
          dataSource={posts?.data?.data || []}
          rowKey="id"
          scroll={{ x: 1200 }}
          className="custom-table"
        />
      )}

      {/* Preview Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <EyeOutlined className="text-blue-500" />
            <span>Xem trước bài viết</span>
          </div>
        }
        open={isPreviewOpen}
        onCancel={() => setIsPreviewOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsPreviewOpen(false)}>
            Đóng
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setIsPreviewOpen(false);
              handleEdit(previewPost);
            }}
            className="bg-blue-500 border-blue-500"
          >
            Chỉnh sửa
          </Button>,
        ]}
        width={900}
        className="post-preview-modal"
      >
        {previewPost && (
          <div className="post-preview-content">
            {previewPost.thumbnail && (
              <div className="mb-6">
                <Image
                  src={previewPost.thumbnail}
                  alt={previewPost.title}
                  width="100%"
                  style={{
                    borderRadius: "12px",
                    maxHeight: "300px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            <div className="mb-4">
              <Space>
                <Tag className="post-category-tag">
                  <TagOutlined className="mr-1" />
                  {previewPost.topic?.name || "Chưa phân loại"}
                </Tag>
                <Badge
                  status={previewPost.published ? "success" : "default"}
                  text={previewPost.published ? "Đã xuất bản" : "Nháp"}
                />
              </Space>
            </div>

            <Title level={2} className="mb-4">
              {previewPost.title}
            </Title>

            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Avatar size="small" icon={<UserOutlined />} />
                <Text>Admin</Text>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <CalendarOutlined />
                <Text>
                  {new Date(previewPost.createdAt).toLocaleDateString("vi-VN")}
                </Text>
              </div>
            </div>

            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: previewPost.content }}
            />
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <FileTextOutlined className="text-blue-500" />
            <span>
              {editingPost ? "Cập nhật bài viết" : "Thêm bài viết mới"}
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={900}
        className="post-preview-modal"
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
            <Input
              placeholder="Nhập tiêu đề bài viết"
              className="rounded-lg"
              size="large"
            />
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="thumbnail"
                label="Ảnh bìa"
                className="overflow-hidden"
              >
                <Upload
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    handleUpload(file);
                    return false;
                  }}
                  className="w-full"
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt="thumbnail"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                      preview={false}
                    />
                  ) : (
                    <div className="w-full h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors">
                      {uploading ? (
                        <div>Đang tải...</div>
                      ) : (
                        <>
                          <PlusOutlined className="text-2xl mb-2" />
                          <div>Tải ảnh lên</div>
                        </>
                      )}
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="topicId"
                label="Chủ đề"
                rules={[{ required: true, message: "Vui lòng chọn chủ đề!" }]}
              >
                <Select
                  placeholder="Chọn chủ đề"
                  size="large"
                  className="rounded-lg"
                >
                  {topics?.map((topic) => (
                    <Select.Option key={topic.id} value={topic.id}>
                      {topic.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="published"
                label="Xuất bản"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Công khai"
                  unCheckedChildren="Nháp"
                  className="bg-gray-300"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={handleCancel} size="large">
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="bg-gradient-to-r from-blue-500 to-blue-600 border-none hover:from-blue-600 hover:to-blue-700"
              >
                {editingPost ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </ManageWrapper>
  );
};

export default Posts;
