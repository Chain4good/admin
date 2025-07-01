import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Export data to Excel format
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {string} sheetName - Name of the worksheet
 */
export const exportToExcel = (data, filename = 'export', sheetName = 'Sheet1') => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Create blob and save file
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${filename}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

/**
 * Export data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 */
export const exportToCSV = (data, filename = 'export') => {
  try {
    // Convert data to CSV format
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csvData = XLSX.utils.sheet_to_csv(worksheet);
    
    // Create blob and save file
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return false;
  }
};

/**
 * Prepare data for export by flattening nested objects and formatting values
 * @param {Array} data - Raw data array
 * @param {Array} columns - Column configuration from Ant Design Table
 * @returns {Array} Formatted data ready for export
 */
export const prepareDataForExport = (data, columns) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(item => {
    const exportItem = {};
    
    columns.forEach(column => {
      if (column.dataIndex && column.title) {
        let value = item;
        
        // Handle nested dataIndex like ['topic', 'name']
        if (Array.isArray(column.dataIndex)) {
          column.dataIndex.forEach(key => {
            value = value?.[key];
          });
        } else {
          value = value?.[column.dataIndex];
        }
        
        // Format the value for export
        if (value !== null && value !== undefined) {
          // Handle different data types
          if (typeof value === 'object' && value.name) {
            exportItem[column.title] = value.name;
          } else if (typeof value === 'boolean') {
            exportItem[column.title] = value ? 'Có' : 'Không';
          } else if (typeof value === 'string' && value.includes('<')) {
            // Remove HTML tags for content fields
            exportItem[column.title] = value.replace(/<[^>]*>/g, '');
          } else {
            exportItem[column.title] = value;
          }
        } else {
          exportItem[column.title] = '';
        }
      }
    });
    
    return exportItem;
  });
};
