import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete } from "@mui/material";
import { useGetMainProjectsQuery } from "../../../api/users/projectApi";
import { useCreateMaterialMutation, useGetMaterialsQuery } from "../../../api/material/materialApi";
import { toast } from "react-toastify";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

export default function AddMaterialModal({ open, setOpen, onClose }) {
  const { refetch } = useGetMaterialsQuery();
  const [createMaterial] = useCreateMaterialMutation();

  // Client/Vendor related states
  const [clientVendorChoice, setClientVendorChoice] = useState("");
  const [clientName, setClientName] = useState("");
  const [vendorName, setVendorName] = useState("");

  // Other form states
  const [materialName, setMaterialName] = useState("");
  const [materialNumber, setMaterialNumber] = useState("");
  const [uom, setUom] = useState("");
  const [price, setPrice] = useState("");
  const [prNumber, setPrNumber] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [quantity, setQuantity] = useState("");
  const [projectName, setProjectName] = useState("");
  const [prDate, setPrDate] = useState("");
  const [poDate, setPoDate] = useState("");
  const [materialRequiredDate, setMaterialRequiredDate] = useState("");

  const { data: projects, error, isLoading } = useGetMainProjectsQuery();

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setClientVendorChoice("");
    setClientName("");
    setVendorName("");
    setMaterialName("");
    setMaterialNumber("");
    setUom("");
    setPrice("");
    setPrNumber("");
    setPoNumber("");
    setQuantity("");
    setProjectName("");
    setPrDate("");
    setPoDate("");
    setMaterialRequiredDate("");
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!clientVendorChoice) {
      toast.error("Please select Client or Vendor");
      return;
    }

    if (clientVendorChoice === "client" && !clientName) {
      toast.error("Please enter Client Name");
      return;
    }

    if (clientVendorChoice === "vendor" && !vendorName) {
      toast.error("Please enter Vendor Name");
      return;
    }

    // Required fields validation
    const requiredFields = {
      "Material Number": materialNumber,
      "Material Name": materialName,
      "UOM": uom,
      "Price": price,
      "PR Number": prNumber,
      "PO Number": poNumber,
      "Quantity": quantity,
      "Project": projectName,
      "PR Date": prDate,
      "PO Date": poDate,
      "Material Required Date": materialRequiredDate
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        toast.error(`${field} is required`);
        return;
      }
    }

    // Numeric validations
    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a positive number");
      return;
    }

    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Quantity must be a positive number");
      return;
    }

    // Create form data
    const formData = {
      client_vendor_choices: clientVendorChoice,
      client_name: clientVendorChoice === "client" ? clientName : "",
      vendor_name: clientVendorChoice === "vendor" ? vendorName : "",
      material_number: materialNumber,
      material_name: materialName,
      uom: uom,
      price: price,
      PR_number: prNumber,
      pr_date: prDate,
      PO_number: poNumber,
      po_date: poDate,
      material_required_date: materialRequiredDate,
      quantity: quantity,
      project_id: projectName
    };

    try {
      const response = await createMaterial(formData).unwrap();
      if (response.status) {
        toast.success("Material created successfully!");
        refetch();
        handleClose();
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      console.error("Error creating material:", error);
      toast.error("Error creating material. Please try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: {
          width: "700px",
        },
      }}
    >
      <DialogTitle className="text-[#29346B] text-2xl font-semibold mb-5">
        Add Material
      </DialogTitle>
      <DialogContent>
        {/* Client/Vendor Selection */}
        <div className="mb-4">
          <FormControl fullWidth>
            {/* <InputLabel>Select Type *</InputLabel> */}
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                 Client or Vendor<span className="text-red-600"> *</span>
              </label>
            <Select
              value={clientVendorChoice}
              onChange={(e) => setClientVendorChoice(e.target.value)}
              className="border-yellow-300 border-b-4"
            >
              <MenuItem value="client">Client</MenuItem>
              <MenuItem value="vendor">Vendor</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Conditional Client/Vendor Name Input */}
        <div className="mb-4">
          {clientVendorChoice === "client" && (
            <div className="w-full">
              <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                Client Name<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                value={clientName}
                placeholder="Enter Client Name"
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
          )}
          {clientVendorChoice === "vendor" && (
            <div className="w-full">
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
          )}
        </div>

        {/* Material Details - First Row */}
        <div className="flex gap-4 mb-4">
          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Material Number<span className="text-red-600"> *</span>
            </label>
            <input
              type="text"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              value={materialNumber}
              placeholder="Enter Material Number"
              onChange={(e) => setMaterialNumber(e.target.value)}
            />
          </div>
          <div className="w-full">
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

        {/* Material Details - Second Row */}
        <div className="flex gap-4 mb-4">
          <div className="w-full">
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
          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Price<span className="text-red-600"> *</span>
            </label>
            <input
              type="number"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              value={price}
              placeholder="Enter Price"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        {/* PR Details */}
        <div className="flex gap-4 mb-4">
          <div className="w-full">
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
          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              PR Date<span className="text-red-600"> *</span>
            </label>
            <input
              type="date"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              value={prDate}
              onChange={(e) => setPrDate(e.target.value)}
            />
          </div>
        </div>

        {/* PO Details */}
        <div className="flex gap-4 mb-4">
          <div className="w-full">
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
          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              PO Date<span className="text-red-600"> *</span>
            </label>
            <input
              type="date"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              value={poDate}
              onChange={(e) => setPoDate(e.target.value)}
            />
          </div>
        </div>

        {/* Quantity and Material Required Date */}
        <div className="flex gap-4 mb-4">
          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Quantity<span className="text-red-600"> *</span>
            </label>
            <input
              type="number"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              value={quantity}
              placeholder="Enter Quantity"
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Material Required Date<span className="text-red-600"> *</span>
            </label>
            <input
              type="date"
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              value={materialRequiredDate}
              onChange={(e) => setMaterialRequiredDate(e.target.value)}
            />
          </div>
        </div>

        {/* Project Selection */}
        <div className="mb-4">
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
              value={projects?.data?.find((project) => project.id === projectName) || null}
              onChange={(event, newValue) => setProjectName(newValue?.id || "")}
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
            Submit
          </Button>
        </DialogActions>
      </Dialog>
  );
}

