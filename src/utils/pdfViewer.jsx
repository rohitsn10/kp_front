import { useEffect, useState, useRef } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";

const PdfViewerDialog = ({ open, handleClose, pdfUrl, fileName }) => {
    const [pdfBlob, setPdfBlob] = useState(null);
    const pdfContainerRef = useRef(null);

    // Fetch the PDF as a blob when the modal opens
    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const response = await fetch(pdfUrl);
                if (!response.ok) throw new Error(`Error fetching PDF: ${response.status}`);
                const blob = await response.blob();
                setPdfBlob(blob);
            } catch (error) {
                console.error("Error fetching PDF:", error);
            }
        };

        if (open) {
            fetchPdf();
        }
    }, [open, pdfUrl]);

    // Render the PDF inside the modal when the blob is available
    useEffect(() => {
        if (pdfBlob && pdfContainerRef.current) {
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                const embed = document.createElement("embed");
                embed.src = fileReader.result;
                embed.type = "application/pdf";
                embed.width = "100%";
                embed.height = "100%";
                pdfContainerRef.current.innerHTML = "";
                pdfContainerRef.current.appendChild(embed);
            };
            fileReader.readAsDataURL(pdfBlob);
        }
    }, [pdfBlob]);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth PaperProps={{ sx: { height: "90vh" } }}>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#29346B", color: "white" }}>
                <Typography variant="h6" component="div" sx={{ display: "flex", alignItems: "center" }}>
                    <PictureAsPdfIcon sx={{ mr: 1 }} />
                    {fileName}
                </Typography>
                <IconButton aria-label="close" onClick={handleClose} sx={{ color: "white" }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0, height: "100%" }}>
                <div ref={pdfContainerRef} style={{ height: "100%", width: "100%" }}>
                    <Typography>Loading PDF...</Typography>
                </div>
            </DialogContent>
            <DialogActions>
                <Button startIcon={<DownloadIcon />} onClick={() => window.open(pdfUrl, "_blank")} variant="contained" sx={{ bgcolor: "#29346B", "&:hover": { bgcolor: "#1e2756" } }}>
                    Download
                </Button>
                <Button onClick={handleClose} variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PdfViewerDialog;
