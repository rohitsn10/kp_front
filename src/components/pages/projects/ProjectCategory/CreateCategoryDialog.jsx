import React from 'react';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import Button from '@mui/material/Button';

function ProjectWpo({ open, handleClose }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: {
          width: '600px',
        },
      }}
    >
      <DialogContent>
        <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Project WPO</h2>
        {/* Inputs will be added later */}
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: '#F6812D',
            color: '#FFFFFF',
            fontSize: '16px',
            padding: '6px 36px',
            width: '200px',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#E66A1F',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProjectWpo;
