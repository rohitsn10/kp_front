import React, { useState } from "react";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useGetLandCategoriesQuery } from "../../../api/users/categoryApi";
import { useLocation } from "react-router-dom";
import { useUpdateDataAfterApprovalLandBankMutation } from "../../../api/users/landbankApi";
import { useNavigate } from 'react-router-dom';

export default function AddLandDoc() {
  const location = useLocation();
  const { landData } = location.state || {};
  const [locationInput, setLocationInput] = useState(landData.land_name);
  const { data: categories } = useGetLandCategoriesQuery();
  const [selectedCategory, setSelectedCategory] = useState(landData.land_category);
  const navigate = useNavigate();
  const [fileInputs, setFileInputs] = useState({
    dilr: [],
    na65Permission: [],
    revenueRecords: [],
    tsr: [],
    coordinateVerification: [],
    encumbranceNoc: [],
    leaseDeed: [],
    developerPermission: [],
    nocMinistryOfDefence: [],
    nocAirportAuthority: [],
    nocForestDepartment: [],
    nocGeologyMining: [],
    canalCrossing: [],
    railwayCrossing: [],
    anylineshiftpermisson: [],
    gasPipelineCrossing: [],
    roadCrossing: [],
    transmissionLineCrossing: [],
    gramPanchayatPermission: [],
    municipalCorporationPermission: [],
    listofapprovalreq: [],
    otherApprovals: [],
  });

  // Use the mutation hook
  const [updateDataAfterApproval, { isLoading: isUpdating }] =
    useUpdateDataAfterApprovalLandBankMutation();
  console.log("File Inputs",fileInputs);
  // const handleFileChange = (e, field) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFileInputs((prevState) => ({ ...prevState, [field]: file }));
  //   }
  // };
  // const handleFileChange = (e, field) => {
  //   const files = e.target.files;
  //   if (files.length > 0) {
  //     setFileInputs((prevState) => ({
  //       ...prevState,
  //       [field]: files,
  //     }));
  //   }
  // };

  // const handleFileChange = (e, field) => {
  //   const files = Array.from(e.target.files); // Convert FileList to an array
  //   if (files.length > 0) {
  //     setFileInputs((prevState) => ({
  //       ...prevState,
  //       [field]: [...prevState[field], ...files], // Append new files
  //     }));
  //   }
  // };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    setFileInputs((prevState) => ({
      ...prevState,
      [field]: [...(prevState[field] || []), ...files], // Ensure it's an array
    }));
  };
  

  // const handleSubmit = async () => {
  //   if (!fileInputs.na65Permission) {
  //     toast.error("NA/65 Permission is mandatory!");
  //     return;
  //   }

  //   const formData = new FormData();

  //   formData.append("dilr_attachment_file", fileInputs.dilr);
  //   formData.append(
  //     "na_65b_permission_attachment_file",
  //     fileInputs.na65Permission
  //   );
  //   formData.append(
  //     "revenue_7_12_records_attachment",
  //     fileInputs.revenueRecords
  //   );
  //   formData.append(
  //     "noc_from_forest_and_amp_attachment_file",
  //     fileInputs.nocForestDepartment
  //   );
  //   formData.append(
  //     "noc_from_geology_and_mining_office_attachment_file",
  //     fileInputs.nocGeologyMining
  //   );
  //   formData.append(
  //     "approvals_required_for_transmission_attachment_file",
  //     fileInputs.listofapprovalreq
  //   );
  //   formData.append("canal_crossing_attachment_file", fileInputs.canalCrossing);
  //   formData.append("lease_deed_attachment_file", fileInputs.leaseDeed);
  //   formData.append(
  //     "railway_crossing_attachment_file",
  //     fileInputs.railwayCrossing
  //   );
  //   formData.append(
  //     "any_gas_pipeline_crossing_attachment_file",
  //     fileInputs.gasPipelineCrossing
  //   );
  //   formData.append(
  //     "road_crossing_permission_attachment_file",
  //     fileInputs.roadCrossing
  //   );
  //   formData.append(
  //     "any_transmission_line_crossing_permission_attachment_file",
  //     fileInputs.transmissionLineCrossing
  //   );
  //   formData.append(
  //     "any_transmission_line_shifting_permission_attachment_file",
  //     fileInputs.anylineshiftpermisson
  //   );
  //   formData.append(
  //     "gram_panchayat_permission_attachment_file",
  //     fileInputs.gramPanchayatPermission
  //   );
  //   formData.append(
  //     "municipal_corporation_permission_file",
  //     fileInputs.municipalCorporationPermission
  //   );
  //   formData.append(
  //     "list_of_other_approvals_land_file",
  //     fileInputs.otherApprovals
  //   );
  //   formData.append("title_search_report_file", fileInputs.tsr);
  //   formData.append(
  //     "coordinate_verification_file",
  //     fileInputs.coordinateVerification
  //   );
  //   formData.append("encumbrance_noc_file", fileInputs.encumbranceNoc);
  //   formData.append(
  //     "developer_permission_file",
  //     fileInputs.developerPermission
  //   );
  //   formData.append(
  //     "noc_from_ministry_of_defence_file",
  //     fileInputs.nocMinistryOfDefence
  //   );
  //   formData.append(
  //     "list_of_approvals_required_for_transmission_line_file",
  //     fileInputs.listofapprovalreq
  //   );
  //   formData.append("land_bank_id", landData.id); // Replace "1" with the actual land bank ID if dynamic

  //   try {
  //     const result = await updateDataAfterApproval(formData);

  //     if (result.data) {
  //       toast.success("Data updated successfully!");
  //       navigate('/landbank'); 
  //     } else if (result.error) {
  //       toast.error("Failed to update data. Please try again.");
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred. Please try again.");
  //   }
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   // Create a new FormData object
  //   const formData = new FormData();
  
  //   // Add text fields
  //   formData.append('land_name', locationInput);
  //   formData.append('land_category', selectedCategory);
  
  //   // Add files for each input
  //   Object.keys(fileInputs).forEach(field => {
  //     fileInputs[field].forEach((file, index) => {
  //       // Append each file with a unique name
  //       formData.append(`${field}_${index}`, file);
  //     });
  //   });
  
  //   try {
  //     // Use your mutation hook to send the FormData
  //     const response = await updateDataAfterApproval(formData);
      
  //     if (response.data) {
  //       toast.success('Land documents uploaded successfully');
  //       navigate('/land-bank'); // Navigate after successful upload
  //     }
  //   } catch (error) {
  //     toast.error('Failed to upload documents');
  //     console.error(error);
  //   }
  // };
  const handleSubmit = async () => {
    // Validation
    if (!selectedCategory || !locationInput) {
      if (!selectedCategory) {
        toast.error('Land category is required.');
      }
      if (!locationInput) {
        toast.error('Land name is required.');
      }
      return;
    }
  
    const formData = new FormData();
    formData.append('land_category_id', selectedCategory);
    formData.append('land_name', locationInput);
    formData.append('land_bank_id',26)
  
    // Dynamically append files for each input type
    // const fileFields = [
    //   'dilr', 'na65Permission', 'revenueRecords', 'tsr', 
    //   'coordinateVerification', 'encumbranceNoc', 'leaseDeed', 
    //   'developerPermission', 'nocMinistryOfDefence', 'nocAirportAuthority',
    //   'nocForestDepartment','nocGeologyMining','canalCrossing','railwayCrossing',
    //   'anylineshiftpermisson','gasPipelineCrossing','roadCrossing','transmissionLineCrossing',
    //   'gramPanchayatPermission','municipalCorporationPermission','listofapprovalreq',
    //   'otherApprovals'
    // ];

    // fileFields.forEach(field => {
    //   fileInputs[field].forEach((file, index) => {
    //     formData.append(`${field}_files`, file);
    //   });
    // });
    const fieldMapping = {
      dilr: 'dilr_attachment_file',
      na65Permission: 'na_65b_permission_attachment_file',
      revenueRecords: 'revenue_7_12_records_attachment',
      nocForestDepartment: 'noc_from_forest_and_amp_attachment_file',
      nocGeologyMining: 'noc_from_geology_and_mining_office_attachment_file',
      listofapprovalreq: 'approvals_required_for_transmission_attachment_file',
      canalCrossing: 'canal_crossing_attachment_file',
      leaseDeed: 'lease_deed_attachment_file',
      railwayCrossing: 'railway_crossing_attachment_file',
      gasPipelineCrossing: 'any_gas_pipeline_crossing_attachment_file',
      roadCrossing: 'road_crossing_permission_attachment_file',
      transmissionLineCrossing: 'any_transmission_line_crossing_permission_attachment_file',
      anylineshiftpermisson: 'any_transmission_line_shifting_permission_attachment_file',
      gramPanchayatPermission: 'gram_panchayat_permission_attachment_file',
      municipalCorporationPermission: 'municipal_corporation_permission_file',
      otherApprovals: 'list_of_other_approvals_land_file',
      tsr: 'title_search_report_file',
      coordinateVerification: 'coordinate_verification_file',
      encumbranceNoc: 'encumbrance_noc_file',
      developerPermission: 'developer_permission_file',
      nocMinistryOfDefence: 'noc_from_ministry_of_defence_file'
    };
  
    Object.entries(fieldMapping).forEach(([stateField, backendField]) => {
      fileInputs[stateField].forEach(file => {
        formData.append(backendField, file);
      });
    });
  
  
    try {
      const response = await updateDataAfterApproval(formData).unwrap();
      toast.success('Land documents updated successfully');
      // navigate('/land-bank');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update land documents');
    }
  };
  return (
    <div className="p-6 max-w-4xl max-h-[95%] overflow-y-auto mx-auto bg-white rounded-md shadow-md my-10">
      <h2 className="text-2xl font-semibold text-[#29346B] mb-5">Add Land</h2>

      <label className="block mb-1 text-[#29346B] text-lg font-semibold">
        Land Title <span className="text-red-600"> *</span>
      </label>
      <input
        type="text"
        className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
        value={locationInput}
        placeholder="Enter Land Title"
        onChange={(e) => setLocationInput(e.target.value)}
      />

      {/* Category */}
      <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
        Select Category <span className="text-red-600"> *</span>
      </label>
      <Autocomplete
        options={categories?.data || []}
        getOptionLabel={(option) => option.category_name}
        value={
          categories?.data.find(
            (category) => category.id === selectedCategory
          ) || null
        }
        onChange={(event, newValue) =>
          setSelectedCategory(newValue ? newValue.id : null)
        }
        renderInput={(params) => (
          <TextField
            className="outline-none"
            {...params}
            variant="outlined"
            placeholder="Search and select a category"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                border: "1px solid #FACC15",
                borderBottom: "4px solid #FACC15",
                borderRadius: "6px",
              },
              "& .MuiOutlinedInput-root.Mui-focused": {
                border: "none",
                borderRadius: "4px",
              },
            }}
          />
        )}
      />
      <div className="mt-6">
        <div className="flex justify-between mb-4">
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              DILR (Upload) <span className="text-red-600"> *</span>
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "dilr")}
              multiple 
            />
          </div>
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              NA/65B Permission (Upload) <span className="text-red-600"> *</span>
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "na65Permission")}
              required
              multiple 
            />
          </div>
        </div>

        <div className="flex justify-between mb-4">
          {/* 7/12 Revenue Records & TSR Upload */}
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              7/12 Revenue Records (Upload) <span className="text-red-600"> *</span>
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "revenueRecords")}
              multiple 
            />
          </div>
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              TSR - Title Search Report (Upload) <span className="text-red-600"> *</span>
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "tsr")}
              multiple 
            />
          </div>
        </div>

        <div className="flex justify-between mb-4">
          {/* Coordinate Verification & Encumbrance NOC Upload */}
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Coordinate verification from GEDA/other(Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "coordinateVerification")}
              multiple 
            />
          </div>
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Encumbrance NOC (Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "encumbranceNoc")}
              multiple 
            />
          </div>
        </div>
        <div className="flex justify-between mb-4">
          {/* duplicate */}

          {/* 7/12 Revenue Records & TSR Upload */}
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Lease Deed with farmer to KP group of companies/ Client (Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "leaseDeed")}
              multiple 
            />
          </div>
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Developer permission
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "developerPermission")}
              multiple 
            />
          </div>
        </div>
        <div className="flex justify-between mb-4">
          {/* 7/12 Revenue Records & TSR Upload */}
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              NOC From Ministry Of Defence(Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, " nocMinistryOfDefence")}
              multiple 
            />
          </div>
        </div>

        <div className="flex justify-between mb-4">
          {/* 7/12 Revenue Records & TSR Upload */}
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              NOC from Airport Authority of India
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "nocMinistryOfDefence")}
              multiple 
            />
          </div>
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              NOC from Forest & Environmental Department (Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "nocForestDepartment")}
              multiple 
            />
          </div>
        </div>
        <div className="flex justify-between mb-4">
          {/* 7/12 Revenue Records & TSR Upload */}
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              NOC from Geology and Mining Office (Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "nocGeologyMining")}
              multiple 
            />
          </div>
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Canal Crossing (Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "canalCrossing")}
              multiple 
            />
          </div>
        </div>
        <div className="flex justify-between mb-4">
          {/* 7/12 Revenue Records & TSR Upload */}
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Railway Crossing (Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "railwayCrossing")}
              multiple 
            />
          </div>
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Any Gas Pipeline Crossing(Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "gasPipelineCrossing")}
              multiple 
            />
          </div>
        </div>
        <div className="flex justify-between mb-4">
          {/* 7/12 Revenue Records & TSR Upload */}
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Road crossing Permission (Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "roadCrossing")}
              multiple 
            />
          </div>
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Any Transmission Line Crossing Permission (Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "transmissionLineCrossing")}
              multiple 
            />
          </div>
        </div>
        <div className="flex justify-between mb-4">
          {/* 7/12 Revenue Records & TSR Upload */}
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Any Transmission Line Shifting Permission(Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "anylineshiftpermisson")}
              multiple 
            />
          </div>
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              List of approvals required for transmission line (Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "tsr")}
              multiple 
            />
          </div>
        </div>
        <div className="flex justify-between mb-4">
          {/* 7/12 Revenue Records & TSR Upload */}
          <div className="w-[88%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Gram Panchayat Permission(Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "gramPanchayatPermission")}
              multiple 
            />
          </div>
        </div>
        <div className="flex justify-between mb-4">
          {/* 7/12 Revenue Records & TSR Upload */}
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Municipal Corporation Permission(Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) =>
                handleFileChange(e, "municipalCorporationPermission")
                
              }
              multiple 
            />
          </div>
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              List of other approvals required for land(Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "otherApprovals")}
              multiple 
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 text-center">
        <Button
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#F6812D",
            color: "#FFFFFF",
            fontSize: "16px",
            padding: "6px 36px",
            width: "200px",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#E66A1F",
            },
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
