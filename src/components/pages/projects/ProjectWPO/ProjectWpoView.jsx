import { Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";
import { useGetProjectWpoQuery } from "../../../../api/wpo/wpoApi";
// import { useGetProjectWpoQuery } from "../../../api/client/clientDataApi";

function ProjectWpoViewModal({ open, projectId, handleClose }) {
  const { data, error, isLoading } = useGetProjectWpoQuery(projectId);
  // console.log("WOPO Project ID",projectId);
  // console.log(data)
  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching WO/PO data</p>;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: {
          width: "700px",
          paddingBottom: "15px",
        },
      }}
    >
      <h2 className="text-2xl my-6 text-center font-semibold text-[#29346B] mb-5">
        View WO/PO
      </h2>
      <DialogContent>
        {data?.data?.map((wpo) => (
          <div key={wpo.id} className="border p-4 mb-4 rounded-md shadow-md bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">Project: {wpo.project_name}</h3>

            {/* Attachments */}
            <AttachmentSection title="LOI Attachments" attachments={wpo.loi_attachments} />
            <AttachmentSection title="LOA/PO Attachments" attachments={wpo.loa_po_attachments} />
            <AttachmentSection title="EPC Contract" attachments={wpo.epc_contract} />
            <AttachmentSection title="OMM Contract" attachments={wpo.omm_contact} />
          </div>
        ))}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <button
          onClick={handleClose}
          className="bg-[#F6812D] text-white font-bold px-6 py-2 rounded-md hover:bg-[#E66A1F] transition"
        >
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
}

const AttachmentSection = ({ title, attachments }) => (
  <div className="mt-4">
    <h4 className="text-md font-medium text-gray-700">{title}:</h4>
    {attachments?.length > 0 ? (
      <ul className="list-disc ml-6">
        {attachments.map((file) => (
          <li key={file.id}>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View File
            </a>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-gray-500">No attachments available</p>
    )}
  </div>
);

export default ProjectWpoViewModal;
