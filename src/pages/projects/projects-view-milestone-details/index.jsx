

import React from "react";
import { useParams } from "react-router-dom";
import { useGetMilestoneByIdQuery } from "../../../api/milestone/milestoneApi";

function ProjectViewMilestone() {
    const { milestoneId } = useParams();
    const { data: milestoneFetchData, error, isLoading } = useGetMilestoneByIdQuery(milestoneId);
    
    if (isLoading) return <p className="text-center">Loading...</p>;
    if (error || !milestoneFetchData?.status || !milestoneFetchData?.data?.length) {
        return (
            <div className="p-6 max-w-4xl mx-auto bg-white rounded-md shadow-md my-10">
                <p className="text-center text-red-500">Error fetching milestone data or data not found.</p>
            </div>
        );
    }

    const milestoneData = milestoneFetchData?.data[0]?.data?.[0];

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-md shadow-md my-10">
            <h2 className="text-2xl text-center font-semibold text-[#29346B] mb-5">
                View Milestone Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Milestone Name" value={milestoneData?.milestone_name} />
                <DetailItem label="Description" value={milestoneData?.milestone_description} />
                <DetailItem label="Start Date" value={milestoneData?.start_date} />
                <DetailItem label="End Date" value={milestoneData?.end_date} />
                <DetailItem label="Status" value={milestoneData?.milestone_status} />
                <DetailItem label="Project ID" value={milestoneData?.project} />
                <DetailItem label="Is Active" value={milestoneData?.is_active ? "Yes" : "No"} />
                <DetailItem label="Is Depended" value={milestoneData?.is_depended ? "Yes" : "No"} />
            </div>

            <h3 className="text-xl font-semibold text-[#29346B] mt-6 mb-3">Project Main Activity</h3>
            <DetailItem label="Activity Name" value={milestoneData?.project_main_activity_name?.activity_name} />
            
            {milestoneData?.project_main_activity_name?.sub_activity?.map((sub, index) => (
                <div key={index} className="mt-3">
                    <h4 className="text-lg font-semibold">Sub Activity</h4>
                    {sub.sub_activity.map((subItem) => (
                        <DetailItem key={subItem.id} label="Sub Activity Name" value={subItem.name} />
                    ))}

                    {sub.sub_sub_activity_name?.map((subSub, idx) => (
                        <div key={idx} className="mt-3">
                            <h4 className="text-lg font-semibold">Sub-Sub Activity</h4>
                            {subSub.sub_sub_activity_name?.map((subSubItem) => (
                                <DetailItem key={subSubItem.id} label="Sub-Sub Activity Name" value={subSubItem.name} />
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

// Reusable Component for Normal Fields
const DetailItem = ({ label, value }) => (
    <div className="border p-3 rounded-md bg-gray-100">
        <strong>{label}:</strong> {value || "N/A"}
    </div>
);

export default ProjectViewMilestone;

