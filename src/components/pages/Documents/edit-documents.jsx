import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Autocomplete,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
// import { X as CloseIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useGetMainProjectsQuery } from "../../../api/users/projectApi";
import { useFetchUsersQuery } from "../../../api/users/usersApi";
import { useGetDocumentsQuery, useUpdateDocumentMutation } from "../../../api/users/documentApi";

export default function EditDocumentModal({ open, onClose, document }) {
  const [documentName, setDocumentName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [revisionNumber, setRevisionNumber] = useState("");
  const [projectName, setProjectName] = useState("");
  const [confidentialLevel, setConfidentialLevel] = useState("");
  const [status, setStatus] = useState("");
  const [keywords, setKeywords] = useState("");
  const [comments, setComments] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [removeSelectedFiles, setRemoveSelectedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  const { data: projects, error, isLoading } = useGetMainProjectsQuery();
  const { data: userData } = useFetchUsersQuery();
  const { refetch } = useGetDocumentsQuery();
  const [updateDocument, { isLoading: isSubmitting }] = useUpdateDocumentMutation();

  const CONFIDENTIAL_CHOICES = ["Public", "International", "Confidential"];
  const STATUS_CHOICES = ["Draft", "Archived", "Approved"];

  useEffect(() => {
    if (document) {
      setDocumentName(document.document_name);
      setDocumentNumber(document.document_number);
      setRevisionNumber(document.revision_number);
      setProjectName(document.project);
      setConfidentialLevel(document.confidentiallevel);
      setStatus(document.status);
      setKeywords(document.keywords || "");
      setComments(document.comments || "");
      setAssignedUsers(document.assign_users || []);
      setExistingFiles(document.document_management_attachments || []);
      setNewFiles([]);
      setRemoveSelectedFiles([]);
    }
  }, [document]);

  const handleClose = () => {
    onClose();
  };

  const handleFileRemove = (fileId) => {
    setRemoveSelectedFiles([...removeSelectedFiles, fileId]);
    setExistingFiles(existingFiles.filter(file => file.id !== fileId));
  };

  const handleNewFileSelect = (e) => {
    setNewFiles(Array.from(e.target.files));
  };

  const handleRemoveNewFile = (index) => {
    setNewFiles(newFiles.filter((_, i) => i !== index));
  };

  // const handleSubmit = async () => {
  //   if (
  //     !documentName ||
  //     !documentNumber ||
  //     !revisionNumber ||
  //     !projectName ||
  //     !confidentialLevel ||
  //     !status
  //   ) {
  //     toast.error("Please fill all the required fields!");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("document_name", documentName);
  //   formData.append("document_number", documentNumber);
  //   formData.append("revision_number", revisionNumber);
  //   formData.append("project_id", projectName);
  //   formData.append("confidential_level", confidentialLevel);
  //   formData.append("status", status);
  //   formData.append("keywords", keywords);
  //   formData.append("comments", comments);

  //   if (removeSelectedFiles.length > 0) {
  //     formData.append("remove_selected_files", removeSelectedFiles.join(','));
  //   }

  //   assignedUsers.forEach((userId) =>
  //     formData.append("assigned_users", userId)
  //   );

  //   newFiles.forEach((file) =>
  //     formData.append("document_attachments", file)
  //   );

  //   try {
  //     const response = await updateDocument({ documentId: document.id, formData }).unwrap();
  //     toast.success("Document updated successfully!");
  //     refetch();
  //     handleClose();
  //   } catch (error) {
  //     toast.error("Error updating document: " + error.message);
  //   }
  // };

  const handleSubmit = async () => {
    if (
      !documentName ||
      !documentNumber ||
      !revisionNumber ||
      !projectName ||
      !confidentialLevel ||
      !status
    ) {
      toast.error("Please fill all the required fields!");
      return;
    }
  
    const formData = new FormData();
    formData.append("document_name", documentName);
    formData.append("document_number", documentNumber);
    formData.append("revision_number", revisionNumber);
    formData.append("project_id", projectName);
    formData.append("confidential_level", confidentialLevel);
    formData.append("status", status);
    formData.append("keywords", keywords);
    formData.append("comments", comments);
  
    // Handle assigned users
    if (assignedUsers.length > 0) {
      formData.append("assigned_users", assignedUsers.join(','));
    }
  
    // Handle files to be removed
    if (removeSelectedFiles.length > 0) {
      formData.append("remove_selected_files", removeSelectedFiles.join(','));
    }
  
    // Handle new files
    if (newFiles.length > 0) {
      // Use the singular form as shown in the curl example
      newFiles.forEach((file) => {
        formData.append("document_attachments", file);
      });
    }
  
    // Log the FormData to see what's being sent
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  
    try {
      const response = await updateDocument({
        documentId: document.id,
        formData,
      }).unwrap();
      toast.success("Document updated successfully!");
      refetch();
      handleClose();
    } catch (error) {
      console.error('Update error:', error);
      toast.error("Error updating document: " + (error.data?.message || error.message));
    }
  };

  const commonInputStyles = {
    "& .MuiOutlinedInput-root": {
      border: "1px solid #FACC15",
      borderBottom: "4px solid #FACC15",
      borderRadius: "6px",
    },
    "& .MuiOutlinedInput-root.Mui-focused": {
      border: "none",
      borderRadius: "4px",
    },
  };

  const FileList = () => (
    <div className="mt-4">
      <h3 className="text-[#29346B] text-lg font-semibold mb-2">Current Files:</h3>
      <List>
        {existingFiles.map((file) => (
          <ListItem
            key={file.id}
            className="border border-yellow-200 rounded-md mb-2"
            secondaryAction={
              <IconButton 
                edge="end" 
                onClick={() => handleFileRemove(file.id)}
                className="text-red-500 hover:text-red-700"
              >
                {/* <CloseIcon size={20} /> */}
              X
              </IconButton>
            }
          >
            <ListItemText
              primary={file.url.split('/').pop()}
              secondary={new Date(file.created_at).toLocaleDateString()}
            />
          </ListItem>
        ))}
        {newFiles.map((file, index) => (
          <ListItem
            key={index}
            className="border border-yellow-200 rounded-md mb-2"
            secondaryAction={
              <IconButton 
                edge="end" 
                onClick={() => handleRemoveNewFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                {/* <CloseIcon size={20} /> */}
              X
              </IconButton>
            }
          >
            <ListItemText
              primary={file.name}
              secondary="New file"
            />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-[#29346B] text-2xl font-semibold mb-5">
        Edit Document
      </DialogTitle>
      <DialogContent>
        {/* Document Name */}
        <label className="block mb-1 text-[#29346B] text-lg font-semibold">
          Document Name <span className="text-red-600"> *</span>
        </label>
        <input
          type="text"
          className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
          value={documentName}
          placeholder="Enter Document Name"
          onChange={(e) => setDocumentName(e.target.value)}
        />

        {/* Document Number */}
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Document Number <span className="text-red-600"> *</span>
        </label>
        <input
          type="text"
          className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
          value={documentNumber}
          placeholder="Enter Document Number"
          onChange={(e) => setDocumentNumber(e.target.value)}
        />

        {/* Revision Number */}
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Revision Number <span className="text-red-600"> *</span>
        </label>
        <input
          type="text"
          className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
          value={revisionNumber}
          placeholder="Enter Revision Number"
          onChange={(e) => setRevisionNumber(e.target.value)}
        />

        {/* Project Name */}
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
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
            value={
              projects?.data?.find((project) => project.id === projectName) ||
              null
            }
            onChange={(event, newValue) => setProjectName(newValue?.id || "")}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Select Project"
                fullWidth
                sx={commonInputStyles}
              />
            )}
          />
        )}

        {/* Confidential Level */}
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Select Confidential Level <span className="text-red-600"> *</span>
        </label>
        <FormControl fullWidth variant="outlined" sx={{ marginBottom: "15px" }}>
          <InputLabel>Confidential Level</InputLabel>
          <Select
            value={confidentialLevel}
            onChange={(e) => setConfidentialLevel(e.target.value)}
            label="Confidential Level"
            sx={commonInputStyles}
          >
            {CONFIDENTIAL_CHOICES.map((level, index) => (
              <MenuItem key={index} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status */}
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Select Status <span className="text-red-600"> *</span>
        </label>
        <FormControl fullWidth variant="outlined" sx={{ marginBottom: "15px" }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Status"
            sx={commonInputStyles}
          >
            {STATUS_CHOICES.map((statusChoice, index) => (
              <MenuItem key={index} value={statusChoice}>
                {statusChoice}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Keywords */}
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Enter Keyword <span className="text-red-600"> *</span>
        </label>
        <input
          type="text"
          className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
          value={keywords}
          placeholder="Enter Keywords"
          onChange={(e) => setKeywords(e.target.value)}
        />

        {/* Comments */}
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Add Comment <span className="text-red-600"> *</span>
        </label>
        <textarea
          className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
          value={comments}
          placeholder="Enter Comments"
          onChange={(e) => setComments(e.target.value)}
        />

        {/* Document Attachments */}
        <div className="px-6">
          <FileList />
          
          <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
            Add New Documents
          </label>
          <input
            type="file"
            className="w-full cursor-pointer border rounded-md border-yellow-200 border-b-2 border-b-yellow-400 outline:none file:bg-yellow-300 file:border-none file:p-2 file:rounded-md file:text-[#29346B] file:font-semibold file:text-xl"
            onChange={handleNewFileSelect}
            multiple
          />
        </div>

        {/* Assigned Users */}
        <label className="block mt-4 mb-1 text-[#29346B] text-lg font-semibold">
          Assign To User <span className="text-red-600"> *</span>
        </label>
        <Autocomplete
          multiple
          options={userData || []}
          getOptionLabel={(option) => option.full_name}
          value={
            userData
              ? userData.filter((user) => assignedUsers.includes(user.id))
              : []
          }
          onChange={(event, value) => {
            setAssignedUsers(value.map((user) => user.id));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Assigned Users"
              sx={commonInputStyles}
            />
          )}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", padding: "20px" }}>
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
            "&:hover": { backgroundColor: "#E66A1F" },
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}