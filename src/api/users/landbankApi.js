import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const landBankApi = createApi({
  reducerPath: "landBankApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createLandBankMaster: builder.mutation({
      query: (formData) => ({
        url: "land_module/create_land_bank_master",
        method: "POST",
        body: formData,
      }),
    }),
    getLandBankMaster: builder.query({
      query: () => ({
        url: "land_module/create_land_bank_master",
        method: "GET",
      }),
    }),
    approveLandBankByHod: builder.mutation({
      query: (data) => ({
        url: `land_module/approve_land_bank_by_hod/${data.id}`,
        method: "PUT",
        body: data.formData, // Send the formData with other parameters
      }),
    }),
    approveLandBankByProjectHod: builder.mutation({
      query: ({ land_bank_id, is_land_bank_approved_by_project_hod }) => ({
        url: `land_module/approve_land_bank_by_project_hod/${land_bank_id}`,
        method: "PUT",
        body: { is_land_bank_approved_by_project_hod },
      }),
    }),
    updateLandBankMaster: builder.mutation({
      query: ({ id, formData }) => ({
        url: `land_module/update_land_bank_master/${id}`,
        method: "PUT",
        body: formData, // Send the formData with other parameters
      }),
    }),
    addSfaDataToLandBank: builder.mutation({
      query: ({ id, formData }) => ({
        url: `land_module/add_sfa_data_to_land_bank/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
    deleteLandBankLocation: builder.mutation({
      query: (id) => ({
        url: `land_module/update_land_bank_master/${id}`,
        method: "DELETE",
      }),
    }),
    approveRejectLandBankStatus: builder.mutation({
      query: ({ id, land_bank_status }) => ({
        url: `land_module/approve_reject_land_bank_status/${id}`,
        method: "PUT",
        body: { land_bank_status },
      }),
    }),
    addDataAfterApprovalLandBank: builder.mutation({
      query: (formData) => ({
        url: "land_module/add_data_after_approval_land_bank",
        method: "POST",
        body: formData,
      }),
    }),  
    updateDataAfterApprovalLandBank: builder.mutation({
      query: ({ id, formData }) => ({
        url: `land_module/update_data_after_approval_land_bank/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
    getLandBankApproveData: builder.query({
      query: (id) => ({
        url: `land_module/get_land_bank_id_wise_22_forms_data/${id}`,
        method: "GET",
      }),
    }),
    updateLandBankMasterEntry: builder.mutation({
      query: ({ id, formData }) => ({
        url: `land_module/create_land_bank_master/${id}`,
        method: "PUT",
        body: formData,
      }),
}),
    getApprovedLandBankMaster: builder.query({
      query: () => ({
        url: "project_module/land_bank_data_approved_by_project_hod",
        method: "GET",
      }),
    }),

  }),
}); 

export const {
  useCreateLandBankMasterMutation,
  useGetLandBankMasterQuery,
  useApproveLandBankByHodMutation,
  useApproveLandBankByProjectHodMutation,
  useUpdateLandBankMasterMutation,
  useAddSfaDataToLandBankMutation,
  useDeleteLandBankLocationMutation,
  useApproveRejectLandBankStatusMutation,
  useAddDataAfterApprovalLandBankMutation,
  // useUpdateLandBankApproveDataMutation,
  useUpdateDataAfterApprovalLandBankMutation,
  useGetLandBankApproveDataQuery,
  useUpdateLandBankMasterEntryMutation,
  useGetApprovedLandBankMasterQuery
} = landBankApi;
