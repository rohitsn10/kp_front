import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'

function ApproveMasterDesignModal({open,onClose,selectedDesign}) {
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
        Add Material
    </DialogTitle>
    <DialogContent>
        Edit Material
    </DialogContent>
    </Dialog>
  )
}

export default ApproveMasterDesignModal