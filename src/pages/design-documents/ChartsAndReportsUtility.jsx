import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import FormatDateAndTime from "../../utils/dateUtils";

// Helper function to get approval status text
const getApprovalStatusText = (status) => {
  switch (status) {
    case "A": return "Approved";
    case "C": return "Commented";
    case "N": return "New";
    case "submitted": return "Submitted";
    default: return status || "Unknown";
  }
};

// Create chart image function
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

// Enhanced Excel export with charts function
const exportToExcelWithCharts = async (filteredDrawings, projects, selectedProjectId) => {
  if (!filteredDrawings || filteredDrawings.length === 0) {
    alert("No data to export");
    return;
  }

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

// Export functions
export {
  createChartImage,
  exportToExcelWithCharts,
  getApprovalStatusText
};