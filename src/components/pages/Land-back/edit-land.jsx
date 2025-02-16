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
import { useUpdateLandBankMasterMutation } from '../../../api/users/landbankApi';
// import { useUpdateLandBankMutation } from '../../../api/landBank/landBankApi';
// import { landBankApi,useUpdateLandBankMutation } from '../../../api/users/landbankApi';
// landBankApi

function EditLandBankModal({ open, handleClose, activeItem }) {
  console.log(activeItem);
  // const [formData, setFormData] = useState({
  //   land_bank_id: "",
  //   land_category_id: "",
  //   land_name: "",
  //   survey_number: "",
  //   village_name: "",
  //   taluka_name: "",
  //   tahshil_name: "",
  //   total_land_area: "",
  //   solar_or_winds: "",
  //   land_attach_approval_report_files: [],
  //   land_location_files: [],
  //   land_survey_number_files: [],
  //   land_key_plan_files: [],
  //   land_approach_road_files: [],
  //   land_co_ordinates_files: [],
  //   land_proposed_gss_files: [],
  //   land_transmission_line_files: [],
  // });
  
  const [formData, setFormData] = useState({
    land_bank_id: "",
    land_category_id: "",
    land_name: "",
    old_block_number: "",
    solar_or_winds: "",
    new_block_number: "",
    sale_deed_date: "",
    lease_deed_number: "",
    survey_number: "",
    village_name: "",
    district_name: "",
    taluka_tahshil_name: "",
    propose_gss_number: "",
    land_co_ordinates: "",
    land_status: "",
    area_meters: "",
    area_acres: "",
    industrial_jantri: "",
    jantri_value: "",
    mort_gaged: "",
    seller_name: "",
    buyer_name: "",
    actual_bucket: "",
    remarks: "",
    index_number: "",
    tcr: "",
    advocate_name: "",
    total_land_area: "",
    // File fields
    land_location_files: [],
    land_survey_number_files: [],
    land_key_plan_files: [],
    land_attach_approval_report_files: [],
    land_approach_road_files: [],
    land_co_ordinates_files: [],
    // land_lease_deed_files: [],
    land_transmission_line_files: [],
  });
  const [updateLandBankMaster] = useUpdateLandBankMasterMutation();
  // States for removed files
  // const [removedFiles, setRemovedFiles] = useState({
  //   land_attach_approval_report_files: [],
  //   land_location_files: [],
  //   land_survey_number_files: [],
  //   land_key_plan_files: [],
  //   land_approach_road_files: [],
  //   land_co_ordinates_files: [],
  //   land_proposed_gss_files: [],
  //   land_transmission_line_files: [],
  // });
  const [removedFiles, setRemovedFiles] = useState({
    land_location_files: [],
    land_survey_number_files: [],
    land_key_plan_files: [],
    land_attach_approval_report_files: [],
    land_approach_road_files: [],
    land_co_ordinates_files: [],
    // land_lease_deed_files: [],
    land_transmission_line_files: [],
  });

  // States for new files
  // const [newFiles, setNewFiles] = useState({
  //   land_attach_approval_report_files: [],
  //   land_location_files: [],
  //   land_survey_number_files: [],
  //   land_key_plan_files: [],
  //   land_approach_road_files: [],
  //   land_co_ordinates_files: [],
  //   land_proposed_gss_files: [],
  //   land_transmission_line_files: [],
  // });
  const [newFiles, setNewFiles] = useState({
    land_location_files: [],
    land_survey_number_files: [],
    land_key_plan_files: [],
    land_attach_approval_report_files: [],
    land_approach_road_files: [],
    land_co_ordinates_files: [],
    // land_lease_deed_files: [],
    land_transmission_line_files: [],
  });

  // useEffect(() => {
  //   if (activeItem) {
  //     setFormData({
  //       land_bank_id: activeItem.id || "",
  //       land_category_id: activeItem.land_category || "",
  //       land_name: activeItem.land_name || "",
  //       survey_number: activeItem.survey_number || "",
  //       village_name: activeItem.village_name || "",
  //       taluka_name: activeItem.taluka_name || "",
  //       tahshil_name: activeItem.tahshil_name || "",
  //       total_land_area: activeItem.total_land_area || "",
  //       solar_or_winds: activeItem.solar_or_winds || "",
  //       land_attach_approval_report_files: activeItem.land_attach_approval_report_file || [],
  //       land_location_files: activeItem.land_location_file || [],
  //       land_survey_number_files: activeItem.land_survey_number_file || [],
  //       land_key_plan_files: activeItem.land_key_plan_file || [],
  //       land_approach_road_files: activeItem.land_approach_road_file || [],
  //       land_co_ordinates_files: activeItem.land_co_ordinates_file || [],
  //       land_proposed_gss_files: activeItem.land_proposed_gss_file || [],
  //       land_transmission_line_files: activeItem.land_transmission_line_file || [],
  //     });
  //   }
  // }, [activeItem]);

  useEffect(() => {
    if (activeItem) {
      setFormData({
        land_bank_id: activeItem.id || "",
        land_category_id: activeItem.land_category || "",
        land_name: activeItem.land_name || "",
        solar_or_winds: activeItem.solar_or_winds || '',
        old_block_number: activeItem.old_block_number || "",
        new_block_number: activeItem.new_block_number || "",
        sale_deed_date: activeItem.sale_deed_date || "",
        lease_deed_number: activeItem.lease_deed_number || "",
        survey_number: activeItem.survey_number || "",
        village_name: activeItem.village_name || "",
        district_name: activeItem.district_name || "",
        taluka_tahshil_name: activeItem.taluka_tahshil_name || "",
        propose_gss_number: activeItem.propose_gss_number || "",
        land_co_ordinates: activeItem.land_co_ordinates || "",
        land_status: activeItem.land_status || "",
        area_meters: activeItem.area_meters || "",
        area_acres: activeItem.area_acres || "",
        industrial_jantri: activeItem.industrial_jantri || "",
        jantri_value: activeItem.jantri_value || "",
        mort_gaged: activeItem.mort_gaged || "",
        seller_name: activeItem.seller_name || "",
        buyer_name: activeItem.buyer_name || "",
        actual_bucket: activeItem.actual_bucket || "",
        remarks: activeItem.remarks || "",
        index_number: activeItem.index_number || "",
        tcr: activeItem.tcr || "",
        advocate_name: activeItem.advocate_name || "",
        total_land_area: activeItem.total_land_area || "",
        // File fields
        land_location_files: activeItem.land_location_file || [],
        land_survey_number_files: activeItem.land_survey_number_file || [],
        land_key_plan_files: activeItem.land_key_plan_file || [],
        land_attach_approval_report_files: activeItem.land_attach_approval_report_file || [],
        land_approach_road_files: activeItem.land_approach_road_file || [],
        land_co_ordinates_files: activeItem.land_co_ordinates_file || [],
        // land_lease_deed_files: activeItem.land_lease_deed_file || [],
        land_transmission_line_files: activeItem.land_transmission_line_file || [],
      });
    }
  }, [activeItem]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    setNewFiles(prev => ({
      ...prev,
      [field]: [...prev[field], ...files]
    }));
  };

  const handleRemoveFile = (fileId, fileType) => {
    setRemovedFiles(prev => ({
      ...prev,
      [fileType]: prev[fileType].includes(fileId)
        ? prev[fileType].filter(id => id !== fileId)
        : [...prev[fileType], fileId]
    }));
  };

  // const [updateLandBank] = useUpdateLandBankMutation();

  const handleSubmit = async () => {
    const formDataToSend = new FormData();

    // Append basic form data
    Object.keys(formData).forEach(key => {
      if (!key.includes('files')) {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append new files
    Object.keys(newFiles).forEach(fileType => {
      newFiles[fileType].forEach(file => {
        formDataToSend.append(fileType, file);
      });
    });

    // Append removed file IDs
    Object.keys(removedFiles).forEach(fileType => {
      if (removedFiles[fileType].length > 0) {
        formDataToSend.append(
          `${fileType}_to_remove`,
          removedFiles[fileType].join(',')
        );
      }
    });

    try {
      await updateLandBankMaster({ 
        id: formData.land_bank_id, 
        formData: formDataToSend 
      }).unwrap();
      handleClose();
    } catch (error) {
      console.error('Error updating Land Bank:', error);
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

  const renderFileSection = (title, fieldName, files) => (
    <>
      <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
        {title}
      </label>
      <input
        type="file"
        name={fieldName}
        multiple
        onChange={(e) => handleFileChange(e, fieldName)}
        className="mb-4"
      />
      
      {files?.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Uploaded Files:</h4>
          {files.map((file, index) => {
            const isRemoved = removedFiles[fieldName].includes(file.id);
            return (
              <div key={index} className="flex items-center gap-4 py-2">
                <div className='flex flex-row gap-2'>
                <p>{index+1}.</p>
                <Link 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={isRemoved ? "line-through" : ""}
                >
                  <p className='text-gray-800'>{file.url.split('/').pop()}</p>
                </Link>
                </div>
                <Button 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >View File</Button>
                <Button
                  onClick={() => handleRemoveFile(file.id, fieldName)}
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
    </>
  );

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
          Edit Land Bank Details
        </DialogTitle>
        <DialogContent>
          <TextField
            name="land_name"
            label="Land Name"
            value={formData.land_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          <TextField
            name="old_block_number"
            label="Old Block Number"
            value={formData.old_block_number}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
          <div>
            <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
              Solar or Wind
            </label>
            <select
              name="solar_or_wind"
              value={formData.solar_or_winds}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="solar">Solar</option>
              <option value="wind">Wind</option>
            </select>
          </div>

  
          <TextField
            name="new_block_number"
            label="New Block Number"
            value={formData.new_block_number}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          <TextField
            name="sale_deed_date"
            label="Sale Deed Date"
            type="date"
            value={formData.sale_deed_date}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            sx={inputStyles}
          />
  
          <TextField
            name="lease_deed_number"
            label="Lease Deed Number"
            value={formData.lease_deed_number}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          <TextField
            name="survey_number"
            label="Survey Number"
            value={formData.survey_number}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          <TextField
            name="village_name"
            label="Village Name"
            value={formData.village_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          <TextField
            name="district_name"
            label="District Name"
            value={formData.district_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          <TextField
            name="taluka_tahshil_name"
            label="Taluka/Tahshil Name"
            value={formData.taluka_tahshil_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          <TextField
            name="propose_gss_number"
            label="Proposed GSS Number"
            value={formData.propose_gss_number}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          <TextField
            name="land_co_ordinates"
            label="Land Coordinates"
            value={formData.land_co_ordinates}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          <TextField
            name="land_status"
            label="Land Status"
            value={formData.land_status}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          <TextField
            name="area_meters"
            label="Area (Meters)"
            value={formData.area_meters}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
            type="number"
          />
  
          <TextField
            name="area_acres"
            label="Area (Acres)"
            value={formData.area_acres}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
            type="number"
          />
  
          <TextField
            name="industrial_jantri"
            label="Industrial Jantri"
            value={formData.industrial_jantri}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          <TextField
            name="jantri_value"
            label="Jantri Value"
            value={formData.jantri_value}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          <TextField
            name="mort_gaged"
            label="Mortgaged"
            value={formData.mort_gaged}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          <TextField
            name="seller_name"
            label="Seller Name"
            value={formData.seller_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          <TextField
            name="buyer_name"
            label="Buyer Name"
            value={formData.buyer_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          <TextField
            name="actual_bucket"
            label="Actual Bucket"
            value={formData.actual_bucket}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          <TextField
            name="remarks"
            label="Remarks"
            value={formData.remarks}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            sx={inputStyles}
          />
  
          <TextField
            name="index_number"
            label="Index Number"
            value={formData.index_number}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          {/* <TextField
            name="tcr"
            label="TCR"
            value={formData.tcr}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          /> */}
          <div>
  <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
    TCR
  </label>
  <select
    name="tcr"
    value={formData.tcr}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded"
  >
    <option value="True">True</option>
    <option value="False">False</option>
  </select>
</div>
  
          <TextField
            name="advocate_name"
            label="Advocate Name"
            value={formData.advocate_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          <TextField
            name="total_land_area"
            label="Total Land Area"
            value={formData.total_land_area}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
            sx={inputStyles}
          />
  
          {/* File upload sections */}
          {renderFileSection("Location Files", "land_location_files", formData.land_location_files)}
          {renderFileSection("Survey Number Files", "land_survey_number_files", formData.land_survey_number_files)}
          {renderFileSection("Key Plan Files", "land_key_plan_files", formData.land_key_plan_files)}
          {renderFileSection("Approval Report Files", "land_attach_approval_report_files", formData.land_attach_approval_report_files)}
          {renderFileSection("Approach Road Files", "land_approach_road_files", formData.land_approach_road_files)}
          {renderFileSection("Co-ordinates Files", "land_co_ordinates_files", formData.land_co_ordinates_files)}
          {/* {renderFileSection("Lease Deed Files", "land_lease_deed_files", formData.land_lease_deed_files)} */}
          {renderFileSection("Transmission Line Files", "land_transmission_line_files", formData.land_transmission_line_files)}
        </DialogContent>
  
        <DialogActions sx={{ justifyContent: "center", padding: "20px" }}>
          <Button
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#f6812d",
              color: "#FFFFFF",
              fontSize: "18px",
              padding: "6px 16px",
              fontWeight: "600",
              borderRadius: "5px",
              '&:hover': {
                backgroundColor: "#e67424"
              }
            }}
          >
            Update Land Bank
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default EditLandBankModal;