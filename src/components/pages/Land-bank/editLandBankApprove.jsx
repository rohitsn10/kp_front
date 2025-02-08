import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useGetLandCategoriesQuery } from "../../../api/users/categoryApi";
import { useLocation } from "react-router-dom";
import { useGetLandBankApproveDataQuery, useUpdateDataAfterApprovalLandBankMutation } from "../../../api/users/landbankApi";
import { useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';
import { useParams } from "react-router-dom";

function EditLandApproveDoc() {
    const location = useLocation();
    const { id } = useParams();

    console.log("Land ID:", id);
    const { landData } = location.state || {};
    
    const [locationInput, setLocationInput] = useState(landData?.land_name || '');
    const { data: categories } = useGetLandCategoriesQuery();
    // console.log(categories)
    const [selectedCategory, setSelectedCategory] = useState(landData?.land_category || null);
    const navigate = useNavigate();
    const { data: landBankApproveData, isLoading, isError } = useGetLandBankApproveDataQuery(id);
    console.log(landBankApproveData)
    // State for form data including existing files
    const [formData, setFormData] = useState({
        dilr_attachment_file: [],
        na_65b_permission_attachment_file: [],
        revenue_7_12_records_attachment: [],
        noc_from_forest_and_amp_attachment_file: [],
        noc_from_geology_and_mining_office_attachment_file: [],
        approvals_required_for_transmission_attachment_file: [],
        canal_crossing_attachment_file: [],
        lease_deed_attachment_file: [],
        railway_crossing_attachment_file: [],
        any_gas_pipeline_crossing_attachment_file: [],
        road_crossing_permission_attachment_file: [],
        any_transmission_line_crossing_permission_attachment_file: [],
        any_transmission_line_shifting_permission_attachment_file: [],
        gram_panchayat_permission_attachment_file: [],
        municipal_corporation_permission_file: [],
        list_of_other_approvals_land_file: [],
        title_search_report_file: [],
        coordinate_verification_file: [],
        encumbrance_noc_file: [],
        developer_permission_file: [],
        noc_from_ministry_of_defence_file: []
    });

    // State for removed files
    const [removedFiles, setRemovedFiles] = useState({
        dilr_attachment_file: [],
        na_65b_permission_attachment_file: [],
        revenue_7_12_records_attachment: [],
        noc_from_forest_and_amp_attachment_file: [],
        noc_from_geology_and_mining_office_attachment_file: [],
        approvals_required_for_transmission_attachment_file: [],
        canal_crossing_attachment_file: [],
        lease_deed_attachment_file: [],
        railway_crossing_attachment_file: [],
        any_gas_pipeline_crossing_attachment_file: [],
        road_crossing_permission_attachment_file: [],
        any_transmission_line_crossing_permission_attachment_file: [],
        any_transmission_line_shifting_permission_attachment_file: [],
        gram_panchayat_permission_attachment_file: [],
        municipal_corporation_permission_file: [],
        list_of_other_approvals_land_file: [],
        title_search_report_file: [],
        coordinate_verification_file: [],
        encumbrance_noc_file: [],
        developer_permission_file: [],
        noc_from_ministry_of_defence_file: []
    });

    // State for new files
    const [newFiles, setNewFiles] = useState({
        dilr_attachment_file: [],
        na_65b_permission_attachment_file: [],
        revenue_7_12_records_attachment: [],
        noc_from_forest_and_amp_attachment_file: [],
        noc_from_geology_and_mining_office_attachment_file: [],
        approvals_required_for_transmission_attachment_file: [],
        canal_crossing_attachment_file: [],
        lease_deed_attachment_file: [],
        railway_crossing_attachment_file: [],
        any_gas_pipeline_crossing_attachment_file: [],
        road_crossing_permission_attachment_file: [],
        any_transmission_line_crossing_permission_attachment_file: [],
        any_transmission_line_shifting_permission_attachment_file: [],
        gram_panchayat_permission_attachment_file: [],
        municipal_corporation_permission_file: [],
        list_of_other_approvals_land_file: [],
        title_search_report_file: [],
        coordinate_verification_file: [],
        encumbrance_noc_file: [],
        developer_permission_file: [],
        noc_from_ministry_of_defence_file: []
    });
    // console.log("Form ID",landBankApproveData?.data[0]?.id)
    console.log("Full Data",landBankApproveData)
    useEffect(() => {
        if (landBankApproveData?.data?.[0]) {
            const data = landBankApproveData.data[0];
            setFormData(prevState => ({
                ...prevState,
                dilr_attachment_file: data.dilr_attachment_file || [],
                na_65b_permission_attachment_file: data.na_65b_permission_attachment_file || [],
                revenue_7_12_records_attachment: data.revenue_7_12_records_attachment || [],
                noc_from_forest_and_amp_attachment_file: data.noc_from_forest_and_amp_attachment_file || [],
                noc_from_geology_and_mining_office_attachment_file: data.noc_from_geology_and_mining_office_attachment_file || [],
                approvals_required_for_transmission_attachment_file: data.approvals_required_for_transmission_attachment_file || [],
                canal_crossing_attachment_file: data.canal_crossing_attachment_file || [],
                lease_deed_attachment_file: data.lease_deed_attachment_file || [],
                railway_crossing_attachment_file: data.railway_crossing_attachment_file || [],
                any_gas_pipeline_crossing_attachment_file: data.any_gas_pipeline_crossing_attachment_file || [],
                road_crossing_permission_attachment_file: data.road_crossing_permission_attachment_file || [],
                any_transmission_line_crossing_permission_attachment_file: data.any_transmission_line_crossing_permission_attachment_file || [],
                any_transmission_line_shifting_permission_attachment_file: data.any_transmission_line_shifting_permission_attachment_file || [],
                gram_panchayat_permission_attachment_file: data.gram_panchayat_permission_attachment_file || [],
                municipal_corporation_permission_file: data.municipal_corporation_permission_file || [],
                list_of_other_approvals_land_file: data.list_of_other_approvals_land_file || [],
                title_search_report_file: data.title_search_report_file || [],
                coordinate_verification_file: data.coordinate_verification_file || [],
                encumbrance_noc_file: data.encumbrance_noc_file || [],
                developer_permission_file: data.developer_permission_file || [],
                noc_from_ministry_of_defence_file: data.noc_from_ministry_of_defence_file || []
            }));
        }
    }, [landBankApproveData]);

    const [updateDataAfterApproval] = useUpdateDataAfterApprovalLandBankMutation();

    const handleFileChange = (e, field) => {
        const files = Array.from(e.target.files);
        setNewFiles(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), ...files]
        }));
    };

    const handleRemoveFile = (fileId, field) => {
        setRemovedFiles(prev => ({
            ...prev,
            [field]: prev[field].includes(fileId)
                ? prev[field].filter(id => id !== fileId)
                : [...(prev[field] || []), fileId]
        }));
    };

    const handleSubmit = async () => {
        if (!selectedCategory || !locationInput) {
            if (!selectedCategory) toast.error('Land category is required.');
            if (!locationInput) toast.error('Land name is required.');
            return;
        }

        const formDataToSend = new FormData();
        // formDataToSend.append('land_category_id', selectedCategory.id);
        // formDataToSend.append('land_name', locationInput);
        // formDataToSend.append('land_bank_id', landData.id);

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
                    `remove_${fileType}`,
                    removedFiles[fileType].join(',')
                );
            }
        });

        try {
            // await updateDataAfterApproval(formDataToSend).unwrap();
            await updateDataAfterApproval({ id:landBankApproveData?.data[0]?.id, formData: formDataToSend }).unwrap();
            toast.success('Land documents updated successfully');
            // navigate('/land-bank');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update land documents');
        }
    };

    const renderFileSection = (title, fieldName) => (
        <div className="mb-6">
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
            
            {/* Display existing files */}
            {formData[fieldName]?.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Uploaded Files:</h4>
                    {formData[fieldName].map((file, index) => {
                        const isRemoved = removedFiles[fieldName].includes(file.id);
                        return (
                            <div key={file.id} className="flex items-center gap-4 py-2">
                                <div className='flex flex-row gap-2'>
                                    <p>{index + 1}.</p>
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
                                >
                                    View File
                                </Button>
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

            {/* Display newly added files */}
            {newFiles[fieldName]?.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-semibold mb-2">New Files:</h4>
                    {newFiles[fieldName].map((file, index) => (
                        <div key={index} className="flex items-center gap-4 py-2">
                            <p>{file.name}</p>
                            <Button
                                onClick={() => {
                                    setNewFiles(prev => ({
                                        ...prev,
                                        [fieldName]: prev[fieldName].filter((_, i) => i !== index)
                                    }));
                                }}
                                color="error"
                                size="small"
                                sx={{ backgroundColor: "#f8d7da" }}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading data</div>;

    return (
        <div className="p-6 max-w-4xl max-h-[95%] overflow-y-auto mx-auto bg-white rounded-md shadow-md my-10">
            <h2 className="text-2xl font-semibold text-[#29346B] mb-5">Edit Land</h2>

            <div className="mb-6">
                <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                    Land Category <span className="text-red-600">*</span>
                </label>
                <Autocomplete
                    value={selectedCategory}
                    onChange={(event, newValue) => setSelectedCategory(newValue)}
                    options={categories?.data || []}
                    getOptionLabel={(option) => option?.category_name || ''}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Select Land Category"
                            className="w-full"
                        />
                    )}
                />
            </div>

            <div className="mb-6">
                <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                    Land Name <span className="text-red-600">*</span>
                </label>
                <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    className="border p-3 rounded-md w-full"
                    placeholder="Enter Land Name"
                />
            </div>

            {/* Document Upload Sections */}
            <div className="space-y-6">
                {renderFileSection("DILR Document", "dilr_attachment_file")}
                {renderFileSection("NA 65B Permission", "na_65b_permission_attachment_file")}
                {renderFileSection("Revenue 7/12 Records", "revenue_7_12_records_attachment")}
                {renderFileSection("NOC from Forest Department", "noc_from_forest_and_amp_attachment_file")}
                {renderFileSection("NOC from Geology and Mining Office", "noc_from_geology_and_mining_office_attachment_file")}
                {renderFileSection("List of Approvals Required for Transmission", "approvals_required_for_transmission_attachment_file")}
                {renderFileSection("Canal Crossing Permission", "canal_crossing_attachment_file")}
                {renderFileSection("Lease Deed", "lease_deed_attachment_file")}
                {renderFileSection("Railway Crossing Permission", "railway_crossing_attachment_file")}
                {renderFileSection("Gas Pipeline Crossing Permission", "any_gas_pipeline_crossing_attachment_file")}
                {renderFileSection("Road Crossing Permission", "road_crossing_permission_attachment_file")}
                {renderFileSection("Transmission Line Crossing Permission", "any_transmission_line_crossing_permission_attachment_file")}
                {renderFileSection("Transmission Line Shifting Permission", "any_transmission_line_shifting_permission_attachment_file")}
                {renderFileSection("Gram Panchayat Permission", "gram_panchayat_permission_attachment_file")}
                {renderFileSection("Municipal Corporation Permission", "municipal_corporation_permission_file")}
                {renderFileSection("Municipal Corporation Permission", "municipalCorporationPermission")}
                {renderFileSection("Other Approvals", "otherApprovals")}
                {renderFileSection("Title Search Report", "tsr")}
                {renderFileSection("Coordinate Verification", "coordinateVerification")}
                {renderFileSection("Encumbrance NOC", "encumbranceNoc")}
                {renderFileSection("Developer Permission", "developerPermission")}
                {renderFileSection("NOC from Ministry of Defence", "nocMinistryOfDefence")}
            </div>
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
    );
}

export default EditLandApproveDoc;