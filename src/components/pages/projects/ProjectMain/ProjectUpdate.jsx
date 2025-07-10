import React, { useEffect, useRef, useState } from "react";
import { Autocomplete, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useGetProjectDataByIdQuery, useUpdateProjectByIdMutation } from "../../../../api/users/projectApi";
import { useGetElectricityLinesQuery } from "../../../../api/General/Electricity-line/ElectricityLineApi";

const ciUtilityOptions = [
  { id: "ci", label: "CI" },
  { id: "utility", label: "Utility" },
];

const cppIppOptions = [
  { id: "cpp", label: "CPP" },
  { id: "ipp", label: "IPP" },
  { id: "drebp", label: "DREBP" },
  { id: "kusum", label: "Kusum" },
];

function ProjectUpdateModal({ isOpen, onClose, project, handleRefetch }) {
  const ModalRef = useRef(null);
  const [updateProject, { isLoading }] = useUpdateProjectByIdMutation();
  const [projectName, setProjectName] = useState("");
  const [ciUtility, setCiUtility] = useState(null);
  const [cppIpp, setCppIpp] = useState(null);
  const [electricityLine, setElectricityLine] = useState(null);
  const [allotedLandArea, setAllotedLandArea] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const { data, isLoading: ElectricityLineLoading } = useGetElectricityLinesQuery();
  const electricityLineOptions = data?.data || [];

  // Initialize form data when project or electricity line options change
  useEffect(() => {
    if (project) {
      setProjectName(project?.project_name || "");
      setAllotedLandArea(project?.alloted_land_area || "");
      
      // Format dates for input fields (YYYY-MM-DD)
      setStartDate(project?.start_date ? project.start_date.split('T')[0] : "");
      setEndDate(project?.end_date ? project.end_date.split('T')[0] : "");

      // Initialize dropdowns
      setCiUtility(ciUtilityOptions.find(opt => opt.id === project?.ci_or_utility) || null);
      setCppIpp(cppIppOptions.find(opt => opt.id === project?.cpp_or_ipp) || null);
      
      // Initialize electricity line when options are available
      if (electricityLineOptions.length > 0) {
        setElectricityLine(
          electricityLineOptions.find(opt => opt.id === project?.electricity_name) || null
        );
      }
    }
  }, [project, electricityLineOptions]);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ModalRef.current && !ModalRef.current.contains(e.target)) {
        // Check if the click is on a Material-UI dropdown/popper element
        const isAutocompleteClick = e.target.closest('.MuiAutocomplete-popper') || 
                                   e.target.closest('.MuiPopper-root') ||
                                   e.target.closest('[role="listbox"]') ||
                                   e.target.closest('[role="option"]') ||
                                   e.target.closest('.MuiAutocomplete-option');
        
        // Only close if it's not a click on autocomplete elements
        if (!isAutocompleteClick) {
          onClose();
        }
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, isOpen]);

  // Clear error when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError("");
    }
  }, [isOpen]);

  const getLineLabel = (option) => {
    return option?.electricity_line || "";
  };

  const validateForm = () => {
    // Check required fields
    if (!projectName.trim()) {
      setError("Project name is required");
      return false;
    }

    // Validate land area
    const available = parseFloat(project?.available_land_area);
    const alloted = parseFloat(allotedLandArea);

    if (!allotedLandArea || isNaN(alloted) || alloted <= 0) {
      setError("Alloted land area must be a valid positive number");
      return false;
    }

    if (alloted > available) {
      setError(`Alloted area must be ≤ ${available}`);
      return false;
    }

    // Validate dates if both are provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start > end) {
        setError("Start date must be before end date");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    const payload = {
      project_id: project?.id,
      project_name: projectName.trim(),
      ci_or_utility: ciUtility?.id || "",
      cpp_or_ipp: cppIpp?.id || "",
      electricity_line_id: electricityLine?.id || "",
      alloted_land_area: allotedLandArea,
      start_date: startDate || "",
      end_date: endDate || "",
    };

    try {
      const result = await updateProject(payload).unwrap();
      
      // Check if the API returned success status
      if (result?.status === true) {
        toast.success(result?.message || "Project updated successfully!");
        onClose();
        if (handleRefetch) {
          handleRefetch();
        }
      } else {
        // Handle case where API returns success but status is false
        const errorMessage = result?.message || "Failed to update project";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Update error:", err);
      
      // Handle different types of errors
      let errorMessage = "Failed to update project. Please try again.";
      
      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div ref={ModalRef} className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Update Project</h2>
          <button 
            onClick={handleCancel} 
            className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
            type="button"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">CI or Utility</label>
            <Autocomplete
              options={ciUtilityOptions}
              getOptionLabel={(option) => option?.label || ""}
              value={ciUtility}
              onChange={(_, value) => setCiUtility(value)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  placeholder="Select CI/Utility"
                  variant="outlined"
                />
              )}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">CPP or IPP</label>
            <Autocomplete
              options={cppIppOptions}
              getOptionLabel={(option) => option?.label || ""}
              value={cppIpp}
              onChange={(_, value) => setCppIpp(value)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  placeholder="Select CPP/IPP"
                  variant="outlined"
                />
              )}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Electricity Line</label>
            <Autocomplete
              options={electricityLineOptions}
              getOptionLabel={getLineLabel}
              value={electricityLine}
              onChange={(_, value) => setElectricityLine(value)}
              loading={ElectricityLineLoading}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  placeholder="Select Electricity Line"
                  variant="outlined"
                />
              )}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Alloted Land Area <span className="text-red-500">*</span>
              {project?.available_land_area && (
                <span className="text-sm text-gray-500"> (≤ {project.available_land_area})</span>
              )}
            </label>
            <input
              type="number"
              value={allotedLandArea}
              onChange={(e) => setAllotedLandArea(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter alloted land area"
              min="0"
              step="0.01"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm mt-1 p-2 bg-red-50 rounded border border-red-200">
              {error}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="button"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectUpdateModal;