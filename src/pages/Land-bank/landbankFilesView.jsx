import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetLandBankApproveDataQuery } from "../../api/users/landbankApi";
import { AuthContext } from "../../context/AuthContext";
// import { useGetLandBankDataQuery } from "../../../api/landbank/landBankApi"; // Adjust this import to match your API
// useGetLandBankDataQuery
function ViewLandBankDetails() {

    const { landBankId } = useParams();
    const { data: landBankFetchData, error, isLoading } = useGetLandBankApproveDataQuery(landBankId);
    const landBankData = landBankFetchData?.data[0];
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

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error fetching data</p>;

    if (!landBankData) {
        return (
            <div className="p-6 max-w-4xl mx-auto bg-white rounded-md shadow-md my-10">
                <p className="text-center text-gray-500 text-lg">
                    Land bank details not found, please add.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-md shadow-md my-10">
            <h2 className="text-2xl text-center font-semibold text-[#29346B] mb-5">
                View Land Bank Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Land Bank Name" value={landBankData?.land_bank_name} />
                <DetailItem label="Land Bank ID" value={landBankData?.land_bank} />
                <DetailItem label="User" value={landBankData?.user_full_name} />
                <DetailItem label="Is 22 Forms Filled" value={landBankData?.is_filled_22_forms ? "Yes" : "No"} />
            </div>

            <h3 className="text-xl font-semibold text-[#29346B] mt-6 mb-3">Documents & Approvals</h3>
            <div className="grid grid-cols-2 gap-4">
                <FileItem label="DILR Attachment" files={landBankData?.dilr_attachment_file} />
                <FileItem label="NA 65B Permission" files={landBankData?.na_65b_permission_attachment_file} />
                <FileItem label="Revenue 7/12 Records" files={landBankData?.revenue_7_12_records_attachment} />
                <FileItem label="NOC from Forest" files={landBankData?.noc_from_forest_and_amp_attachment_file} />
                <FileItem label="NOC from Geology & Mining Office" files={landBankData?.noc_from_geology_and_mining_office_attachment_file} />
                <FileItem label="Transmission Approvals" files={landBankData?.approvals_required_for_transmission_attachment_file} />
                <FileItem label="Canal Crossing" files={landBankData?.canal_crossing_attachment_file} />
                <FileItem label="Lease Deed" files={landBankData?.lease_deed_attachment_file} />
                <FileItem label="Railway Crossing" files={landBankData?.railway_crossing_attachment_file} />
                <FileItem label="Gas Pipeline Crossing" files={landBankData?.any_gas_pipeline_crossing_attachment_file} />
                <FileItem label="Road Crossing Permission" files={landBankData?.road_crossing_permission_attachment_file} />
                <FileItem label="Transmission Line Crossing" files={landBankData?.any_transmission_line_crossing_permission_attachment_file} />
                <FileItem label="Transmission Line Shifting" files={landBankData?.any_transmission_line_shifting_permission_attachment_file} />
                <FileItem label="Gram Panchayat Permission" files={landBankData?.gram_panchayat_permission_attachment_file} />
                <FileItem label="Municipal Corporation Permission" files={landBankData?.municipal_corporation_permission_file} />
                <FileItem label="Other Approvals" files={landBankData?.list_of_other_approvals_land_file} />
                <FileItem label="Title Search Report" files={landBankData?.title_search_report_file} />
                <FileItem label="Coordinate Verification" files={landBankData?.coordinate_verification_file} />
                <FileItem label="Encumbrance NOC" files={landBankData?.encumbrance_noc_file} />
                <FileItem label="Developer Permission" files={landBankData?.developer_permission_file} />
                <FileItem label="NOC from Ministry of Defence" files={landBankData?.noc_from_ministry_of_defence_file} />
                <FileItem label="Transmission Line Approvals" files={landBankData?.list_of_approvals_required_for_transmission_line_file} />
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
                        View File {index + 1}
                    </a>
                </div>
            ))
        ) : (
            <span> No file available</span>
        )}
    </div>
);

export default ViewLandBankDetails;