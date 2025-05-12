import React from 'react';
import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';
import { useCreateElectricityLineMutation } from '../../../../api/General/Electricity-line/ElectricityLineApi';

function ElectricityLineModal({ open, setOpen, inputValue, setInputValue, refetch }) {
    const [createElectricityLine, { isLoading }] = useCreateElectricityLineMutation();

    const handleSubmit = async () => {
        if (!inputValue.trim()) return;

        try {
            await createElectricityLine( inputValue ).unwrap();
            setInputValue('');
            setOpen(false);
            refetch();
        } catch (error) {
            console.error("Failed to create electricity line:", error);
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
                <h2 className="text-[#29346B] text-2xl font-semibold mb-5">Add New Electricity Line</h2>
                <label className="block mb-1 text-[#29346B] text-lg font-semibold">
                    Electricity Line Name
                </label>
                <input
                    type="text"
                    className="border m-1 p-3 rounded-md w-full border-yellow-300 border-b-4 border-b-yellow-400 outline-none"
                    value={inputValue}
                    placeholder="Enter Electricity Line Name"
                    onChange={(e) => setInputValue(e.target.value)}
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
                    {isLoading ? 'Creating...' : 'Create Electricity Line'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ElectricityLineModal;