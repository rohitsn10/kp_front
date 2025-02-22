import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'

function CreateMasterDesignModal({open,onClose}) {
    return (
        <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            width: "700px",
          },
        }}
      >
        <DialogTitle className="text-[#29346B] text-2xl font-semibold mb-5">
          Create Design
        </DialogTitle>
        <DialogContent>
            Create Master Design
        </DialogContent>
        </Dialog>
      )
}

export default CreateMasterDesignModal