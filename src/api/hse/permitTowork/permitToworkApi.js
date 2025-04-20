import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const permitToWorkApi = createApi({
  reducerPath: "permitToWorkApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      // headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createPermitToWork: builder.mutation({
      query: (body) => ({
        url: "annexures_module/create_permit_to_work",
        method: "POST",
        body,
      }),
    }),
    getPermitToWork: builder.query({
      query: (locationId) => ({
        url: `annexures_module/loaction_id_wise_permit_to_work/${locationId}`,
        method: "GET", 
      }),
    }),
    approverApprovePermit: builder.mutation({
      query: ({ permitId, formData }) => ({
        url: `annexures_module/approver_approve_permit/${permitId}`,
        method: "PUT",
        body: formData,
        formData: true, // Important for FormData handling
      }),
    }),
    
    receiverApprovePermit: builder.mutation({
      query: ({ permitId, formData }) => ({
        url: `annexures_module/receiver_approve_permit/${permitId}`,
        method: "PUT",
        body: formData,
        formData: true, // Important for FormData handling
      }),
    }),
    
    closureOfPermit: builder.mutation({
      query: ({ permitId, formData }) => ({
        url: `annexures_module/closure_of_permit/${permitId}`,
        method: "PUT",
        body: formData,
        formData: true, // Important for FormData handling
      }),
    }),
  }),
});

export const {
  useCreatePermitToWorkMutation,
  useGetPermitToWorkQuery,
  useApproverApprovePermitMutation,
  useReceiverApprovePermitMutation,
  useClosureOfPermitMutation,
} = permitToWorkApi;
