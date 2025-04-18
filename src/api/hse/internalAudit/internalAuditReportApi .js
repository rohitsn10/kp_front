import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const internalAuditReportApi = createApi({
  reducerPath: "internalAuditReportApi",
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
    createInternalAuditReport: builder.mutation({
      query: (formData) => ({
        url: "annexures_module/create_internal_audit_report",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),
    
    createCorrectionInternalAuditReport: builder.mutation({
      query: (formData) => ({
        url: "annexures_module/create_correction_internal_audit_report",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),
    
    // Endpoint for creating verification internal audit report
    createVerificationInternalAuditReport: builder.mutation({
      query: (formData) => ({
        url: "annexures_module/create_verification_internal_audit_report",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),
    
    // Endpoint for creating closure internal audit report
    createClosureInternalAuditReport: builder.mutation({
      query: (formData) => ({
        url: "annexures_module/create_closure_internal_audit_report",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),
    
getInternalAuditReports: builder.query({
  query: (locationId) => {
    // Only proceed if locationId is provided and valid
    if (!locationId || isNaN(locationId)) {
      throw new Error('Valid location ID is required');
    }
    
    return {
      url: `annexures_module/get_internal_audit_report/${locationId}`,
      method: "GET",
    };
  },
  // Add error handling
  transformErrorResponse: (response) => {
    console.error('Error in audit reports query:', response);
    return response;
  },
}),
  }),
});

export const {
  useCreateInternalAuditReportMutation,
  useCreateCorrectionInternalAuditReportMutation,
  useCreateVerificationInternalAuditReportMutation,
  useCreateClosureInternalAuditReportMutation,
  useGetInternalAuditReportsQuery,
} = internalAuditReportApi;