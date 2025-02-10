import React from "react";
import { useParams } from "react-router-dom";
// import { useGetProjectDataQuery } from "../../../api/project/projectApi";
import { useGetProjectDataByIdQuery } from "../../../api/users/projectApi";

function ViewProjectDetails() {
    const { projectId } = useParams();
    const { data: projectFetchData, error, isLoading } = useGetProjectDataByIdQuery(projectId);
    const projectData = projectFetchData?.data;
    // useGetProjectDataByIdQuery
    if (isLoading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error fetching data</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-md shadow-md my-10">
            <h2 className="text-2xl text-center font-semibold text-[#29346B] mb-5">
                View Project Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Project Name" value={projectData.project_name} />
                <DetailItem label="Company Name" value={projectData.company_name} />
                <DetailItem label="Start Date" value={projectData.start_date} />
                <DetailItem label="End Date" value={projectData.end_date} />
                <DetailItem label="COD Commission Date" value={projectData.cod_commission_date} />
                <DetailItem label="Capacity" value={projectData.capacity} />
                <DetailItem label="Electricity Line" value={projectData.electricity_line} />
                <DetailItem label="Project Activity" value={projectData.project_activity_name} />
                <DetailItem label="Landbank Name" value={projectData.landbank_name} />
                <DetailItem label="Available Land Area" value={projectData.available_land_area} />
                <DetailItem label="Allotted Land Area" value={projectData.alloted_land_area} />
            </div>

            {/* Project Sub Activities */}
            <h3 className="text-xl font-semibold text-[#29346B] mt-6 mb-3">Project Sub Activities</h3>
            <div className="grid grid-cols-2 gap-4">
                {projectData.project_sub_activity.map((subActivity, index) => (
                    <DetailItem key={index} label="Sub Activity" value={subActivity.sub_activity_name} />
                ))}
            </div>

            {/* Project Sub Sub Activities */}
            <h3 className="text-xl font-semibold text-[#29346B] mt-6 mb-3">Project Multi Activities</h3>
            <div className="grid grid-cols-2 gap-4">
                {projectData.project_sub_sub_activity.map((subSubActivity, index) => (
                    <DetailItem key={index} label="Multi Activities" value={subSubActivity.sub_sub_activity_name} />
                ))}
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

export default ViewProjectDetails;
