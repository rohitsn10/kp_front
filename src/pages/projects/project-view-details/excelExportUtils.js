import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case "Completed": return { color: '10B981', lightColor: 'DCFCE7' }; // Green
    case "WIP": return { color: 'F59E0B', lightColor: 'FEF3C7' }; // Orange
    case "Yet to start/Pending": return { color: 'EF4444', lightColor: 'FEE2E2' }; // Red
    case "NA": return { color: '6B7280', lightColor: 'F3F4F6' }; // Gray
    default: return { color: '6366F1', lightColor: 'EEF2FF' }; // Indigo
  }
};

// Create chart image function for activities
const createActivitiesChartImage = (statusCounts, totalActivities) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    // Chart colors
    const colors = {
      'Completed': '#10B981',
      'WIP': '#F59E0B', 
      'Yet to start/Pending': '#EF4444',
      'NA': '#6B7280'
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
      const sliceAngle = (count / totalActivities) * 2 * Math.PI;
      
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
      const percentage = ((count / totalActivities) * 100).toFixed(1);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${percentage}%`, labelX, labelY);

      currentAngle += sliceAngle;
    });

    // Add title
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Activities Status Distribution', centerX, 30);

    // Add legend
    let legendY = centerY + radius + 40;
    data.forEach(([status, count]) => {
      const percentage = ((count / totalActivities) * 100).toFixed(1);
      
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

// Format date for Excel
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Enhanced Excel export with charts function for activities
const exportActivitiesToExcelWithCharts = async (activitiesData, projectData, summary) => {
  if (!activitiesData || activitiesData.length === 0) {
    alert("No data to export");
    return;
  }

  // Status counts for chart
  const statusCounts = {};
  activitiesData.forEach(activity => {
    const status = activity.status;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  try {
    // Create chart image
    const chartImageBase64 = await createActivitiesChartImage(statusCounts, activitiesData.length);
    const workbook = new ExcelJS.Workbook();

    // 1. MAIN ACTIVITIES DATA SHEET
    const dataSheet = workbook.addWorksheet('🚀 Project Activities');
    
    const excelData = activitiesData.map((activity, index) => [
      index + 1,
      activity.id,
      activity.taskName,
      activity.status,
      activity.category,
      activity.uom,
      activity.totalQuantity,
      activity.completedQuantity,
      activity.completionPercentage.toFixed(2) + '%',
      activity.daysToComplete,
      formatDate(activity.plannedStartDate),
      formatDate(activity.plannedEndDate),
      formatDate(activity.actualStartDate),
      formatDate(activity.actualEndDate),
      activity.remarks || 'N/A'
    ]);

    const headers = [
      'Sr. No.', 'Activity ID', 'Task Name', 'Status', 'Category',
      'UOM', 'Total Quantity', 'Completed Quantity', 'Completion %',
      'Days to Complete', 'Planned Start', 'Planned End',
      'Actual Start', 'Actual End', 'Remarks'
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
      const activityStatus = row.getCell(4).value; // Status column
      const statusColors = getStatusColor(activityStatus);
      
      // Alternating row colors
      const isEvenRow = (i - 2) % 2 === 0;
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEvenRow ? 'F8FAFC' : 'FFFFFF' }
      };

      // 🎯 COLOR-CODE STATUS CELL
      const statusCell = row.getCell(4);
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: statusColors.lightColor }
      };
      statusCell.font = {
        bold: true,
        color: { argb: statusColors.color },
        size: 10
      };
      statusCell.alignment = { horizontal: 'center', vertical: 'middle' };
      statusCell.border = {
        top: { style: 'medium', color: { argb: statusColors.color } },
        left: { style: 'medium', color: { argb: statusColors.color } },
        bottom: { style: 'medium', color: { argb: statusColors.color } },
        right: { style: 'medium', color: { argb: statusColors.color } }
      };

      // 📊 STYLE COMPLETION PERCENTAGE
      const completionCell = row.getCell(9);
      const completionValue = parseFloat(row.getCell(9).value);
      if (completionValue === 100) {
        completionCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCFCE7' } };
        completionCell.font = { bold: true, color: { argb: '166534' } };
      } else if (completionValue > 0) {
        completionCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF3C7' } };
        completionCell.font = { bold: true, color: { argb: 'D97706' } };
      } else {
        completionCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } };
        completionCell.font = { bold: true, color: { argb: 'DC2626' } };
      }
      completionCell.alignment = { horizontal: 'center', vertical: 'middle' };

      // 📊 STYLE NUMERICAL COLUMNS
      const numericalColumns = [1, 2, 6, 7, 8, 10]; // Sr. No., ID, quantities, days
      numericalColumns.forEach(colIndex => {
        const cell = row.getCell(colIndex);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'EFF6FF' }
        };
        cell.font = { bold: true, color: { argb: '1E40AF' }, size: 10 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      // 📅 STYLE DATE COLUMNS
      const dateColumns = [11, 12, 13, 14];
      dateColumns.forEach(colIndex => {
        const cell = row.getCell(colIndex);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FEF3C7' }
        };
        cell.font = { color: { argb: 'D97706' }, size: 9 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      // 🎨 STYLE CATEGORY COLUMN
      const categoryCell = row.getCell(5);
      if (categoryCell.value === 'Service') {
        categoryCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DBEAFE' } };
        categoryCell.font = { bold: true, color: { argb: '1E40AF' } };
      } else if (categoryCell.value === 'Supply') {
        categoryCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F3E8FF' } };
        categoryCell.font = { bold: true, color: { argb: '7C3AED' } };
      }
      categoryCell.alignment = { horizontal: 'center', vertical: 'middle' };
    }

    // Set column widths
    const columnWidths = [8, 12, 40, 20, 12, 8, 12, 15, 12, 12, 15, 15, 15, 15, 30];
    columnWidths.forEach((width, index) => {
      dataSheet.getColumn(index + 1).width = width;
    });

    // 2. STATS SUMMARY SHEET
    const statsSheet = workbook.addWorksheet('📊 Project Statistics');
    
    // Project header
    statsSheet.getCell('A1').value = '🎯 Project Dashboard Summary';
    statsSheet.getCell('A1').font = { 
      size: 20, 
      bold: true, 
      color: { argb: 'FFFFFF' },
      name: 'Segoe UI'
    };
    statsSheet.mergeCells('A1:F1');
    statsSheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    statsSheet.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1E293B' }
    };
    statsSheet.getRow(1).height = 35;

    // Project Information
    let currentRow = 3;
    const projectInfo = [
      ['🏢 Project Name', projectData?.project_name || 'N/A'],
      ['⚡ Capacity', `${projectData?.capacity || 'N/A'} MW`],
      ['🏭 Company', projectData?.company_name || 'N/A'],
      ['🌍 Landbank', projectData?.landbank_name || 'N/A'],
      ['📍 Available Land', `${projectData?.available_land_area || 'N/A'} acres`],
      ['📍 Allotted Land', `${projectData?.alloted_land_area || 'N/A'} acres`]
    ];

    statsSheet.getCell(`A${currentRow}`).value = '📋 Project Information';
    statsSheet.getCell(`A${currentRow}`).font = { size: 14, bold: true, color: { argb: 'FFFFFF' } };
    statsSheet.getCell(`A${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '3B82F6' } };
    statsSheet.mergeCells(`A${currentRow}:B${currentRow}`);
    currentRow++;

    projectInfo.forEach(([label, value]) => {
      statsSheet.getCell(`A${currentRow}`).value = label;
      statsSheet.getCell(`B${currentRow}`).value = value;
      statsSheet.getCell(`A${currentRow}`).font = { bold: true, color: { argb: '374151' } };
      statsSheet.getCell(`B${currentRow}`).font = { color: { argb: '1F2937' } };
      statsSheet.getCell(`A${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F3F4F6' } };
      statsSheet.getCell(`B${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } };
      currentRow++;
    });

    currentRow += 2;

    // Activity Statistics
    statsSheet.getCell(`A${currentRow}`).value = '📊 Activity Statistics';
    statsSheet.getCell(`A${currentRow}`).font = { size: 14, bold: true, color: { argb: 'FFFFFF' } };
    statsSheet.getCell(`A${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '059669' } };
    statsSheet.mergeCells(`A${currentRow}:B${currentRow}`);
    currentRow++;

    const activityStats = [
      ['📈 Total Activities', summary.totalTasks],
      ['✅ Completed Tasks', summary.completedTasks],
      ['🔄 In Progress', summary.wipTasks],
      ['⏳ Pending Tasks', summary.pendingTasks],
      ['📊 Overall Progress', `${summary.overallProgress}%`],
      ['🔧 Service Tasks', summary.serviceTasks],
      ['📦 Supply Tasks', summary.supplyTasks]
    ];

    activityStats.forEach(([label, value]) => {
      statsSheet.getCell(`A${currentRow}`).value = label;
      statsSheet.getCell(`B${currentRow}`).value = value;
      statsSheet.getCell(`A${currentRow}`).font = { bold: true, color: { argb: '374151' } };
      statsSheet.getCell(`B${currentRow}`).font = { bold: true, color: { argb: '059669' } };
      statsSheet.getCell(`A${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F3F4F6' } };
      statsSheet.getCell(`B${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCFCE7' } };
      currentRow++;
    });

    // Status breakdown table
    currentRow += 2;
    statsSheet.getCell(`D3`).value = '📊 Status Distribution';
    statsSheet.getCell(`D3`).font = { size: 14, bold: true, color: { argb: 'FFFFFF' } };
    statsSheet.getCell(`D3`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DC2626' } };
    statsSheet.mergeCells(`D3:F3`);

    // Headers
    const statusHeaders = ['Status', 'Count', 'Percentage'];
    statusHeaders.forEach((header, index) => {
      const cell = statsSheet.getCell(String.fromCharCode(68 + index) + '4'); // D, E, F
      cell.value = header;
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '374151' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    let statusRow = 5;
    Object.entries(statusCounts).forEach(([status, count]) => {
      const percentage = ((count / activitiesData.length) * 100).toFixed(1);
      const statusColors = getStatusColor(status);
      
      // Status cell
      const statusCell = statsSheet.getCell(`D${statusRow}`);
      statusCell.value = status;
      statusCell.font = { bold: true, color: { argb: statusColors.color } };
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: statusColors.lightColor } };
      
      // Count cell
      const countCell = statsSheet.getCell(`E${statusRow}`);
      countCell.value = count;
      countCell.font = { bold: true, color: { argb: '1E40AF' } };
      countCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EFF6FF' } };
      countCell.alignment = { horizontal: 'center' };
      
      // Percentage cell
      const percentCell = statsSheet.getCell(`F${statusRow}`);
      percentCell.value = `${percentage}%`;
      percentCell.font = { bold: true, color: { argb: '059669' } };
      percentCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCFCE7' } };
      percentCell.alignment = { horizontal: 'center' };
      
      statusRow++;
    });

    // Set column widths for stats sheet
    statsSheet.getColumn('A').width = 25;
    statsSheet.getColumn('B').width = 20;
    statsSheet.getColumn('D').width = 20;
    statsSheet.getColumn('E').width = 12;
    statsSheet.getColumn('F').width = 15;

    // 3. CHARTS & ANALYSIS SHEET
    const chartsSheet = workbook.addWorksheet('📈 Visual Analytics');
    
    // Enhanced title
    chartsSheet.getCell('A1').value = '🎯 Project Activities Analysis Dashboard';
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
    chartsSheet.getCell('A3').value = `🏢 Project: ${projectData?.project_name || 'Unknown'}`;
    chartsSheet.getCell('A3').font = { size: 14, bold: true, color: { argb: '1E293B' } };
    chartsSheet.getCell('A3').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'DBEAFE' }
    };

    chartsSheet.getCell('A4').value = `📊 Total Activities: ${activitiesData.length}`;
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

    // Generate filename
    const projectName = projectData?.project_name || 'Project';
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `${projectName}_Activities_Analysis_${currentDate}.xlsx`;

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

// Export functions
export {
  createActivitiesChartImage,
  exportActivitiesToExcelWithCharts,
  getStatusColor
};