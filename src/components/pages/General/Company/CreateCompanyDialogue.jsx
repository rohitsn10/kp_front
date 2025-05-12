import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useCreateCompanyMutation } from '../../../../api/General/company/companyApi';

function CompanyModal({ open, setOpen, companyInput, setCompanyInput, refetch }) {
    const [createCompany, { isLoading }] = useCreateCompanyMutation();

    const handleSubmit = async () => {
        if (!companyInput.trim()) return;

        try {
            await createCompany( companyInput ).unwrap();
            setCompanyInput('');
            setOpen(false);
            refetch();
        } catch (error) {
            console.error("Failed to create company:", error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth
            maxWidth="md"
            PaperProps={{
                style: {
                    width: '600px',
                },
            }}
        >
            <DialogContent>
                <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Add New Company</h2>
                <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                    Company Name
                </label>
                <input
                    type="text"
                    className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                    value={companyInput}
                    placeholder="Enter Company Name"
                    onChange={(e) => setCompanyInput(e.target.value)}
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', padding: '20px' }}>
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    sx={{
                        backgroundColor: '#F6812D',
                        color: '#FFFFFF',
                        fontSize: '16px',
                        padding: '6px 36px',
                        width: '250px',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: '#E66A1F',
                        },
                    }}
                >
                    {isLoading ? 'Creating...' : 'Create Company'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CompanyModal;