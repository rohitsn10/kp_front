import React, { useEffect, useState, useRef } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";
import ReactPlayer from "react-player"; // For video rendering
import PropTypes from "prop-types";

// Function to extract file type based on URL
const getFileTypeFromUrl = (url) => {
  const extension = url.split('.').pop().toLowerCase();
  if (extension === 'pdf') {
    return 'pdf';
  } else if (['mp4', 'mkv', 'avi', 'mov'].includes(extension)) {
    return 'video';
  } else if (['mp3', 'wav', 'aac'].includes(extension)) {
    return 'audio';
  }
  return 'unknown'; // Default to unknown if not recognized
};

const ViewFileModal = ({ open, handleClose, material }) => {
  const [pdfBlob, setPdfBlob] = useState(null);
  const pdfContainerRef = useRef(null); // Reference to where the PDF will be rendered

  // Extract file type from the material URL
  const fileType = material ? getFileTypeFromUrl(material.url) : null;

  // Function to fetch PDF and convert it to a Blob
  const fetchPdf = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching PDF: ${response.status}`);
      }
      const blob = await response.blob();
      setPdfBlob(blob); // Set the blob for preview
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  // This effect runs whenever the 'material' changes
  useEffect(() => {
    if (material && fileType === "pdf" && open) {
     
      fetchPdf(material.url); // Fetch and render the PDF
    }
  }, [material, open, fileType]);

  // Render PDF preview by converting Blob to Data URL
  const renderPDFPreview = () => {
    if (pdfBlob && pdfContainerRef.current) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const pdfDataUrl = fileReader.result;
       
        const embed = document.createElement("embed");
        embed.src = pdfDataUrl;
        embed.type = "application/pdf"; // Ensure it's a PDF
        embed.width = "100%";
        embed.height = "500px"; // Adjust height as necessary
        pdfContainerRef.current.innerHTML = ""; // Clear previous content
        pdfContainerRef.current.appendChild(embed); // Append new embed element
      };
      fileReader.readAsDataURL(pdfBlob); // Convert blob to Data URL
    }
  };

  useEffect(() => {
    if (pdfBlob) {
    
      renderPDFPreview(); // Render the PDF preview once the blob is set
    }
  }, [pdfBlob]);

  // Render content based on the file type
  const renderContent = () => {
    if (!material) {
      return <Typography>Error: No material data available.</Typography>;
    }

    switch (fileType) {
      case "pdf":
        return (
          <div ref={pdfContainerRef}>
            <Typography>Loading PDF...</Typography>
          </div>
        );
      case "video":
        return (
          <ReactPlayer
            url={material.url}
            controls
            width="100%"
            height="500px"
          />
        );
      case "audio":
        return (
          <audio controls width="100%">
            <source src={material.url} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        );
      default:
        return <Typography>Unsupported file type</Typography>;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>View File</DialogTitle>
      <DialogContent>{renderContent()}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ViewFileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  material: PropTypes.shape({
    url: PropTypes.string.isRequired, // URL of the file
  }).isRequired,
};

export default ViewFileModal;
