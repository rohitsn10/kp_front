import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetClientDataQuery, useUpdateClientDataMutation, useDeleteClientDataMutation } from "../../../api/client/clientApi";

function ViewClientDetails() {
    const { projectId } = useParams();
    const { data: clientFetchData, error, isLoading } = useGetClientDataQuery(projectId);
    const [updateClient, { isLoading: isUpdating }] = useUpdateClientDataMutation();
    const [deleteClient, { isLoading: isDeleting }] = useDeleteClientDataMutation();
    const [editingClient, setEditingClient] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [viewMode, setViewMode] = useState('tabs'); // 'tabs', 'accordion', 'grid'
    const clientsData = clientFetchData?.data || [];

    // Set active tab to first client when data loads
    useEffect(() => {
        if (clientsData.length > 0 && activeTab >= clientsData.length) {
            setActiveTab(0);
        }
    }, [clientsData, activeTab]);

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error fetching data</p>;

    if (!clientsData.length) {
        return (
            <div className="p-6 max-w-4xl mx-auto bg-white rounded-md shadow-md my-10">
                <p className="text-center text-gray-500 text-lg">
                    Client details not found, please add.
                </p>
            </div>
        );
    }

    const handleEdit = (clientData) => {
        setEditingClient(clientData);
    };

    const handleCancelEdit = () => {
        setEditingClient(null);
    };

    const handleSaveEdit = async (formData) => {
        try {
            const result = await updateClient({ 
                clientId: editingClient.id, 
                formData 
            }).unwrap();
            
            alert('Client updated successfully!');
            setEditingClient(null);
        } catch (error) {
            console.error('Update failed:', error);
            alert('Failed to update client. Please try again.');
        }
    };

    const handleDelete = async (clientId, clientName) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete client "${clientName}"? This action cannot be undone.`
        );
        
        if (confirmDelete) {
            try {
                const result = await deleteClient(clientId).unwrap();
                alert('Client deleted successfully!');
                // If deleted client was active, switch to first tab
                if (clientsData[activeTab]?.id === clientId && activeTab > 0) {
                    setActiveTab(0);
                }
            } catch (error) {
                console.error('Delete failed:', error);
                alert('Failed to delete client. Please try again.');
            }
        }
    };

    const renderTabsView = () => (
        <div className="w-full">
            {/* Tab Navigation */}
            <div className="flex flex-wrap border-b border-gray-200 mb-6 bg-gray-50 p-2 rounded-t-lg">
                {clientsData.map((client, index) => (
                    <button
                        key={client.id}
                        onClick={() => setActiveTab(index)}
                        className={`px-4 py-2 mx-1 mb-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            activeTab === index
                                ? 'bg-[#29346B] text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                    >
                        {client.client_name || `Client ${index + 1}`}
                    </button>
                ))}
            </div>

            {/* Active Tab Content */}
            {clientsData[activeTab] && (
                <div className="min-h-[500px]">
                    {editingClient && editingClient.id === clientsData[activeTab].id ? (
                        <EditClientCard 
                            clientData={clientsData[activeTab]}
                            index={activeTab}
                            onSave={handleSaveEdit}
                            onCancel={handleCancelEdit}
                            isUpdating={isUpdating}
                        />
                    ) : (
                        <ClientCard 
                            clientData={clientsData[activeTab]} 
                            index={activeTab}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            isDeleting={isDeleting}
                        />
                    )}
                </div>
            )}
        </div>
    );

    const renderAccordionView = () => (
        <div className="space-y-4">
            {clientsData.map((clientData, index) => (
                <AccordionItem
                    key={clientData.id}
                    clientData={clientData}
                    index={index}
                    isOpen={activeTab === index}
                    onToggle={() => setActiveTab(activeTab === index ? -1 : index)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                    editingClient={editingClient}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                    isUpdating={isUpdating}
                />
            ))}
        </div>
    );

    const renderGridView = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {clientsData.map((clientData, index) => (
                <div key={clientData.id} className="h-fit">
                    {editingClient && editingClient.id === clientData.id ? (
                        <EditClientCard 
                            clientData={clientData}
                            index={index}
                            onSave={handleSaveEdit}
                            onCancel={handleCancelEdit}
                            isUpdating={isUpdating}
                            compact={true}
                        />
                    ) : (
                        <ClientCard 
                            clientData={clientData} 
                            index={index}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            isDeleting={isDeleting}
                            compact={true}
                        />
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white rounded-md shadow-md my-10">
            {/* Header with View Mode Toggle */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-[#29346B]">
                    Client Details ({clientsData.length} Client{clientsData.length > 1 ? 's' : ''})
                </h2>
                
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('tabs')}
                        className={`px-3 py-1 text-sm rounded ${
                            viewMode === 'tabs' 
                                ? 'bg-[#29346B] text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        📑 Tabs
                    </button>
                    <button
                        onClick={() => setViewMode('accordion')}
                        className={`px-3 py-1 text-sm rounded ${
                            viewMode === 'accordion' 
                                ? 'bg-[#29346B] text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        📋 Accordion
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-1 text-sm rounded ${
                            viewMode === 'grid' 
                                ? 'bg-[#29346B] text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        ⊞ Grid
                    </button>
                </div>
            </div>

            {/* Render based on selected view mode */}
            {viewMode === 'tabs' && renderTabsView()}
            {viewMode === 'accordion' && renderAccordionView()}
            {viewMode === 'grid' && renderGridView()}
        </div>
    );
}

// Accordion Item Component
const AccordionItem = ({ 
    clientData, 
    index, 
    isOpen, 
    onToggle, 
    onEdit, 
    onDelete, 
    isDeleting,
    editingClient,
    onSave,
    onCancel,
    isUpdating 
}) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Accordion Header */}
        <div 
            className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex justify-between items-center"
            onClick={onToggle}
        >
            <div className="flex items-center gap-3">
                <span className="text-[#29346B] font-semibold">
                    Client #{index + 1}: {clientData?.client_name}
                </span>
                <span className="text-sm text-gray-500">
                    {clientData?.email}
                </span>
            </div>
            <div className="flex items-center gap-2">
                {!isOpen && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(clientData);
                                onToggle();
                            }}
                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                        >
                            ✏️ Edit
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(clientData.id, clientData.client_name);
                            }}
                            disabled={isDeleting}
                            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:bg-red-300"
                        >
                            🗑️ Delete
                        </button>
                    </>
                )}
                <span className="text-gray-400">
                    {isOpen ? '▲' : '▼'}
                </span>
            </div>
        </div>

        {/* Accordion Content */}
        {isOpen && (
            <div className="p-6 bg-white">
                {editingClient && editingClient.id === clientData.id ? (
                    <EditClientCard 
                        clientData={clientData}
                        index={index}
                        onSave={onSave}
                        onCancel={onCancel}
                        isUpdating={isUpdating}
                        hideHeader={true}
                    />
                ) : (
                    <ClientCard 
                        clientData={clientData} 
                        index={index}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        isDeleting={isDeleting}
                        hideHeader={true}
                    />
                )}
            </div>
        )}
    </div>
);

// View Client Card Component
const ClientCard = ({ clientData, index, onEdit, onDelete, isDeleting, compact = false, hideHeader = false }) => (
    <div className={`border-2 border-gray-200 rounded-lg p-6 bg-gray-50 relative ${compact ? 'text-sm' : ''}`}>
        {/* Action Buttons */}
        {!hideHeader && (
            <div className="absolute top-4 right-4 flex gap-2">
                <button
                    onClick={() => onEdit(clientData)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors duration-200"
                    title="Edit Client"
                >
                    ✏️ Edit
                </button>
                <button
                    onClick={() => onDelete(clientData.id, clientData.client_name)}
                    disabled={isDeleting}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors duration-200"
                    title="Delete Client"
                >
                    {isDeleting ? '🔄' : '🗑️'} Delete
                </button>
            </div>
        )}

        {!hideHeader && (
            <h3 className="text-xl font-semibold text-[#29346B] mb-4 border-b pb-2 pr-32">
                Client #{index + 1}: {clientData?.client_name}
            </h3>
        )}

        <div className={`grid grid-cols-1 ${compact ? 'gap-2 mb-4' : 'md:grid-cols-2 gap-4 mb-6'}`}>
            <DetailItem label="Client Name" value={clientData?.client_name} compact={compact} />
            <DetailItem label="Contact Number" value={clientData?.contact_number} compact={compact} />
            <DetailItem label="Email" value={clientData?.email} compact={compact} />
            <DetailItem label="GST" value={clientData?.gst} compact={compact} />
            <DetailItem label="PAN Number" value={clientData?.pan_number} compact={compact} />
            <DetailItem label="CIN" value={clientData?.cin} compact={compact} />
            <DetailItem label="Captive REC/Non-REC RPO" value={clientData?.captive_rec_nonrec_rpo} compact={compact} />
            <DetailItem label="Declaration of GETCO" value={clientData?.declaration_of_getco} compact={compact} />
            <DetailItem label="Undertaking GEDA" value={clientData?.undertaking_geda} compact={compact} />
            <DetailItem label="Authorization to EPC" value={clientData?.authorization_to_epc} compact={compact} />
            <DetailItem label="Last 3 Year Turnover Details" value={clientData?.last_3_year_turn_over_details} compact={compact} />
            <DetailItem label="Factory End" value={clientData?.factory_end} compact={compact} />
            <DetailItem label="MOA Partnership" value={clientData?.moa_partnership} compact={compact} />
            <DetailItem label="Board Authority Signing" value={clientData?.board_authority_signing} compact={compact} />
        </div>

        <h4 className={`font-semibold text-[#29346B] mt-6 mb-3 ${compact ? 'text-base' : 'text-lg'}`}>Attachments</h4>
        <div className={`grid grid-cols-1 ${compact ? 'gap-2' : 'md:grid-cols-2 gap-4'}`}>
            <FileItem label="MSME Certificate" files={clientData?.msme_certificate_attachments} compact={compact} />
            <FileItem label="Aadhar Card" files={clientData?.adhar_card_attachments} compact={compact} />
            <FileItem label="PAN Card" files={clientData?.pan_card_attachments} compact={compact} />
            <FileItem label="Third Authority Aadhar Attachments" files={clientData?.third_authority_adhar_card_attachments} compact={compact} />
            <FileItem label="Third Authority PAN Attachments" files={clientData?.third_authority_pan_card_attachments} compact={compact} />
        </div>
    </div>
);

// Edit Client Card Component
const EditClientCard = ({ clientData, index, onSave, onCancel, isUpdating, compact = false, hideHeader = false }) => {
    const [formData, setFormData] = useState({
        client_name: clientData?.client_name || '',
        contact_number: clientData?.contact_number || '',
        email: clientData?.email || '',
        gst: clientData?.gst || '',
        pan_number: clientData?.pan_number || '',
        cin: clientData?.cin || '',
        captive_rec_nonrec_rpo: clientData?.captive_rec_nonrec_rpo || '',
        declaration_of_getco: clientData?.declaration_of_getco || '',
        undertaking_geda: clientData?.undertaking_geda || '',
        authorization_to_epc: clientData?.authorization_to_epc || '',
        last_3_year_turn_over_details: clientData?.last_3_year_turn_over_details || '',
        factory_end: clientData?.factory_end || '',
        moa_partnership: clientData?.moa_partnership || '',
        board_authority_signing: clientData?.board_authority_signing || '',
    });

    const [attachmentFiles, setAttachmentFiles] = useState({
        msme_certificate: [],
        adhar_card: [],
        pan_card: [],
        third_authority_adhar_card_attachments: [],
        third_authortity_pan_card_attachments: [],
    });

    const [removeAttachments, setRemoveAttachments] = useState({
        remove_msme_certificate: [],
        remove_adhar_card: [],
        remove_pan_card: [],
        remove_third_authority_adhar_card_attachments: [],
        remove_third_authortity_pan_card_attachments: [],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e, fieldName) => {
        const files = Array.from(e.target.files);
        setAttachmentFiles(prev => ({
            ...prev,
            [fieldName]: files
        }));
    };

    const handleRemoveAttachment = (attachmentId, fieldName) => {
        const removeField = `remove_${fieldName}`;
        setRemoveAttachments(prev => ({
            ...prev,
            [removeField]: [...prev[removeField], attachmentId]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const submitFormData = new FormData();
        
        // Add text fields
        Object.keys(formData).forEach(key => {
            if (formData[key]) {
                submitFormData.append(key, formData[key]);
            }
        });

        // Add new file attachments
        Object.keys(attachmentFiles).forEach(key => {
            attachmentFiles[key].forEach(file => {
                submitFormData.append(key, file);
            });
        });

        // Add remove attachment IDs
        Object.keys(removeAttachments).forEach(key => {
            if (removeAttachments[key].length > 0) {
                submitFormData.append(key, removeAttachments[key].join(','));
            }
        });

        onSave(submitFormData);
    };

    return (
        <div className={`border-2 border-blue-300 rounded-lg p-6 bg-blue-50 relative ${compact ? 'text-sm' : ''}`}>
            <div className="absolute top-4 right-4 flex gap-2">
                <button
                    onClick={handleSubmit}
                    disabled={isUpdating}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isUpdating ? '🔄 Saving...' : '💾 Save'}
                </button>
                <button
                    onClick={onCancel}
                    disabled={isUpdating}
                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    ❌ Cancel
                </button>
            </div>

            {!hideHeader && (
                <h3 className="text-xl font-semibold text-[#29346B] mb-4 border-b pb-2 pr-32">
                    Edit Client #{index + 1}
                </h3>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className={`grid grid-cols-1 ${compact ? 'gap-3' : 'md:grid-cols-2 gap-4'}`}>
                    <EditFormField
                        label="Client Name"
                        name="client_name"
                        value={formData.client_name}
                        onChange={handleInputChange}
                        required
                        compact={compact}
                    />
                    <EditFormField
                        label="Contact Number"
                        name="contact_number"
                        value={formData.contact_number}
                        onChange={handleInputChange}
                        compact={compact}
                    />
                    <EditFormField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        compact={compact}
                    />
                    <EditFormField
                        label="GST"
                        name="gst"
                        value={formData.gst}
                        onChange={handleInputChange}
                        compact={compact}
                    />
                    <EditFormField
                        label="PAN Number"
                        name="pan_number"
                        value={formData.pan_number}
                        onChange={handleInputChange}
                        compact={compact}
                    />
                    <EditFormField
                        label="CIN"
                        name="cin"
                        value={formData.cin}
                        onChange={handleInputChange}
                        compact={compact}
                    />
                </div>

                {/* Additional Fields */}
                <div className={`grid grid-cols-1 ${compact ? 'gap-3' : 'md:grid-cols-2 gap-4'}`}>
                    <EditFormField
                        label="Captive REC/Non-REC RPO"
                        name="captive_rec_nonrec_rpo"
                        value={formData.captive_rec_nonrec_rpo}
                        onChange={handleInputChange}
                        compact={compact}
                    />
                    <EditFormField
                        label="Declaration of GETCO"
                        name="declaration_of_getco"
                        value={formData.declaration_of_getco}
                        onChange={handleInputChange}
                        compact={compact}
                    />
                    <EditFormField
                        label="Undertaking GEDA"
                        name="undertaking_geda"
                        value={formData.undertaking_geda}
                        onChange={handleInputChange}
                        compact={compact}
                    />
                    <EditFormField
                        label="Authorization to EPC"
                        name="authorization_to_epc"
                        value={formData.authorization_to_epc}
                        onChange={handleInputChange}
                        compact={compact}
                    />
                    <EditFormField
                        label="Last 3 Year Turnover Details"
                        name="last_3_year_turn_over_details"
                        value={formData.last_3_year_turn_over_details}
                        onChange={handleInputChange}
                        compact={compact}
                    />
                    <EditFormField
                        label="Factory End"
                        name="factory_end"
                        value={formData.factory_end}
                        onChange={handleInputChange}
                        compact={compact}
                    />
                    <EditFormField
                        label="MOA Partnership"
                        name="moa_partnership"
                        value={formData.moa_partnership}
                        onChange={handleInputChange}
                        compact={compact}
                    />
                    <EditFormField
                        label="Board Authority Signing"
                        name="board_authority_signing"
                        value={formData.board_authority_signing}
                        onChange={handleInputChange}
                        compact={compact}
                    />
                </div>

                {/* File Attachments */}
                <div className="space-y-4">
                    <h4 className={`font-semibold text-[#29346B] ${compact ? 'text-base' : 'text-lg'}`}>Update Attachments</h4>
                    
                    <EditFileSection
                        label="MSME Certificate"
                        fieldName="msme_certificate"
                        existingFiles={clientData?.msme_certificate_attachments}
                        onFileChange={handleFileChange}
                        onRemoveAttachment={handleRemoveAttachment}
                        removeList={removeAttachments.remove_msme_certificate}
                        compact={compact}
                    />
                    
                    <EditFileSection
                        label="Aadhar Card"
                        fieldName="adhar_card"
                        existingFiles={clientData?.adhar_card_attachments}
                        onFileChange={handleFileChange}
                        onRemoveAttachment={handleRemoveAttachment}
                        removeList={removeAttachments.remove_adhar_card}
                        compact={compact}
                    />
                    
                    <EditFileSection
                        label="PAN Card"
                        fieldName="pan_card"
                        existingFiles={clientData?.pan_card_attachments}
                        onFileChange={handleFileChange}
                        onRemoveAttachment={handleRemoveAttachment}
                        removeList={removeAttachments.remove_pan_card}
                        compact={compact}
                    />
                    
                    <EditFileSection
                        label="Third Authority Aadhar Attachments"
                        fieldName="third_authority_adhar_card_attachments"
                        existingFiles={clientData?.third_authority_adhar_card_attachments}
                        onFileChange={handleFileChange}
                        onRemoveAttachment={handleRemoveAttachment}
                        removeList={removeAttachments.remove_third_authority_adhar_card_attachments}
                        compact={compact}
                    />
                    
                    <EditFileSection
                        label="Third Authority PAN Attachments"
                        fieldName="third_authortity_pan_card_attachments"
                        existingFiles={clientData?.third_authority_pan_card_attachments}
                        onFileChange={handleFileChange}
                        onRemoveAttachment={handleRemoveAttachment}
                        removeList={removeAttachments.remove_third_authortity_pan_card_attachments}
                        compact={compact}
                    />
                </div>
            </form>
        </div>
    );
};

// Edit Form Field Component
const EditFormField = ({ label, name, value, onChange, type = "text", required = false, compact = false }) => (
    <div className="space-y-1">
        <label className={`block font-medium text-gray-700 ${compact ? 'text-xs' : 'text-sm'}`}>
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
                compact ? 'p-1.5 text-sm' : 'p-2'
            }`}
        />
    </div>
);

// Edit File Section Component
const EditFileSection = ({ label, fieldName, existingFiles, onFileChange, onRemoveAttachment, removeList, compact = false }) => (
    <div className="border p-4 rounded-md bg-white">
        <label className={`block font-medium text-gray-700 mb-2 ${compact ? 'text-xs' : 'text-sm'}`}>{label}</label>
        
        {/* Existing Files */}
        {existingFiles && existingFiles.length > 0 && (
            <div className="mb-3">
                <p className={`text-gray-600 mb-2 ${compact ? 'text-xs' : 'text-sm'}`}>Current Files:</p>
                {existingFiles.map((file, index) => (
                    <div key={file.id} className="flex items-center justify-between bg-gray-50 p-2 rounded mb-1">
                        <a 
                            href={file?.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`text-blue-600 hover:text-blue-800 underline ${compact ? 'text-xs' : 'text-sm'}`}
                        >
                            View File {existingFiles.length > 1 ? `(${index + 1})` : ''}
                        </a>
                        {!removeList.includes(file.id) ? (
                            <button
                                type="button"
                                onClick={() => onRemoveAttachment(file.id, fieldName)}
                                className={`text-red-500 hover:text-red-700 ${compact ? 'text-xs' : 'text-sm'}`}
                            >
                                Remove
                            </button>
                        ) : (
                            <span className={`text-red-500 ${compact ? 'text-xs' : 'text-sm'}`}>Will be removed</span>
                        )}
                    </div>
                ))}
            </div>
        )}
        
        {/* File Input for New Files */}
        <input
            type="file"
            multiple
            onChange={(e) => onFileChange(e, fieldName)}
            className={`w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                compact ? 'p-1.5 text-sm' : 'p-2'
            }`}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        <p className="text-xs text-gray-500 mt-1">Select new files to add (PDF, DOC, DOCX, JPG, PNG)</p>
    </div>
);

// Reusable Component for Normal Fields (View Mode)
const DetailItem = ({ label, value, compact = false }) => (
    <div className={`border rounded-md bg-white shadow-sm ${compact ? 'p-2' : 'p-3'}`}>
        <strong className={`text-gray-700 ${compact ? 'text-xs' : ''}`}>{label}:</strong> 
        <span className={`ml-2 text-gray-900 ${compact ? 'text-xs' : ''}`}>{value || "N/A"}</span>
    </div>
);

// Reusable Component for File Attachments (View Mode)
const FileItem = ({ label, files, compact = false }) => (
    <div className={`border rounded-md bg-white shadow-sm ${compact ? 'p-2' : 'p-3'}`}>
        <strong className={`text-gray-700 ${compact ? 'text-xs' : ''}`}>{label}:</strong>
        {files && files.length > 0 ? (
            <div className="mt-2">
                {files.map((file, index) => (
                    <div key={file.id || index} className="mb-1">
                        <a 
                            href={file?.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`text-blue-600 hover:text-blue-800 underline ${compact ? 'text-xs' : 'text-sm'}`}
                        >
                            View File {files.length > 1 ? `(${index + 1})` : ''}
                        </a>
                    </div>
                ))}
            </div>
        ) : (
            <span className={`ml-2 text-gray-500 italic ${compact ? 'text-xs' : ''}`}>No file available</span>
        )}
    </div>
);

export default ViewClientDetails;