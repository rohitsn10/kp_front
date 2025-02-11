import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetClientDataQuery } from "../../../api/client/clientApi";

function ViewClientDetails() {
    const { projectId } = useParams();
    // const [clientData, setClientData] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    const { data: clientFetchData, error, isLoading } = useGetClientDataQuery(projectId);
    const clientData = clientFetchData?.data[0];
    console.log("Client details:",)

    if (!clientData) {
        return (
            <div className="p-6 max-w-4xl mx-auto bg-white rounded-md shadow-md my-10">

            <p className="text-center text-gray-500 text-lg">
                Client details not found, please add.
            </p>
            </div>
        );
    }

    // console.log(clientData)
    // console.log("Total Details",clientFetchData)

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error fetching data</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-md shadow-md my-10">
            <h2 className="text-2xl text-center font-semibold text-[#29346B] mb-5">
                View Client Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Client Name" value={clientData?.client_name} />
                <DetailItem label="Contact Number" value={clientData?.contact_number} />
                <DetailItem label="Email" value={clientData?.email} />
                <DetailItem label="GST" value={clientData?.gst} />
                <DetailItem label="PAN Number" value={clientData?.pan_number} />
                <DetailItem label="CIN" value={clientData?.cin} />
                <DetailItem label="Captive REC/Non-REC RPO" value={clientData?.captive_rec_nonrec_rpo} />
                <DetailItem label="Declaration of GETCO" value={clientData?.declaration_of_getco} />
                <DetailItem label="Undertaking GEDA" value={clientData?.undertaking_geda} />
                <DetailItem label="Authorization to EPC" value={clientData?.authorization_to_epc} />
                <DetailItem label="Last 3 Year Turnover Details" value={clientData?.last_3_year_turn_over_details} />
                <DetailItem label="Factory End" value={clientData?.factory_end} />
                <DetailItem label="MOA Partnership" value={clientData?.moa_partnership} />
                <DetailItem label="Board Authority Signing" value={clientData?.board_authority_signing} />
            </div>

            <h3 className="text-xl font-semibold text-[#29346B] mt-6 mb-3">Attachments</h3>
            <div className="grid grid-cols-2 gap-4">
                <FileItem label="MSME Certificate" files={clientData?.msme_certificate_attachments} />
                <FileItem label="Aadhar Card" files={clientData?.adhar_card_attachments} />
                <FileItem label="PAN Card" files={clientData?.pan_card_attachments} />
                <FileItem label="Third Authority Aadhar Attachments" files={clientData?.third_authority_adhar_card_attachments} />
                <FileItem label="Third Authority PAN Attachments" files={clientData?.third_authority_pan_card_attachments
} />
            </div>
        </div>
    );
}

// Reusable Component for Normal Fields
const DetailItem = ({ label, value }) => (
    <div className="border p-3 rounded-md bg-gray-100">
        <strong>{label}:</strong> {value || "N/A"}
    </div>
);

// Reusable Component for File Attachments
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

export default ViewClientDetails;
