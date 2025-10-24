import React, { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useAddDataAfterApprovalLandBankMutation } from "../../../api/users/landbankApi";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../context/AuthContext";

export default function AddLandDoc() {
  const location = useLocation();
  const { landData } = location.state || {};
  const navigate = useNavigate();
        const { permissions } = useContext(AuthContext);
    
      useEffect(()=>{
            const userGroup = permissions?.group?.name;
        const allowedGroups = [
          'ADMIN',
          'LAND_HOD_FULL',
          'LAND_MANAGER_FULL', 
          'LAND_SPOC_FULL',
          'LAND_AM_FULL',
          'LAND_EXECUTIVE_FULL',
          'PROJECT_HOD_FULL',
          'PROJECT_MANAGER_FULL',
          'PROJECT_ENGINEER_FULL',
        ];
            if (permissions && !allowedGroups.includes(userGroup)) {
          navigate('/'); // or navigate('/home') depending on your route
        }
      },[permissions,navigate])
  
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

  const [addDataAfterApprovalLandBank, { isLoading: isUpdating }] =
    useAddDataAfterApprovalLandBankMutation();

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    setFileInputs((prevState) => ({
      ...prevState,
      [field]: [...(prevState[field] || []), ...files],
    }));
  };
  
  const handleSubmit = async () => {
    // Validation for required file uploads
    const requiredFields = [
      { field: 'dilr', label: 'DILR' },
      { field: 'na65Permission', label: 'NA/65B Permission' },
      { field: 'revenueRecords', label: '7/12 Revenue Records' },
      { field: 'tsr', label: 'TSR - Title Search Report' }
    ];

    let hasError = false;
    
    for (const { field, label } of requiredFields) {
      if (!fileInputs[field] || fileInputs[field].length === 0) {
        toast.error(`${label} is required.`);
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }
  
    const formData = new FormData();
    if(landData?.id == null){
      toast.error('No valid ID present.');
      return;
    }
    formData.append('land_bank_id', landData?.id)
  
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
      nocMinistryOfDefence: 'noc_from_ministry_of_defence_file',
      nocAirportAuthority: 'noc_from_airport_authority_file'
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
              if (response?.status === false) {
            // Show backend error message
            toast.error(response?.message || 'Failed to update land documents');
        } else {
            // Success case
            toast.success(response?.message || 'Land documents updated successfully');
            // Redirect to land bank page after successful submission
            navigate('/landbank');
        }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update land documents');
    }
  };

  return (
    <div className="p-6 max-w-4xl max-h-[95%] overflow-y-auto mx-auto bg-white rounded-md shadow-md my-10">
      <h2 className="text-2xl font-semibold text-[#29346B] mb-5">Add Land Attachments</h2>

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
              multiple 
            />
          </div>
        </div>

        <div className="flex justify-between mb-4">
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
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              NOC From Ministry Of Defence(Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "nocMinistryOfDefence")}
              multiple 
            />
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              NOC from Airport Authority of India
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "nocAirportAuthority")}
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
              onChange={(e) => handleFileChange(e, "listofapprovalreq")}
              multiple 
            />
          </div>
        </div>
        <div className="flex justify-between mb-4">
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

      <div className="mt-6 text-center">
        <Button
          onClick={handleSubmit}
          disabled={isUpdating}
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
            "&:disabled": {
              backgroundColor: "#CCC",
              color: "#888",
            },
          }}
        >
          {isUpdating ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
