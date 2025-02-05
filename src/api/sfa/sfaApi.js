import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sfaApi = createApi({
  reducerPath: "sfaApi",
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
    getSfaData: builder.query({
        query: () => "land_module/add_sfa_data_to_land_bank",
      }),
    addSfaDataToLandBank: builder.mutation({
        query: (formData) => ({
          url: "land_module/add_sfa_data_to_land_bank",
          method: "POST",
          body: formData,
        }),
      }),
    updateSfaDataToLandBank: builder.mutation({
        query: ({ land_sfa_data_id, formData }) => ({
          url: `land_module/update_sfa_data_to_land_bank/${land_sfa_data_id}`, // PUT request with dynamic ID
          method: "PUT",
          body: formData,
        }),
      }),
      updateLandBankStatus: builder.mutation({
        query: ({ land_bank_id, formData }) => ({
          url: `land_module/approve_land_bank_by_hod/${land_bank_id}`, // Dynamic URL with land_bank_id
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("token")}`, // Bearer token in headers
          },
          body: formData, // FormData with land_bank_status and file
        }),
      }),
  }),
});

export const {
    useGetSfaDataQuery,
    useAddSfaDataToLandBankMutation,
    useUpdateLandBankStatusMutation,
    useUpdateSfaDataToLandBankMutation
} = sfaApi;
