import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  Box,
  Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useGetMainProjectsQuery } from "../../api/users/projectApi";
import { useGetDrawingsByProjectIdQuery } from "../../api/masterdesign/masterDesign";
import FormatDateAndTime from "../../utils/dateUtils";
import DrawingDocumentUploadDialog from "./DocumentUploadModal";
import DrawingDocumentViewModal from "./DesignViewModal";
import DrawingApprovalModal from "./DesignApproveModal";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AssignUserModal from "../../components/pages/design/AssignUserModal";
import UserNotiModal from "../../components/pages/design/UserNotiModal";
import ViewUserModal from "../../components/pages/design/ViewUserModal";
import DesignDocumentsGraph from "./DesignDocumentsGraph";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from 'xlsx'; // Add this import
import ExcelJS from 'exceljs';

function DesignDocumentsPage() {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [assignUserModalOpen, setAssignUserModalOpen] = useState(false);
  const [filteredDrawings, setFilteredDrawings] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [notiModalOpen, setNotiModalOpen] = useState(false);
  const [viewUserModalOpen, setViewUserModalOpen] = useState(false);

  // Fetch projects
  const { data: projects, error: projectsError, isLoading: isLoadingProjects } = useGetMainProjectsQuery();
  // Fetch drawings based on selected project ID
  const { data: drawings, error: drawingsError, isLoading: isLoadingDrawings, refetch } = useGetDrawingsByProjectIdQuery(selectedProjectId, {
    skip: !selectedProjectId, // Prevents fetching until a project is selected
  });

  
const createChartImage = (statusCounts, totalDocuments) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    // Chart colors
    const colors = {
      'Approved': '#10B981',
      'Commented': '#F59E0B', 
      'New': '#6B7280',
      'Submitted': '#3B82F6',
      'Unknown': '#EF4444'
    };

    // Calculate angles for pie slices
    const data = Object.entries(statusCounts);
    let currentAngle = -Math.PI / 2; // Start at top
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 120;

    // Clear canvas with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pie slices
    data.forEach(([status, count]) => {
      const sliceAngle = (count / totalDocuments) * 2 * Math.PI;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[status] || '#6B7280';
      ctx.fill();
      
      // Draw slice border
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add percentage labels
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
      const percentage = ((count / totalDocuments) * 100).toFixed(1);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${percentage}%`, labelX, labelY);

      currentAngle += sliceAngle;
    });

    // Add title
    ctx.fillStyle = '#29346B';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Document Approval Status', centerX, 30);

    // Add legend
    let legendY = centerY + radius + 40;
    data.forEach(([status, count]) => {
      const percentage = ((count / totalDocuments) * 100).toFixed(1);
      
      // Legend color box
      ctx.fillStyle = colors[status] || '#6B7280';
      ctx.fillRect(50, legendY - 8, 16, 16);
      
      // Legend text
      ctx.fillStyle = '#333333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`${status}: ${count} (${percentage}%)`, 75, legendY);
      
      legendY += 25;
    });

    // Convert to base64
    const base64Image = canvas.toDataURL('image/png');
    resolve(base64Image);
  });
};

const exportToExcelWithCharts = async (filteredDrawings, projects, selectedProjectId) => {
  if (!filteredDrawings || filteredDrawings.length === 0) {
    alert("No data to export");
    return;
  }

  const getApprovalStatusText = (status) => {
    switch (status) {
      case "A": return "Approved";
      case "C": return "Commented";
      case "N": return "New";
      case "submitted": return "Submitted";
      default: return status || "Unknown";
    }
  };

  // Status color mapping for Excel styling
  const statusColors = {
    'Approved': '10B981',     // Green
    'Commented': 'F59E0B',    // Orange
    'New': '6366F1',          // Indigo
    'Submitted': '3B82F6',    // Blue
    'Unknown': 'EF4444'       // Red
  };

  const statusCounts = {};
  filteredDrawings.forEach(drawing => {
    const status = getApprovalStatusText(drawing.approval_status);
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  try {
    // Use original chart function
    const chartImageBase64 = await createChartImage(statusCounts, filteredDrawings.length);
    const workbook = new ExcelJS.Workbook();

    // 1. ENHANCED MAIN DATA SHEET
    const dataSheet = workbook.addWorksheet('📊 Design Documents Data');
    
    const excelData = filteredDrawings.map((drawing, index) => [
      index + 1,
      drawing.drawing_number || '',
      drawing.auto_drawing_number || 'N/A',
      drawing.name_of_drawing || '',
      drawing.discipline || '',
      drawing.block || '',
      drawing.drawing_category || '',
      drawing.type_of_approval || '',
      getApprovalStatusText(drawing.approval_status),
      drawing.is_approved ? 'Yes' : 'No',
      drawing.is_commented ? 'Yes' : 'No',
      drawing.is_submitted ? 'Yes' : 'No',
      drawing.commented_count || 0,
      drawing.submitted_count || 0,
      FormatDateAndTime(new Date(drawing.updated_at), "dd/MM/yyyy HH:mm"),
      drawing.project_name || '',
      drawing.user_full_name || '',
      drawing.version_number || '',
      (drawing.drawing_and_design_attachments && drawing.drawing_and_design_attachments.length > 0) ? 'Yes' : 'No'
    ]);

    const headers = [
      'Sr. No.', 'Drawing Number', 'Auto Drawing Number', 'Name of Drawing',
      'Discipline', 'Block', 'Drawing Category', 'Type of Approval',
      'Approval Status', 'Is Approved', 'Is Commented', 'Is Submitted',
      'Commented Count', 'Submitted Count', 'Updated At', 'Project Name',
      'User Full Name', 'Version Number', 'Has Attachments'
    ];

    dataSheet.addRow(headers);
    excelData.forEach(row => dataSheet.addRow(row));

    // 🎨 ENHANCED HEADER STYLING
    const headerRow = dataSheet.getRow(1);
    headerRow.height = 30;
    headerRow.font = { 
      bold: true, 
      color: { argb: 'FFFFFF' }, 
      size: 11,
      name: 'Segoe UI'
    };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1E293B' } // Dark slate
    };
    headerRow.alignment = { 
      horizontal: 'center', 
      vertical: 'middle',
      wrapText: true
    };

    // Add borders to header
    headerRow.eachCell(cell => {
      cell.border = {
        top: { style: 'thick', color: { argb: '374151' } },
        left: { style: 'thick', color: { argb: '374151' } },
        bottom: { style: 'thick', color: { argb: '374151' } },
        right: { style: 'thick', color: { argb: '374151' } }
      };
    });

    // 🎨 ENHANCED DATA ROWS STYLING
    for (let i = 2; i <= excelData.length + 1; i++) {
      const row = dataSheet.getRow(i);
      const approvalStatus = row.getCell(9).value; // Approval Status column
      
      // Alternating row colors
      const isEvenRow = (i - 2) % 2 === 0;
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEvenRow ? 'F8FAFC' : 'FFFFFF' }
      };

      // 🎯 COLOR-CODE APPROVAL STATUS CELL
      const statusCell = row.getCell(9);
      if (statusColors[approvalStatus]) {
        statusCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: statusColors[approvalStatus] + '30' } // Light version (30% opacity)
        };
        statusCell.font = {
          bold: true,
          color: { argb: statusColors[approvalStatus] },
          size: 10
        };
        statusCell.alignment = { horizontal: 'center', vertical: 'middle' };
        statusCell.border = {
          top: { style: 'medium', color: { argb: statusColors[approvalStatus] } },
          left: { style: 'medium', color: { argb: statusColors[approvalStatus] } },
          bottom: { style: 'medium', color: { argb: statusColors[approvalStatus] } },
          right: { style: 'medium', color: { argb: statusColors[approvalStatus] } }
        };
      }

      // 📊 STYLE NUMERICAL COLUMNS
      const numericalColumns = [1, 13, 14, 18]; // Sr. No., Commented Count, Submitted Count, Version Number
      numericalColumns.forEach(colIndex => {
        const cell = row.getCell(colIndex);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EFF6FF' } // Light blue for numbers
        };
        cell.font = {
          bold: true,
          color: { argb: '1E40AF' },
          size: 10
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin', color: { argb: '3B82F6' } },
          left: { style: 'thin', color: { argb: '3B82F6' } },
          bottom: { style: 'thin', color: { argb: '3B82F6' } },
          right: { style: 'thin', color: { argb: '3B82F6' } }
        };
      });

      // ✅❌ STYLE YES/NO COLUMNS
      const booleanColumns = [10, 11, 12, 19]; // Is Approved, Is Commented, Is Submitted, Has Attachments
      booleanColumns.forEach(colIndex => {
        const cell = row.getCell(colIndex);
        const value = cell.value;
        
        if (value === 'Yes') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'DCFCE7' } // Light green
          };
          cell.font = {
            bold: true,
            color: { argb: '166534' },
            size: 10
          };
          cell.border = {
            top: { style: 'medium', color: { argb: '10B981' } },
            left: { style: 'medium', color: { argb: '10B981' } },
            bottom: { style: 'medium', color: { argb: '10B981' } },
            right: { style: 'medium', color: { argb: '10B981' } }
          };
        } else if (value === 'No') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FEF2F2' } // Light red
          };
          cell.font = {
            bold: true,
            color: { argb: 'DC2626' },
            size: 10
          };
          cell.border = {
            top: { style: 'medium', color: { argb: 'EF4444' } },
            left: { style: 'medium', color: { argb: 'EF4444' } },
            bottom: { style: 'medium', color: { argb: 'EF4444' } },
            right: { style: 'medium', color: { argb: 'EF4444' } }
          };
        }
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      // 🎨 STYLE TEXT COLUMNS (Drawing Number, Name, etc.)
      const textColumns = [2, 3, 4, 5, 6, 7, 8, 15, 16, 17]; 
      textColumns.forEach(colIndex => {
        const cell = row.getCell(colIndex);
        cell.font = { size: 9, name: 'Segoe UI' };
        cell.alignment = { 
          horizontal: colIndex === 4 ? 'left' : 'center', // Name of Drawing left-aligned
          vertical: 'middle',
          wrapText: true
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'E2E8F0' } },
          left: { style: 'thin', color: { argb: 'E2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
          right: { style: 'thin', color: { argb: 'E2E8F0' } }
        };
      });

      // 📅 STYLE DATE COLUMN
      const dateCell = row.getCell(15); // Updated At
      dateCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FEF3C7' } // Light yellow
      };
      dateCell.font = {
        bold: true,
        color: { argb: 'D97706' },
        size: 9
      };
      dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
    }

    // Set column widths
    const columnWidths = [8, 25, 20, 40, 12, 10, 20, 15, 18, 12, 12, 12, 15, 15, 20, 25, 20, 15, 15];
    columnWidths.forEach((width, index) => {
      dataSheet.getColumn(index + 1).width = width;
    });

    // 2. ENHANCED CHART DATA SHEET
    const chartDataSheet = workbook.addWorksheet('📈 Chart Data');
    chartDataSheet.addRow(['Approval Status', 'Count', 'Percentage']);
    
    Object.entries(statusCounts).forEach(([status, count]) => {
      const percentage = ((count / filteredDrawings.length) * 100).toFixed(1);
      chartDataSheet.addRow([status, count, `${percentage}%`]);
    });

    // Style chart data sheet header
    const chartHeaderRow = chartDataSheet.getRow(1);
    chartHeaderRow.height = 25;
    chartHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' }, size: 12 };
    chartHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '059669' } // Green theme
    };
    chartHeaderRow.alignment = { horizontal: 'center', vertical: 'middle' };

    // Style chart data rows
    for (let i = 2; i <= Object.keys(statusCounts).length + 1; i++) {
      const row = chartDataSheet.getRow(i);
      const status = row.getCell(1).value;
      
      // Color-code status column
      if (statusColors[status]) {
        row.getCell(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: statusColors[status] + '40' }
        };
        row.getCell(1).font = {
          bold: true,
          color: { argb: statusColors[status] }
        };
      }
      
      // Style count column
      row.getCell(2).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'EFF6FF' }
      };
      row.getCell(2).font = { bold: true, color: { argb: '1E40AF' } };
      row.getCell(2).alignment = { horizontal: 'center' };
      
      // Style percentage column
      row.getCell(3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F0FDF4' }
      };
      row.getCell(3).font = { bold: true, color: { argb: '166534' } };
      row.getCell(3).alignment = { horizontal: 'center' };
    }

    chartDataSheet.getColumn(1).width = 20;
    chartDataSheet.getColumn(2).width = 12;
    chartDataSheet.getColumn(3).width = 15;

    // 3. ENHANCED CHARTS & ANALYSIS SHEET
    const chartsSheet = workbook.addWorksheet('📊 Charts & Analysis');
    
    const selectedProject = projects?.data?.find((project) => project.id === selectedProjectId);
    
    // Enhanced title
    chartsSheet.getCell('A1').value = '🎯 Design Documents Analysis Dashboard';
    chartsSheet.getCell('A1').font = { 
      size: 20, 
      bold: true, 
      color: { argb: 'FFFFFF' },
      name: 'Segoe UI'
    };
    chartsSheet.mergeCells('A1:P1');
    chartsSheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    chartsSheet.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1E293B' }
    };
    chartsSheet.getRow(1).height = 35;

    // Project info
    chartsSheet.getCell('A3').value = `🏢 Project: ${selectedProject?.project_name || 'Unknown'}`;
    chartsSheet.getCell('A3').font = { size: 14, bold: true, color: { argb: '1E293B' } };
    chartsSheet.getCell('A3').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'DBEAFE' }
    };

    chartsSheet.getCell('A4').value = `📊 Total Documents: ${filteredDrawings.length}`;
    chartsSheet.getCell('A4').font = { size: 12, bold: true, color: { argb: '059669' } };
    chartsSheet.getCell('A4').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'DCFCE7' }
    };

    chartsSheet.getCell('A5').value = `📅 Report Generated: ${new Date().toLocaleDateString()}`;
    chartsSheet.getCell('A5').font = { size: 10, italic: true, color: { argb: '6B7280' } };

    // Add chart image
    const imageId = workbook.addImage({
      base64: chartImageBase64,
      extension: 'png',
    });

    chartsSheet.addImage(imageId, {
      tl: { col: 0, row: 6 },
      br: { col: 8, row: 26 }
    });

    // Enhanced statistics table
    chartsSheet.getCell('J7').value = '📊 Summary Statistics';
    chartsSheet.getCell('J7').font = { size: 16, bold: true, color: { argb: 'FFFFFF' } };
    chartsSheet.getCell('J7').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '3B82F6' }
    };
    chartsSheet.mergeCells('J7:M7');
    chartsSheet.getCell('J7').alignment = { horizontal: 'center', vertical: 'middle' };
    
    let statRow = 9;
    ['Status', 'Count', 'Percentage', 'Progress'].forEach((header, index) => {
      const cell = chartsSheet.getCell(String.fromCharCode(74 + index) + statRow); // J, K, L, M
      cell.value = header;
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '374151' }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    statRow++;
    Object.entries(statusCounts).forEach(([status, count]) => {
      const percentage = ((count / filteredDrawings.length) * 100).toFixed(1);
      const progressBars = Math.round(percentage / 5);
      const progressBar = '█'.repeat(progressBars) + '░'.repeat(20 - progressBars);
      
      // Status cell
      const statusCell = chartsSheet.getCell(`J${statRow}`);
      statusCell.value = status;
      statusCell.font = { bold: true, color: { argb: statusColors[status] } };
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: statusColors[status] + '30' }
      };
      
      // Count cell
      const countCell = chartsSheet.getCell(`K${statRow}`);
      countCell.value = count;
      countCell.font = { bold: true, color: { argb: '1E40AF' } };
      countCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'EFF6FF' }
      };
      countCell.alignment = { horizontal: 'center' };
      
      // Percentage cell
      const percentCell = chartsSheet.getCell(`L${statRow}`);
      percentCell.value = `${percentage}%`;
      percentCell.font = { bold: true, color: { argb: '059669' } };
      percentCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'DCFCE7' }
      };
      percentCell.alignment = { horizontal: 'center' };
      
      // Progress bar cell
      const progressCell = chartsSheet.getCell(`M${statRow}`);
      progressCell.value = progressBar;
      progressCell.font = { color: { argb: statusColors[status] } };
      progressCell.alignment = { horizontal: 'left' };
      
      statRow++;
    });

    // Key insights
    const insights = [
      `🏆 Most Common: ${Object.entries(statusCounts).sort((a, b) => b[1] - a[1])[0][0]}`,
      `✅ Approval Rate: ${statusCounts['Approved'] ? ((statusCounts['Approved'] / filteredDrawings.length) * 100).toFixed(1) : 0}%`,
      `⏳ Pending: ${(statusCounts['New'] || 0) + (statusCounts['Submitted'] || 0)} documents`,
      `💬 Commented: ${statusCounts['Commented'] || 0} documents`
    ];

    chartsSheet.getCell('J28').value = '🔍 Key Insights';
    chartsSheet.getCell('J28').font = { size: 16, bold: true, color: { argb: 'FFFFFF' } };
    chartsSheet.getCell('J28').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'DC2626' }
    };
    chartsSheet.mergeCells('J28:M28');
    chartsSheet.getCell('J28').alignment = { horizontal: 'center', vertical: 'middle' };
    
    insights.forEach((insight, index) => {
      const cell = chartsSheet.getCell(`J${30 + index}`);
      cell.value = insight;
      cell.font = { size: 11, bold: true };
      
      // Color code insights
      if (insight.includes('Approval Rate')) {
        cell.font.color = { argb: '059669' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCFCE7' } };
      } else if (insight.includes('Pending')) {
        cell.font.color = { argb: 'D97706' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF3C7' } };
      } else if (insight.includes('Commented')) {
        cell.font.color = { argb: 'DC2626' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } };
      } else {
        cell.font.color = { argb: '1E40AF' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DBEAFE' } };
      }
    });

    // Set column widths
    ['J', 'K', 'L', 'M'].forEach((col, index) => {
      const widths = [25, 12, 15, 25];
      chartsSheet.getColumn(col).width = widths[index];
    });

    // Generate filename
    const projectName = selectedProject?.project_name || 'Project';
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `${projectName}_Enhanced_Analysis_${currentDate}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error creating enhanced Excel:', error);
    alert('Error creating Excel file. Please try again.');
  }
};

const exportToExcel = () => {
  exportToExcelWithCharts(filteredDrawings, projects, selectedProjectId);
};

  // Helper function to get approval status text
  // const getApprovalStatusText = (status) => {
  //   switch (status) {
  //     case "A": return "Approved";
  //     case "C": return "Commented";
  //     case "N": return "New";
  //     case "submitted": return "Submitted";
  //     default: return status || "Unknown";
  //   }
  // };


  // Apply filters, search, and sort whenever relevant state changes
  useEffect(() => {
    if (!drawings?.data) {
      setFilteredDrawings([]);
      return;
    }

    let result = [...drawings.data];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(drawing =>
        drawing.drawing_number.toLowerCase().includes(searchLower) ||
        drawing.name_of_drawing.toLowerCase().includes(searchLower)
      );
    }

    // Apply approval status filter
    if (filterStatus !== "all") {
      result = result.filter(drawing => drawing.approval_status === filterStatus);
    }

    // Apply sort option
    if (sortOption === "upload") {
      result.sort((a, b) => {
        if ((!a.drawing_and_design_attachments || a.drawing_and_design_attachments.length === 0) &&
          (b.drawing_and_design_attachments && b.drawing_and_design_attachments.length > 0)) {
          return -1;
        }
        if ((!b.drawing_and_design_attachments || b.drawing_and_design_attachments.length === 0) &&
          (a.drawing_and_design_attachments && a.drawing_and_design_attachments.length > 0)) {
          return 1;
        }
        return 0;
      });
    } else if (sortOption === "view") {
      result.sort((a, b) => {
        if ((a.drawing_and_design_attachments && a.drawing_and_design_attachments.length > 0) &&
          (!b.drawing_and_design_attachments || b.drawing_and_design_attachments.length === 0)) {
          return -1;
        }
        if ((b.drawing_and_design_attachments && b.drawing_and_design_attachments.length > 0) &&
          (!a.drawing_and_design_attachments || a.drawing_and_design_attachments.length === 0)) {
          return 1;
        }
        return 0;
      });
    }

    setFilteredDrawings(result);
  }, [drawings, searchTerm, sortOption, filterStatus]);

  const handleUpload = (drawing) => {
    setSelectedDrawing(drawing);
    setUploadModalOpen(true);
  };

  const handleUploadClose = () => {
    setSelectedDrawing(null);
    setUploadModalOpen(false);
  };

  // Project-level user action handlers
  const handleProjectAssignUser = () => {
    setAssignUserModalOpen(true);
  };

  const handleCloseAssignUserModal = () => {
    setAssignUserModalOpen(false);
  };

  const handleProjectViewAssignedUsers = () => {
    setViewUserModalOpen(true);
  };

  const handleCloseViewAssignedModal = () => {
    setViewUserModalOpen(false);
  };

  const handleProjectSendNotification = () => {
    setNotiModalOpen(true);
  };

  const handleCloseSendNotification = () => {
    setNotiModalOpen(false);
  };

  const handleOpenViewModal = () => {
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
  };

  const handleView = (drawing) => {
    setSelectedDrawing(drawing);
    handleOpenViewModal();
  };

  const handleOpenApprovalModal = (drawing) => {
    setSelectedDrawing(drawing);
    setApprovalModalOpen(true);
  };

  const handleCloseApprovalModal = () => {
    setApprovalModalOpen(false);
    setSelectedDrawing(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return FormatDateAndTime(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch (error) {
      return dateString;
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setSortOption("all");
    setFilterStatus("all");
  };

  // Get selected project details for project-level actions
  const selectedProject = projects?.data?.find((project) => project.id === selectedProjectId);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          
          {/* Header Section - Simple and Responsive */}
          <div className="px-4 sm:px-6 lg:px-8 py-6 text-center border-b border-gray-200">
            <h2 className="text-xl sm:text-2xl text-[#29346B] font-semibold">
              Design Documents Section
            </h2>
          </div>

          {/* Project Selection Section */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-2xl mx-auto">
              <label className="block mb-3 text-[#29346B] text-base sm:text-lg font-semibold">
                Select Project <span className="text-red-600">*</span>
              </label>
              {isLoadingProjects ? (
                <div className="flex items-center gap-2">
                  <CircularProgress size={20} />
                  <span className="text-sm text-gray-600">Loading projects...</span>
                </div>
              ) : projectsError ? (
                <Alert severity="error">Error fetching projects</Alert>
              ) : (
                <Autocomplete
                  options={projects?.data || []}
                  getOptionLabel={(option) => option.project_name}
                  value={projects?.data?.find((project) => project.id === selectedProjectId) || null}
                  onChange={(event, newValue) => {
                    setSelectedProjectId(newValue?.id || "");
                    clearFilters();
                  }}
                  fullWidth
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Select Project"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          border: "1px solid #FACC15",
                          borderBottom: "4px solid #FACC15",
                          borderRadius: "6px",
                        },
                        "& .MuiOutlinedInput-root.Mui-focused": {
                          border: "2px solid #FACC15",
                          borderRadius: "4px",
                        },
                        "& .MuiInputBase-input": {
                          fontSize: { xs: '14px', sm: '16px' }
                        }
                      }}
                    />
                  )}
                />
              )}
            </div>
          </div>

          {/* Content Section */}
          {selectedProjectId && (
            <div className="px-4 sm:px-6 lg:px-8 pb-6">
              {/* Graph Component */}
              <div className="mb-6">
                <DesignDocumentsGraph projectID={selectedProjectId}/>
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-[#29346B] mb-4">
                List of Drawings:
              </h3>
                {filteredDrawings.length > 0 && (
                  <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={exportToExcel}
                    sx={{
                      bgcolor: "#10B981",
                      color: "white",
                      fontSize: { xs: '12px', sm: '14px' },
                      padding: { xs: '6px 12px', sm: '8px 16px' },
                      "&:hover": { bgcolor: "#0ea271" }
                    }}
                  >
                    Export to Excel
                  </Button>
                )}
              {/* Search and Filter Controls */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                {/* Search Bar */}
                <div className="mb-4">
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by drawing number or name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "6px",
                        backgroundColor: "white"
                      },
                      "& .MuiInputBase-input": {
                        fontSize: { xs: '14px', sm: '16px' }
                      }
                    }}
                  />
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  {/* Sort Option */}
                  <FormControl fullWidth>
                    <InputLabel 
                      id="sort-label"
                      sx={{ fontSize: { xs: '14px', sm: '16px' } }}
                    >
                      Sort By
                    </InputLabel>
                    <Select
                      labelId="sort-label"
                      value={sortOption}
                      label="Sort By"
                      onChange={(e) => setSortOption(e.target.value)}
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        "& .MuiSelect-select": {
                          fontSize: { xs: '14px', sm: '16px' }
                        }
                      }}
                    >
                      <MenuItem value="all">All Drawings</MenuItem>
                      <MenuItem value="upload">Need Upload First</MenuItem>
                      <MenuItem value="view">Can View First</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Filter by Status */}
                  <FormControl fullWidth>
                    <InputLabel 
                      id="status-filter-label"
                      sx={{ fontSize: { xs: '14px', sm: '16px' } }}
                    >
                      Filter Status
                    </InputLabel>
                    <Select
                      labelId="status-filter-label"
                      value={filterStatus}
                      label="Filter Status"
                      onChange={(e) => setFilterStatus(e.target.value)}
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        "& .MuiSelect-select": {
                          fontSize: { xs: '14px', sm: '16px' }
                        }
                      }}
                    >
                      <MenuItem value="all">All Statuses</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="commented">Commented</MenuItem>
                      <MenuItem value="N">New</MenuItem>
                      <MenuItem value="submitted">Submitted</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Clear Filters Button */}
                  <Button
                    variant="outlined"
                    onClick={clearFilters}
                    fullWidth
                    sx={{
                      borderColor: "#29346B",
                      color: "#29346B",
                      fontSize: { xs: '14px', sm: '16px' },
                      padding: { xs: '8px 16px', sm: '6px 16px' },
                      "&:hover": { 
                        borderColor: "#1e2756", 
                        backgroundColor: "#f0f0f0" 
                      }
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>

                {/* Project-Level User Actions */}
                <Box sx={{ 
                  borderTop: '1px solid #e5e7eb', 
                  paddingTop: 3,
                  marginTop: 2
                }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: '#29346B', 
                      fontWeight: 600, 
                      marginBottom: 2,
                      fontSize: { xs: '14px', sm: '16px' }
                    }}
                  >
                    Project Actions: {selectedProject?.project_name}
                  </Typography>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {/* Assign User to Project */}
                    <Button
                      variant="contained"
                      startIcon={<PersonAddIcon />}
                      onClick={handleProjectAssignUser}
                      sx={{ 
                        bgcolor: "#4F46E5", 
                        "&:hover": { bgcolor: "#4338CA" },
                        fontSize: { xs: '12px', sm: '14px' },
                        padding: { xs: '6px 12px', sm: '8px 16px' }
                      }}
                    >
                      Assign Users
                    </Button>

                    {/* View Project Users */}
                    {/* <Button
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={handleProjectViewAssignedUsers}
                      sx={{ 
                        bgcolor: "#2563EB", 
                        "&:hover": { bgcolor: "#1D4ED8" },
                        fontSize: { xs: '12px', sm: '14px' },
                        padding: { xs: '6px 12px', sm: '8px 16px' }
                      }}
                    >
                      View Users
                    </Button> */}

                    {/* Send Project Notification */}
                    <Button
                      variant="contained"
                      startIcon={<NotificationsActiveIcon />}
                      onClick={handleProjectSendNotification}
                      sx={{ 
                        bgcolor: "#F97316", 
                        "&:hover": { bgcolor: "#EA580C" },
                        fontSize: { xs: '12px', sm: '14px' },
                        padding: { xs: '6px 12px', sm: '8px 16px' }
                      }}
                    >
                      Send Notification
                    </Button>
                  </div>
                </Box>
              </div>

              {/* Loading/Error/Content */}
              {isLoadingDrawings ? (
                <div className="flex justify-center py-8">
                  <CircularProgress />
                </div>
              ) : drawingsError ? (
                <Alert severity="error">Error fetching drawings</Alert>
              ) : filteredDrawings.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Sr</th>
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Drawing Number</th>
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Name of Drawing</th>
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Discipline</th>
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Block</th>
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Category</th>
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Updated At</th>
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Status</th>
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Action</th>
                        <th className="py-2 px-2 sm:px-3 text-[#29346B] border text-left text-xs sm:text-sm font-semibold">Approval</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDrawings?.map((drawing, index) => (
                        <tr key={drawing.id} className={index % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "bg-white hover:bg-gray-50"}>
                          <td className="py-2 px-2 sm:px-3 border text-xs sm:text-sm">{index + 1}</td>
                          <td className="py-2 px-2 sm:px-3 border text-xs sm:text-sm break-words max-w-32">{drawing.drawing_number}</td>
                          <td className="py-2 px-2 sm:px-3 border text-xs sm:text-sm break-words max-w-40">{drawing.name_of_drawing}</td>
                          <td className="py-2 px-2 sm:px-3 border text-xs sm:text-sm">{drawing.discipline}</td>
                          <td className="py-2 px-2 sm:px-3 border text-xs sm:text-sm">{drawing.block}</td>
                          <td className="py-2 px-2 sm:px-3 border text-xs sm:text-sm">{drawing.drawing_category}</td>
                          <td className="py-2 px-2 sm:px-3 border text-xs sm:text-sm">{formatDate(drawing.updated_at)}</td>
                          <td className="py-2 px-2 sm:px-3 border">
                            <span
                              className={`px-1 sm:px-2 py-1 rounded text-xs font-semibold ${
                                drawing.approval_status === "A" ? "bg-green-100 text-green-800" :
                                drawing.approval_status === "C" ? "bg-orange-100 text-orange-800" :
                                "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {drawing.approval_status === "A" ? "Approved" :
                               drawing.approval_status === "C" ? "Commented" :
                               drawing.approval_status === "N" ? "New" : drawing.approval_status}
                            </span>
                          </td>
                          <td className="py-2 px-2 sm:px-3 border">
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                              {/* View button */}
                              {drawing.drawing_and_design_attachments && drawing.drawing_and_design_attachments.length > 0 && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleView(drawing)}
                                  sx={{
                                    bgcolor: "#29346B",
                                    fontSize: { xs: '10px', sm: '12px' },
                                    padding: { xs: '2px 6px', sm: '4px 8px' },
                                    minWidth: { xs: '50px', sm: '60px' },
                                    "&:hover": { bgcolor: "#1e2756" }
                                  }}
                                >
                                  View
                                </Button>
                              )}

                              {/* Upload button */}
                              {(!drawing.drawing_and_design_attachments || drawing.drawing_and_design_attachments.length === 0 ||
                                drawing.approval_status === "commented") && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleUpload(drawing)}
                                  sx={{
                                    bgcolor: "#FACC15",
                                    color: "#29346B",
                                    fontSize: { xs: '10px', sm: '12px' },
                                    padding: { xs: '2px 6px', sm: '4px 8px' },
                                    minWidth: { xs: '50px', sm: '60px' },
                                    "&:hover": { bgcolor: "#e5b812" }
                                  }}
                                >
                                  Upload
                                </Button>
                              )}
                            </div>
                          </td>
                          <td className="py-2 px-2 sm:px-3 border">
                            <Button
                              variant="contained"
                              size="small"
                              disabled={drawing.is_approved}
                              onClick={() => handleOpenApprovalModal(drawing)}
                              sx={{
                                bgcolor: drawing.is_approved ? "#d1d5db" : "#10B981",
                                fontSize: { xs: '10px', sm: '12px' },
                                padding: { xs: '2px 6px', sm: '4px 8px' },
                                minWidth: { xs: '60px', sm: '70px' },
                                "&:hover": { bgcolor: drawing.is_approved ? "#d1d5db" : "#0ea271" }
                              }}
                            >
                              {drawing.is_approved ? "Approved" : "Approve"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="bg-gray-50 rounded-lg p-6 sm:p-8 max-w-md mx-auto">
                    <div className="text-4xl sm:text-5xl mb-4">📋</div>
                    <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">No Drawings Found</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      {searchTerm || filterStatus !== "all" || sortOption !== "all" ?
                        "No matching drawings found. Try adjusting your filters." :
                        "No drawings available for this project."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty State for No Project Selected */}
          {!selectedProjectId && (
            <div className="px-4 sm:px-6 lg:px-8 pb-6">
              <div className="text-center py-8 sm:py-12">
                <div className="bg-gray-50 rounded-lg p-6 sm:p-8 max-w-md mx-auto">
                  <div className="text-4xl sm:text-5xl mb-4">📄</div>
                  <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">
                    Ready to Start
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Please select a project from the dropdown above to view design documents.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* All Modals - Updated to work with project-level data */}
      <DrawingDocumentUploadDialog
        open={uploadModalOpen}
        handleClose={handleUploadClose}
        drawingDetails={selectedDrawing}
        refetchDrawings={refetch}
      />
      <DrawingDocumentViewModal
        open={viewModalOpen}
        handleClose={handleCloseViewModal}
        drawingDetails={selectedDrawing}
      />
      <DrawingApprovalModal
        open={approvalModalOpen}
        handleClose={handleCloseApprovalModal}
        drawingDetails={selectedDrawing}
        refetchDrawings={refetch}
      />
      {/* Project-level modals - pass project details instead of drawing details */}
      <AssignUserModal
        open={assignUserModalOpen}
        handleClose={handleCloseAssignUserModal}
        projectDetails={selectedProject} // Changed from drawingDetails
      />
      <UserNotiModal
        open={notiModalOpen}
        handleClose={handleCloseSendNotification}
        projectDetails={selectedProject} // Changed from drawingDetails
      />
      <ViewUserModal
        open={viewUserModalOpen}
        handleClose={handleCloseViewAssignedModal}
        projectDetails={selectedProject} // Changed from drawingDetails
      />
    </div>
  );
}

export default DesignDocumentsPage;