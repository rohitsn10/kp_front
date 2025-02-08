import React, { useState,useEffect } from "react";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useGetLandCategoriesQuery } from "../../../api/users/categoryApi";
import { useLocation } from "react-router-dom";
import { useAddDataAfterApprovalLandBankMutation, useUpdateDataAfterApprovalLandBankMutation } from "../../../api/users/landbankApi";
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

useEffect(() => {
  console.log("Received landData:", landData);
}, []);

  // Use the mutation hook
  const [addDataAfterApprovalLandBank, { isLoading: isUpdating }] =
  useAddDataAfterApprovalLandBankMutation();
  // console.log("File Inputs",fileInputs);

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    setFileInputs((prevState) => ({
      ...prevState,
      [field]: [...(prevState[field] || []), ...files], // Ensure it's an array
    }));
  };
  
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
    if(landData?.id == null){
      return <>No valid ID Present:</>
    }
    formData.append('land_category_id', selectedCategory);
    formData.append('land_name', locationInput);
    formData.append('land_bank_id',landData?.id)
  
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
      const response = await addDataAfterApprovalLandBank(formData).unwrap();
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
