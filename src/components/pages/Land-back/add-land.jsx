import React, { useState } from "react";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useGetLandCategoriesQuery } from "../../../api/users/categoryApi";
import { useLocation } from "react-router-dom";

export default function AddLandDoc() {
  const location = useLocation();
  const { landData } = location.state || {};
  const [nearbyArea, setNearbyArea] = useState("");
  const [landArea, setLandArea] = useState("");
  const [selectedLandBank, setSelectedLandBank] = useState(null);
  const [locationInput, setLocationInput] = useState(landData.land_name);
  const { data: categories, isLoading, isError } = useGetLandCategoriesQuery();
  const [selectedCategory, setSelectedCategory] = useState(
    categories?.data.find(
      (category) => category.id === landData.land_category
    ) || null
  );
  const [fileInputs, setFileInputs] = useState({
    dilr: null,
    na65Permission: null,
    revenueRecords: null,
    tsr: null,
    coordinateVerification: null,
    encumbranceNoc: null,
    leaseDeed: null,
    developerPermission: null,
    nocMinistryOfDefence: null,
    nocAirportAuthority: null,
    nocForestDepartment: null,
    nocGeologyMining: null,
    canalCrossing: null,
    railwayCrossing: null,
    anylineshiftpermisson: null,
    gasPipelineCrossing: null,
    roadCrossing: null,
    transmissionLineCrossing: null,
    gramPanchayatPermission: null,
    municipalCorporationPermission: null,
    listofapprovalreq: null,
    otherApprovals: null,
  });
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFileInputs((prevState) => ({ ...prevState, [field]: file }));
    }
  };
  const handleSubmit = () => {
    if (!selectedLandBank) {
      toast.error("Please select a land bank!");
      return;
    }
    if (!fileInputs.na65Permission) {
      toast.error("NA/65 Permission is mandatory!");
      return;
    }
    const formData = {
      land_bank_id: selectedLandBank.id,
      land_bank_location_name: locationInput,
      total_land_area: landArea,
      near_by_area: nearbyArea,
      files: fileInputs,
    };
    console.log(formData);
    toast.success("Location added successfully!");
  };
  return (
    <div className="p-6 max-w-4xl max-h-[900px] overflow-y-auto mx-auto bg-white rounded-md shadow-md my-10">
      <h2 className="text-2xl font-semibold text-[#29346B] mb-5">Add Land</h2>

      {/* Land Title */}
      <label className="block mb-1 text-[#29346B] text-lg font-semibold">
        Land Title
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
        Select Category
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
      {/* File Uploads Section */}
      <div className="mt-6">
        <div className="flex justify-between mb-4">
          {/* DILR & NA/65 Permission Upload */}
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              DILR (Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "dilr")}
            />
          </div>
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              NA/65B Permission (Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "na65Permission")}
              required
            />
          </div>
        </div>

        <div className="flex justify-between mb-4">
          {/* 7/12 Revenue Records & TSR Upload */}
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              7/12 Revenue Records (Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "revenueRecords")}
            />
          </div>
          <div className="w-[48%]">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              TSR - Title Search Report (Upload)
            </label>
            <input
              type="file"
              className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl bg-white-500"
              onChange={(e) => handleFileChange(e, "tsr")}
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
