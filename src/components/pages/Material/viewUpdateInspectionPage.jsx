import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetInspectionByMaterialIdQuery,useApproveInspectionMutation } from "../../../api/inspection/inspectionApi";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import FormatDateAndTime from "../../../utils/dateUtils";

function ViewUpdateInspectionDetails() {
    const { materialId } = useParams();
    const { data: inspectionFetchData, error, isLoading,refetch } = useGetInspectionByMaterialIdQuery(materialId);
    const [approveInspection, { isLoading: isApproving }] = useApproveInspectionMutation();
    const inspectionData = inspectionFetchData?.data[0];
    console.log(inspectionData)
    const [formData, setFormData] = useState({
        is_approved_date: "",
        is_approved_remarks: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error fetching data</p>;

    const handleSubmit = async () => {
        if (!inspectionData) return;
        try {
            await approveInspection({
                inspectionId: inspectionData.id,
                body: formData,
            }).unwrap();
            alert("Inspection approved successfully");
            toast.success("Inspection Status updated.")
            refetch()
            
        } catch (err) {
            toast.success("Inspection Update Failed.")
        }
    };


    if (!inspectionData) {
        return (
            <div className="p-6 max-w-4xl mx-auto bg-white rounded-md shadow-md my-10">
                <p className="text-center text-gray-500 text-lg">
                    Inspection details not found, please add.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-md shadow-md my-10">
            <h2 className="text-2xl text-center font-semibold text-[#29346B] mb-5">
                View Inspection Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Inspector Name" value={inspectionData?.user_full_name} />
                <DetailItem label="Inspection Date" value={new Date(inspectionData?.inspection_date).toLocaleDateString()} />
                <DetailItem label="Quality Report" value={inspectionData?.inspection_quality_report} />
                <DetailItem label="Remarks" value={inspectionData?.remarks} />
                <DetailItem label="Inspection Status" value={inspectionData?.is_inspection ? "Completed" : "Pending"} />
                <DetailItem label="Approval Status" value={inspectionData?.is_approved ? "Approved" : "Not Approved"} />
                {inspectionData?.is_approved && (
                    <DetailItem label="Approved By" value={inspectionData?.is_approved_by_full_name || "N/A"} />
                )}
                {inspectionData?.is_approved && (
                    <DetailItem label="Approve Remarks" value={inspectionData?.remarks || "N/A"} />
                )}
                {inspectionData?.is_approved && (
                    <DetailItem label="Approval Date" value={FormatDateAndTime(inspectionData?.is_approved_date) || "N/A"} />
                )}
            </div>

            <h3 className="text-xl font-semibold text-[#29346B] mt-6 mb-3">Attachments</h3>
            <div className="grid grid-cols-2 gap-4">
                <FileItem label="Inspection Reports" files={inspectionData?.inspection_quality_report_attachments} />
            </div>
            
            {/* Approval Form */}
                {
                    !inspectionData?.is_approved && (
                        <div className="grid grid-cols-1 gap-4">
                <div className="w-full">
                    <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                        Approval Date<span className="text-red-600"> *</span>
                    </label>
                    <input
                        type="date"
                        name="is_approved_date"
                        value={formData.is_approved_date}
                        onChange={handleChange}
                        className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                    />
                </div>
                <div className="w-full">
                    <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                        Approval Remarks<span className="text-red-600"> *</span>
                    </label>
                    <textarea
                        name="is_approved_remarks"
                        value={formData.is_approved_remarks}
                        placeholder="Add Remarks"
                        onChange={handleChange}
                        className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                        rows={3}
                    ></textarea>
                </div>
                {/* <button
                onClick={handleSubmit}
                disabled={isApproving}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
                {isApproving ? "Approving..." : "Submit Approval"}
            </button> */}
            <div className="flex flex-row justify-center items-center">
                <Button
                onClick={handleSubmit}
                disabled={isApproving}

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
          </div>
            </div>
                    )
                }
            {/* <h3 className="text-xl font-semibold text-[#29346B] mt-6 mb-3">Approval Details</h3> */}


        </div>
    );
}

const DetailItem = ({ label, value }) => (
    <div className="border p-3 rounded-md bg-gray-100">
        <strong>{label}:</strong> {value || "N/A"}
    </div>
);

const FileItem = ({ label, files }) => (
    <div className="border p-3 rounded-md bg-gray-100">
        <strong>{label}:</strong>
        {files && files.length > 0 ? (
            files.map((file, index) => (
                <div key={index}>
                    <a 
                        href={file?.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 underline ml-2"
                    >
                        View File
                    </a>
                </div>
            ))
        ) : (
            <span> No file available</span>
        )}
    </div>
);

export default ViewUpdateInspectionDetails;
