import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete } from "@mui/material";
import { useGetMainProjectsQuery } from "../../../api/users/projectApi";
import { useGetActivitiesQuery } from "../../../api/users/projectActivityApi";
import { useGetDropdownSubActivitiesQuery } from "../../../api/users/subActivityApi";
import { useGetSubSubActivityQuery } from "../../../api/users/multipleActivityApi";
import { useUpdateMaterialMutation } from "../../../api/users/materialApi";

export default function EditMaterialModal({
  open,
  setOpen,
  materialToEdit,
  onClose,
}) {
  // Initialize state with materialToEdit data
  console.log("materialin edit ",materialToEdit)
  const [vendorName, setVendorName] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [uom, setUom] = useState("");
  const [price, setPrice] = useState("");
  const [endDate, setEndDate] = useState("");
  const [prNumber, setPrNumber] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState(""); // New state for status
  const [paymentStatus, setPaymentStatus] = useState(""); // New state for payment status
  const [projectName, setProjectName] = useState("");
  const [selectedSubActivity, setSelectedSubActivity] = useState(null);
  const [selectedSubSubActivity, setSelectedSubSubActivity] = useState(null);
  const [selectedProjectActivity, setSelectedProjectActivity] = useState(null);
  const {
    data: activityData,
    error: activityError,
    isLoading: activityLoading,
  } = useGetActivitiesQuery();
  const {
    data: subActivityData,
    error: subActivityError,
    isLoading: subActivityLoading,
  } = useGetDropdownSubActivitiesQuery(selectedProjectActivity?.value, {
    skip: !selectedProjectActivity, // Skip fetching until a project activity is selected
  });
  const [updateMaterial] = useUpdateMaterialMutation();
  const {
    data: subSubActivityData,
    error: subSubActivityError,
    isLoading: subSubActivityLoading,
  } = useGetSubSubActivityQuery(
    selectedSubActivity?.value,
    { skip: !selectedSubActivity } // Skip fetching until a sub activity is selected
  );

  const { data: projects, error, isLoading } = useGetMainProjectsQuery();

  const activityOptions =
    activityData?.data?.map((item) => ({
      label: item.activity_name,
      value: item.id,
    })) || [];

  const subActivityOptions =
    subActivityData?.data?.[0]?.sub_activity?.map((item) => ({
      label: item.sub_activity_name,
      value: item.sub_activity_id,
    })) || [];

  const subSubActivityOptions =
    subSubActivityData?.data?.[0]?.sub_activity?.map((item) => ({
      label: item.sub_sub_activities[0]?.sub_sub_activity_name || "N/A", // Using the sub_sub_activity_name from the API response
      value: item.sub_sub_activities[0]?.sub_sub_activity_id || 0,
    })) || [];
  // Populate form fields when modal is opened
  useEffect(() => {
    if (materialToEdit) {
      setVendorName(materialToEdit.vendorName);
      setMaterialName(materialToEdit.materialName);
      setUom(materialToEdit.uom);
      setPrice(materialToEdit.price);
      setEndDate(materialToEdit.endDate);
      setPrNumber(materialToEdit.prNumber);
      setPoNumber(materialToEdit.poNumber);
      setQuantity(materialToEdit.quantity);
      setStatus(materialToEdit.status);
      setPaymentStatus(materialToEdit.paymentstatus);
      //   setProjectId(materialToEdit.projectId);
      //   setProjectActivityId(materialToEdit.projectActivityId);
      //   setSubActivityId(materialToEdit.subActivityId);
      //   setSubSubActivityId(materialToEdit.subSubActivityId);
    }
  }, [materialToEdit]);

  const handleClose = () => {
   
    onClose(); // Close parent modal as well
  };

  const handleSubmit = async () => {
    // Prepare the data for update
    const updatedMaterial = {
      vendor_name: vendorName,
      material_name: materialName,
      uom: uom,
      price: price,
      end_date: endDate,
      PR_number: prNumber,
      PO_number: poNumber,
      quantity: quantity,
      project_id: projectName,
      projectactivity_id: selectedProjectActivity?.value,
      subactivity_id: selectedSubActivity?.value,
      sub_sub_activity_id: selectedSubSubActivity?.value,
    };

    // API call to update material
    try {
      const response = await updateMaterial({
        id: materialToEdit.id, // Pass the material ID for updating
        data: updatedMaterial,
      });

      if (response?.data?.status) {
        toast.success('Material updated successfully!');
        handleClose();
      } else {
        toast.error('Error updating material.');
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            width: "600px",
          },
        }}
      >
        <DialogTitle className="text-[#29346B] text-2xl font-semibold mb-5">
          Edit Material
        </DialogTitle>
        <DialogContent>
          {/* First Row: Vendor Name and Material Name */}
          <div className="flex justify-between mb-4">
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Vendor Name<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={vendorName}
                placeholder="Enter Vendor Name"
                onChange={(e) => setVendorName(e.target.value)}
              />
            </div>
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Material Name<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={materialName}
                placeholder="Enter Material Name"
                onChange={(e) => setMaterialName(e.target.value)}
              />
            </div>
          </div>

          {/* Second Row: UOM and Price */}
          <div className="flex justify-between mb-4">
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                UOM<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={uom}
                placeholder="Enter UOM"
                onChange={(e) => setUom(e.target.value)}
              />
            </div>
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Price<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={price}
                placeholder="Enter Price"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Third Row: End Date and PR Number */}
          <div className="flex justify-between mb-4">
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                End Date<span className="text-red-600"> *</span>
              </label>
              <input
                type="date"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                PR Number<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={prNumber}
                placeholder="Enter PR Number"
                onChange={(e) => setPrNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Fourth Row: PO Number and Quantity */}
          <div className="flex justify-between mb-4">
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                PO Number<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={poNumber}
                placeholder="Enter PO Number"
                onChange={(e) => setPoNumber(e.target.value)}
              />
            </div>
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Quantity<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={quantity}
                placeholder="Enter Quantity"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Status
              </label>
              <input
                type="text"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={status}
                placeholder="Enter Status"
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Payment Status
              </label>
              <input
                type="text"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={paymentStatus}
                placeholder="Enter Payment Status"
                onChange={(e) => setPaymentStatus(e.target.value)}
              />
            </div>
          </div>

          {/* Dropdowns for Project, Activity, Sub Activity, and Sub Sub Activity */}
          <div className="flex justify-between mb-4">
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Project Name <span className="text-red-600"> *</span>
              </label>
              {isLoading ? (
                <p>Loading projects...</p>
              ) : error ? (
                <p>Error fetching projects</p>
              ) : (
                <Autocomplete
                  options={projects?.data || []}
                  getOptionLabel={(option) => option.project_name}
                  value={
                    projects?.data?.find(
                      (project) => project.id === projectName
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    setProjectName(newValue?.id || "")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Select Project"
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
              )}
            </div>
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Select Project Activity
              </label>
              <Autocomplete
                options={activityOptions}
                getOptionLabel={(option) => option.label}
                value={selectedProjectActivity}
                onChange={(event, newValue) => {
                  setSelectedProjectActivity(newValue);
                  setSelectedSubActivity(null); // Reset sub-activity when activity changes
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Search and select a project activity"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        border: "1px solid #FACC15", // Yellow border
                        borderBottom: "4px solid #FACC15",
                        borderRadius: "6px", // Rounded corners
                      },
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        border: "none",
                        borderRadius: "4px",
                      },
                    }}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-between mb-4">
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Select Sub Activity
              </label>
              <Autocomplete
                options={subActivityOptions}
                getOptionLabel={(option) => option.label}
                value={selectedSubActivity}
                onChange={(event, newValue) => setSelectedSubActivity(newValue)}
                disabled={!selectedProjectActivity} // Disable until a project activity is selected
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Search and select a sub activity"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        border: "1px solid #FACC15", // Yellow border
                        borderBottom: "4px solid #FACC15",
                        borderRadius: "6px", // Rounded corners
                      },
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        border: "none",
                        borderRadius: "4px",
                      },
                    }}
                  />
                )}
              />
            </div>
            <div className="w-[48%]">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Sub Sub Activity <span className="text-red-600"> *</span>
              </label>
              <Autocomplete
                options={subSubActivityOptions}
                getOptionLabel={(option) => option.label}
                value={selectedSubSubActivity}
                onChange={(event, newValue) =>
                  setSelectedSubSubActivity(newValue)
                }
                disabled={!selectedSubActivity} // Disable until a sub activity is selected
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Select Sub Sub Activity"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        border: "1px solid #FACC15", // Yellow border
                        borderBottom: "4px solid #FACC15",
                        borderRadius: "6px", // Rounded corners
                      },
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        border: "none",
                        borderRadius: "4px",
                      },
                    }}
                  />
                )}
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <Button
            onClick={handleSubmit}
            type="submit"
            sx={{
              backgroundColor: "#f6812d",
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
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
