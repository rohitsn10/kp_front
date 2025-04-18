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
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createIncidentNearMissInvestigation: builder.mutation({
      query: (body) => ({
        url: "annexures_module/create_incident_nearmiss_investigation",
        method: "POST",
        body,
      }),
    }),
    getIncidentNearMissInvestigation: builder.query({
      query: () => ({
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
