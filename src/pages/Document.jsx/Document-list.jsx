import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  TextField,
  TablePagination 
} from '@mui/material';
import { RiEditFill } from 'react-icons/ri';
import AddDocumentModal from '../../components/pages/Documents/add-documents';
import EditDocumentModal from '../../components/pages/Documents/edit-documents';

// Assuming you have the hook useGetDocumentsQuery imported
import { useGetDocumentsQuery } from '../../api/users/documentApi';

function DocumentListing() {
  const [documentFilter, setDocumentFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false); 
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Fetch documents from the API using the hook
  const { data, isLoading, isError } = useGetDocumentsQuery();

  const rows = data?.data.map((item, index) => ({
    sr: index + 1,
    id: item.id,
    documentName: item.document_name,
    documentNumber: item.document_number,
    projectName: item.project_name, // You may need to map this if you have a project name to display
    confidentialLevel: item.confidentiallevel,
    createdAt: new Date(item.created_at).toLocaleDateString(),
    createdByFullName: item.created_by_full_name, // You can map this to the user name if needed
    keywords: item.keywords, // New field for keywords
  }));

  const filteredRows = rows?.filter((row) =>
    row.documentName.toLowerCase().includes(documentFilter.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentRows = filteredRows?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleEditModalClose = () => {
    setOpenEdit(false);
  };
  const handleEditClick = (rowId) => {

    const fullDocument = data?.data.find((item) => item.id === rowId);
    
    if (fullDocument) {
      setSelectedDocument(fullDocument);  // Set the selected full document
      setOpenEdit(true);  // Open the edit modal
    }
  };

  return (
    <div className="bg-white p-4 md:w-[90%] lg:w-[70%] mx-auto my-8 rounded-md">
      <div className="flex flex-row my-6 px-10 items-center justify-between">
        <div className="flex items-center">
          <TextField
            value={documentFilter}
            placeholder="Search"
            onChange={(e) => setDocumentFilter(e.target.value)}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
          />
        </div>
        
        <div className="flex-grow flex justify-center">
          <h2 className="text-2xl text-[#29346B] font-semibold">Document Listing</h2>
        </div>
        
        <div className="flex items-center">
          <Button
            variant="contained"
            style={{ 
              backgroundColor: '#f6812d', 
              color: 'white', 
              fontWeight: 'bold', 
              fontSize: '16px',
              textTransform: 'none' 
            }}
            onClick={() => setOpen(true)} // Set open state to true when clicked
          >
            Add Document
          </Button>
        </div>
      </div>
            
      <TableContainer style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#F2EDED' }}>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Sr No.
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Document Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Document Number
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Project Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Confidential Level
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Created At
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Created By
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Keywords
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 'normal', color: '#5C5E67', fontSize: '16px' }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentRows?.map((row) => (
              <TableRow key={row.sr}>
                <TableCell align="center" style={{ fontSize: '16px' }}>{row.sr}</TableCell>
                <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row.documentName}</TableCell>
                <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row.documentNumber}</TableCell>
                <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row.projectName}</TableCell>
                <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row.confidentialLevel}</TableCell>
                <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row.createdAt}</TableCell>
                <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row.createdByFullName}</TableCell>
                <TableCell align="center" style={{ fontSize: '16px', color: '#1D2652' }}>{row.keywords}</TableCell>
                <TableCell align="center">
                  <RiEditFill
                    style={{ 
                      cursor: 'pointer', 
                      color: '#61D435', 
                      fontSize: '23px', 
                      textAlign: 'center' 
                    }}
                    title="Edit"
                    onClick={() => handleEditClick(row.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredRows?.length || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          style={{
            borderTop: '1px solid #e0e0e0'
          }}
        />
      </TableContainer>

      <EditDocumentModal
        open={openEdit}
        onClose={handleEditModalClose}
        document={selectedDocument} 
      />

      <AddDocumentModal
        open={open}
        onClose={handleModalClose}
      />
    </div>
  );
}

export default DocumentListing;
