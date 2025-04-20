import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const incidentNearMissApi = createApi({
  reducerPath: "incidentNearMissApi",
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
    createIncidentNearMissInvestigation: builder.mutation({
      query: (formData) => ({
        url: "annexures_module/create_incident_nearmiss_investigation",
        method: "POST",
        body: formData,
        // Set this to prevent RTK from trying to JSON stringify the FormData
        formData: true,
      }),
    }),
    getIncidentNearMissInvestigation: builder.query({
      query: (locationId) => ({
        url: `annexures_module/get_incident_nearmiss_investigation/${locationId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateIncidentNearMissInvestigationMutation,
  useGetIncidentNearMissInvestigationQuery,
} = incidentNearMissApi;
