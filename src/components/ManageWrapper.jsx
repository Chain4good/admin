import React from "react";
import { Button, Dropdown, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import {
  exportToExcel,
  exportToCSV,
  prepareDataForExport,
} from "../utils/exportUtils";

const ManageWrapper = ({
  children,
  title,
  subtitle,
  icon,
  extra,
  exportData = null,
  exportColumns = null,
  exportFileName = null,
}) => {
  const handleExport = (format) => {
    if (!exportData || !exportColumns) {
      message.warning("Không có dữ liệu để xuất!");
      return;
    }

    const fileName =
      exportFileName || title?.toLowerCase().replace(/\s+/g, "_") || "export";
    const preparedData = prepareDataForExport(exportData, exportColumns);

    if (preparedData.length === 0) {
      message.warning("Không có dữ liệu để xuất!");
      return;
    }

    let success = false;
    if (format === "excel") {
      success = exportToExcel(preparedData, fileName, title || "Data");
    } else if (format === "csv") {
      success = exportToCSV(preparedData, fileName);
    }

    if (success) {
      message.success(`Xuất ${format.toUpperCase()} thành công!`);
    } else {
      message.error(`Xuất ${format.toUpperCase()} thất bại!`);
    }
  };

  const exportMenuItems = [
    {
      key: "excel",
      label: "Xuất Excel",
      onClick: () => handleExport("excel"),
    },
    {
      key: "csv",
      label: "Xuất CSV",
      onClick: () => handleExport("csv"),
    },
  ];

  const showExportButton = exportData && exportColumns && exportData.length > 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-500">{subtitle}</p>
        </div>
        <div className="flex gap-2 items-center">
          {showExportButton && (
            <Dropdown
              menu={{ items: exportMenuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button icon={<DownloadOutlined />} className="border-gray-300">
                Xuất dữ liệu
              </Button>
            </Dropdown>
          )}
          {extra}
        </div>
      </div>
      {children}
    </div>
  );
};

export default ManageWrapper;
