import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import Button from '@mui/material/Button';
import { useAddInspectionMutation } from '../../../api/inspection/inspectionApi';
import { toast } from 'react-toastify';

function InspectionModal({ open, handleClose, refetch, materialToEdit }) {
  const [addInspection, { isLoading }] = useAddInspectionMutation();
  console.log("Material Inspection", materialToEdit);



  const [formData, setFormData] = useState({
    material_id: materialToEdit?.id || "", 
    inspection_date: "",
    inspection_quality_report: "",
    remarks: "",
    files: []
  });
  const setInputData = ()=>{
    setFormData({
      material_id: null, 
      inspection_date: "",
      inspection_quality_report: "",
      remarks: "",
      files: []
    })
  }

  useEffect(()=>{
    setInputData()
  },[materialToEdit])

  useEffect(() => {
    if (materialToEdit) {
      setFormData(prevData => ({
        ...prevData,
        material_id: materialToEdit.id || ""
      }));
    }
  }, [materialToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        files: [...prevData.files, ...Array.from(e.target.files)]
      }));
    }
  };

  const validateForm = () => {
    return (
      formData.material_id !== "" &&
      formData.inspection_date !== "" &&
      formData.inspection_quality_report.trim() !== "" &&
      formData.remarks.trim() !== ""
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill all the required fields.")
      // alert("Please fill out all required fields.");
      return;
    }
    
    const data = new FormData();
    data.append('material_id', formData.material_id);
    data.append('inspection_date', formData.inspection_date);
    data.append('inspection_quality_report', formData.inspection_quality_report);
    data.append('remarks', formData.remarks);

    formData.files.forEach(file => {
      data.append('inspection_quality_report_attachments', file);
    });

    try {
      let response =await addInspection(data).unwrap();
      if(response?.status){
        toast.success("Inspection Added Successfully")
      }else{
        toast.error(response?.message)
      }
      setInputData();
      refetch();
      handleClose();
      
    } catch (error) {
      console.error("Error submitting inspection:", error);
      alert("Failed to submit inspection. Please try again.");
      toast.error("Something went wrong")
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
          width: '700px',
          paddingBottom: '15px'
        }
      }}
    >
      <h2 className="text-2xl my-6 text-center font-semibold text-[#29346B] mb-5">Add Inspection</h2>
      <DialogContent>
        <div className="mb-4">
          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Inspection Date<span className="text-red-600"> *</span>
            </label>
            <input
              type="date"
              name="inspection_date"
              value={formData.inspection_date}
              onChange={handleChange}
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Inspection Quality Report<span className="text-red-600"> *</span>
            </label>
            <textarea
              name="inspection_quality_report"
              value={formData.inspection_quality_report}
              onChange={handleChange}
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              rows={3}
            ></textarea>
          </div>

          <div className="w-full">
            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
              Remarks<span className="text-red-600"> *</span>
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
              rows={2}
            ></textarea>
          </div>

          <label className="block mb-1 text-[#29346B] text-lg font-semibold">
            Upload Attachments (Multiple Files Allowed)
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full my-1 cursor-pointer border rounded-md border-yellow-300 border-b-4 border-b-yellow-400 outline-none file:bg-yellow-300 file:p-2 file:border-none file:rounded-md"
          />
          {formData.files.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              {formData.files.length} file(s) selected
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{
            backgroundColor: '#F6812D',
            color: '#FFFFFF',
            fontSize: '16px',
            padding: '6px 36px',
            width: '200px',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#E66A1F',
            },
          }}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default InspectionModal;
