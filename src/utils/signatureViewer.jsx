import { Dialog, DialogContent } from "@mui/material";
import { useState } from "react";

const ImageViewer = ({ src, alt, width = 100, height = 30 }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img 
        src={src} 
        alt={alt} 
        onClick={() => setOpen(true)}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`, 
          cursor: 'pointer' 
        }} 
      />
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <img 
            src={src} 
            alt={alt} 
            style={{ 
              width: '100%', 
              maxHeight: '500px', 
              objectFit: 'contain' 
            }} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageViewer