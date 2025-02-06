import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Link,
} from '@mui/material';
import { useUpdateSfaDataToLandBankMutation } from '../../../api/sfa/sfaApi';

function AssessmentFormUpdateModal({ open, handleClose, activeItem }) {
  const [formData, setFormData] = useState({
    sfa_name: "",
    land_sfa_file: [],
    sfa_for_transmission_line_gss_files: [],
    timeline: "",
    solar_or_winds: "",
    date_of_assessment: "",
    site_visit_date: "",
  });
  const [removeLandSfaFiles, setRemoveLandSfaFiles] = useState([]);
  const [removeSfaForTransmissionFiles, setRemoveSfaForTransmissionFiles] = useState([]);
  const [newLandSfaFiles, setNewLandSfaFiles] = useState([]);
  const [newSfaForTransmissionFiles, setNewSfaForTransmissionFiles] = useState([]);

  // Use useEffect to update formData when activeItem changes
  useEffect(() => {
    if (activeItem) {
      const formatDate = (date) => {
        if (!date) return "";
        const newDate = new Date(date);
        return newDate.toISOString().split('T')[0]; // Extract YYYY-MM-DD
      };
      
      setFormData({
        sfa_name: activeItem.sfa_name || "",
        land_sfa_file: activeItem.land_sfa_file || [],
        sfa_for_transmission_line_gss_files: activeItem.sfa_for_transmission_line_gss_files || [],
        timeline: formatDate(activeItem.timeline), // Convert date
        solar_or_winds: activeItem.solar_or_winds || "",
        date_of_assessment: formatDate(activeItem.date_of_assessment), // Convert date
        site_visit_date: formatDate(activeItem.site_visit_date), // Convert date
      });
    }
  }, [activeItem]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    const newFiles = Array.from(e.target.files);
    
    if (field === "land_sfa_file") {
      setNewLandSfaFiles((prevFiles) => [...prevFiles, ...newFiles]); // Append new files
    } else if (field === "sfa_for_transmission_line_gss_files") {
      setNewSfaForTransmissionFiles((prevFiles) => [...prevFiles, ...newFiles]); // Append new files
    }
  };

  const handleRemoveFile = (fileId, fileType) => {
    if (fileType === 'land_sfa_file') {
      setRemoveLandSfaFiles((prev) =>
        prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
      );
    } else if (fileType === 'sfa_for_transmission_line_gss_files') {
      setRemoveSfaForTransmissionFiles((prev) =>
        prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
      );
    }
  };

  const [updateSfaDataToLandBank] = useUpdateSfaDataToLandBankMutation();

  const handleSubmit = async () => {
    const land_sfa_data_id = activeItem.id; // Assuming activeItem has the ID

    // Create FormData object
    const formDataToSend = new FormData();

    // Append non-file data to FormData
    Object.keys(formData).forEach((key) => {
      if (key !== 'land_sfa_file' && key !== 'sfa_for_transmission_line_gss_files') {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append new files (without old files) to FormData
    newLandSfaFiles.forEach((file) => {
      formDataToSend.append('land_sfa_file', file); // Append each new file to 'land_sfa_file'
    });

    newSfaForTransmissionFiles.forEach((file) => {
      formDataToSend.append('sfa_for_transmission_line_gss_files', file); // Append each new file to 'sfa_for_transmission_line_gss_files'
    });

    if (removeLandSfaFiles.length > 0) {
      formDataToSend.append('remove_land_sfa_file', removeLandSfaFiles.join(',')); // Join array of fileIds into a string
    }
  
    if (removeSfaForTransmissionFiles.length > 0) {
      formDataToSend.append('remove_sfa_for_transmission_line_gss_files', removeSfaForTransmissionFiles.join(',')); // Join array of fileIds into a string
    }

    try {
      // Now send the FormData to the API using your mutation
      await updateSfaDataToLandBank({ land_sfa_data_id, formData: formDataToSend }).unwrap();
      
      // Handle success
      handleClose(); // Close the modal
    } catch (error) {
      // Handle error
      console.error('Error updating SFA:', error);
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      border: "1px solid #FACC15",
      borderBottom: "4px solid #FACC15",
      borderRadius: "6px",
      padding: "2px",
    },
    "& .MuiOutlinedInput-root.Mui-focused": {
      outline: "none",
      borderBottom: "4px solid #E6A015",
    },
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          color: "#29346B",
          fontSize: "27px",
          fontWeight: "600",
          marginBottom: "10px",
        }}
      >
        SFA Form
      </DialogTitle>
      <DialogContent>
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          SFA Name
        </label>
        <TextField
          name="sfa_name"
          value={formData.sfa_name}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          sx={inputStyles}
        />
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Land SFA file
        </label>
        <input
          type="file"
          name="land_sfa_file"
          multiple
          onChange={(e) => handleFileChange(e, "land_sfa_file")}
          style={{ marginBottom: "10px", marginTop: "10px" }}
        />
        
        {formData.land_sfa_file?.length > 0 && (
          <div>
            Current Files: 
            {formData.land_sfa_file.map((file, index) => (
              <div key={index}>{file.name}</div>
            ))}
          </div>
        )}
        
        {activeItem?.land_sfa_file && activeItem.land_sfa_file?.length > 0 && (
          <div>
            <h4>Uploaded Land SFA Files:</h4>
            {activeItem.land_sfa_file.map((file, index) => {
              const isRemoved = removeLandSfaFiles.includes(file.id);
              return (
                <div key={index} style={{ padding: "5px", borderRadius: "5px", display: "flex", flexDirection: "row", gap: "10px" }}>
                  <Link href={file.url} target="_blank" sx={{ textDecoration: isRemoved ? "line-through" : "none" }} rel="noopener noreferrer">
                    {file.url.split('/').pop()}
                  </Link>
                  <Button
                    onClick={() => handleRemoveFile(file.id, 'land_sfa_file')}
                    color={isRemoved ? "secondary" : "error"}
                    sx={{ backgroundColor: isRemoved ? "transparent" : "#f8d7da" }}
                    size="small"
                  >
                    {isRemoved ? "Undo" : "Remove"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <input
          type="file"
          name="sfa_for_transmission_line_gss_files"
          multiple
          onChange={(e) => handleFileChange(e, "sfa_for_transmission_line_gss_files")}
          style={{ marginBottom: "10px", marginTop: "10px" }}
        />
        
        {formData.sfa_for_transmission_line_gss_files?.length > 0 && (
          <div>
            Current Files: 
            {formData.sfa_for_transmission_line_gss_files.map((file, index) => (
              <div key={index}>{file.name}</div>
            ))}
          </div>
        )}
        
        {activeItem?.sfa_for_transmission_line_gss_files && activeItem.sfa_for_transmission_line_gss_files?.length > 0 && (
          <div>
            <h4>Uploaded SFA for Transmission Line GSS Files:</h4>
            {activeItem.sfa_for_transmission_line_gss_files.map((file, index) => {
              const isRemoved = removeSfaForTransmissionFiles.includes(file.id);
              return (
                <div key={index} style={{ padding: "5px", borderRadius: "5px" }}>
                  <Link href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.url.split('/').pop()}
                  </Link>
                  <Button
                    onClick={() => handleRemoveFile(file.id, 'sfa_for_transmission_line_gss_files')}
                    color={isRemoved ? "secondary" : "error"}
                    size="small"
                    sx={{ backgroundColor: isRemoved ? "transparent" : "#f8d7da" }}
                  >
                    {isRemoved ? "Undo" : "Remove"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Timeline
        </label>
        <TextField
          name="timeline"
          type="date"
          value={formData.timeline}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          sx={inputStyles}
          InputLabelProps={{ shrink: true }}
        />
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Solar or Wind
        </label>
        <TextField
          name="solar_or_winds"
          select
          value={formData.solar_or_winds}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          sx={inputStyles}
        >
          <MenuItem value="Solar">Solar</MenuItem>
          <MenuItem value="Wind">Wind</MenuItem>
        </TextField>
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Date of Assessment
        </label>
        <TextField
          name="date_of_assessment"
          type="date"
          value={formData.date_of_assessment}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          sx={inputStyles}
          InputLabelProps={{ shrink: true }}
        />
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Site Visit Date
        </label>
        <TextField
          name="site_visit_date"
          type="date"
          value={formData.site_visit_date}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          sx={inputStyles}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", padding: "20px" }}>
        <Button
          onClick={handleSubmit}
          type="submit"
          sx={{
            backgroundColor: "#f6812d",
            color: "#FFFFFF",
            fontSize: "18px",
            padding: "6px 16px",
            fontWeight: "600",
            borderRadius: "5px",
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AssessmentFormUpdateModal;
