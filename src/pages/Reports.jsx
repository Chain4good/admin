import ManageWrapper from "@/components/ManageWrapper";
import { useReport } from "@/hooks/useReport";
import { Table } from "antd";
import React, { useState } from "react";

const Reports = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });
  const { data: reports } = useReport(filters);
  return (
    <ManageWrapper title={"Báo cáo"} subtitle={"Quản lý báo cáo"}>
      <Table
        dataSource={reports?.data || []}
        columns={[
          {
            title: "ID",
            dataIndex: "id",
            key: "id",
          },
          {
            title: "Nội dung",
            dataIndex: "content",
            key: "content",
          },
          {
            title: "Loại báo cáo",
            dataIndex: "type",
          },
          {
            title: "Trạng thái",
            dataIndex: "status",
          },
          {
            title: "Ngày tạo",
            dataIndex: "createdAt",
          },
          {
            title: "Chiến dịch",
            dataIndex: "campaign",
            render: (campaign) => {
              return campaign?.title;
            },
          },
          {
            title: "Hành động",
            key: "action",
            render: (text, record) => (
              <div>
                <a
                  onClick={() => {
                    console.log(record);
                  }}
                >
                  Chi tiết{" "}
                </a>
              </div>
            ),
          },
        ]}
      />
    </ManageWrapper>
  );
};

export default Reports;
