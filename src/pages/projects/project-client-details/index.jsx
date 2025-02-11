import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateClientDataMutation } from "../../../api/client/clientApi";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

function CreateClientDetails() {
    const { projectId } = useParams();
    const [createClientData] = useCreateClientDataMutation(); 
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        client_name: "",
        contact_number: "",
        email: "",
        gst: "",
        pan_number: "",
        captive_rec_nonrec_rpo: "",
        declaration_of_getco: "",
        undertaking_geda: "",
        authorization_to_epc: "",
        last_3_year_turn_over_details: "",
        factory_end: "",
        cin: "",
        moa_partnership: "",
        board_authority_signing: "",
        files: {
            msme_certificate: [],
            adhar_card: [],
            pan_card: [],
            third_authority_adhar_card_attachments: [],
            third_authortity_pan_card_attachments: []
        }
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, fileType) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            files: { ...formData.files, [fileType]: files }
        });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const data = new FormData();
    //     data.append("project_id", projectId);
        
    //     // Append regular form fields
    //     Object.keys(formData).forEach((key) => {
    //         if (key !== "files") {
    //             data.append(key, formData[key]);
    //         }
    //     });
        
    //     // Append multiple files
    //     Object.keys(formData.files).forEach((key) => {
    //         formData.files[key].forEach((file, index) => {
    //             data.append(`${key}[${index}]`, file);
    //         });
    //     });

    //     try {
    //         const result = await createClientData(data).unwrap(); // unwrap the result to handle success or error
            

    //     } catch (error) {
    //         console.error("Error:", error);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        
        // Append project_id
        data.append("project_id", projectId);
        
        // Append regular form fields
        Object.keys(formData).forEach((key) => {
            if (key !== "files") {
                data.append(key, formData[key]);
            }
        });
        
        // Append files with the correct field names
        Object.keys(formData.files).forEach((key) => {
            formData.files[key].forEach((file) => {
                // Remove the array index notation from the field name
                data.append(key, file);
            });
        });
    
        try {
            const result = await createClientData(data).unwrap();

            console.log("Success:", result);
            // Handle success (e.g., show notification, redirect, etc.)
            navigate('/project');
            toast.success("Client Data added Successfully")
        } catch (error) {
            console.error("Error:", error);
            // Handle error (e.g., show error message)
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-md shadow-md my-10">
            <h2 className="text-2xl font-semibold text-[#29346B] mb-5">Add Client Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-6">
                    {Object.keys(formData).map((key) => (
                        key !== "files" ? (
                            <div key={key}>
                                <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
                                    {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                                </label>
                                <input 
                                    type="text" 
                                    name={key} 
                                    placeholder={key.replace(/_/g, " ")?.toLocaleUpperCase()} 
                                    value={formData[key]} 
                                    onChange={handleChange} 
                                    className="border p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none" 
                                    required 
                                />
                            </div>
                        ) : null
                    ))}

                    {Object.keys(formData.files).map((key) => (
                        <div key={key} className="mb-4">
                            <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                                {key.replace(/_/g, " ").toUpperCase()} (Upload Multiple)
                            </label>
                            <input 
                                type="file" 
                                multiple
                                onChange={(e) => handleFileChange(e, key)}
                                className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline-none file:bg-yellow-300 file:p-2 file:border-none file:rounded-md" 
                            />
                            {formData.files[key].length > 0 && (
                                <div className="mt-2 text-sm text-gray-600">
                                    {formData.files[key].length} file(s) selected
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex flex-row justify-center items-center">
                    {/* <button type="submit" className="bg-[#FF8C00]  text-white py-2 px-6 rounded-md">Submit</button> */}
                    <Button
                    type="submit"
                    variant="contained"
                    style={{ backgroundColor: '#FF8C00', color: 'white', fontWeight: 'bold', fontSize: '16px', textTransform: 'none' }}
                    onClick={() => setOpen(true)}
                >
                    Add Category
                </Button>
                </div>
            </form>
        </div>
    );
}

export default CreateClientDetails;