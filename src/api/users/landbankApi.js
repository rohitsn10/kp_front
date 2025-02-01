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
    updateLandBankMaster: builder.mutation({
      query: ({ id, formData }) => ({
        url: `land_module/update_land_bank_master/${id}`,
        method: "PUT",
        body: formData, // Send the formData with other parameters
      }),
    }),
    updateDataAfterApprovalLandBank: builder.mutation({
      query: (formData) => ({
        url: "land_module/update_data_after_approval_land_bank",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useCreateLandBankMasterMutation,
  useGetLandBankMasterQuery,
  useApproveLandBankByHodMutation,
  useUpdateLandBankMasterMutation,
  useUpdateDataAfterApprovalLandBankMutation,
} = landBankApi;
