import { Autocomplete, TextField } from '@mui/material'
import React, { useState } from 'react'
import HSECards from '../../components/pages/hse/hse-cards'

function HseMainPage() {
    const totalSites = [
        { label: 'Site 1' },
        { label: 'Site 2' },
        { label: 'Site 3' },
    ]
    const [selectedSite, setSelectedSite] = useState(null)

    const handleSiteChange = (event, newValue) => {
        setSelectedSite(newValue)
    }
    return (
        <div className='bg-white rounded-md p-8 m-4 min-h-screen flex flex-col gap-4'>
            <div className='text-center'>
                <h1 className='text-2xl'>HSE Dashboard</h1>
            </div>
            <div className='flex flex-row'>
                <div className='flex flex-col gap-2'>
                    <label className='text-xl'>Select Site</label>
                    <Autocomplete
                        disablePortal
                        options={totalSites}
                        sx={{ width: 400 }}
                        renderInput={(params) => <TextField {...params} label="Sites" />}
                        onChange={handleSiteChange}
                    />
                </div>
            </div>
            <div className=''>
                {/* <div className='col-span-4'> */}
                    {selectedSite && <HSECards selectedSite={selectedSite} />}
                {/* </div> */}
            </div>
        </div>
    )
}

export default HseMainPage