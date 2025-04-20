import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const incidentNearmissApi = createApi({
  reducerPath: "incidentNearmissApi",
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
    createIncidentNearmissReport: builder.mutation({
      query: (body) => ({
        url: "annexures_module/create_report_of_incident_nearmiss",
        method: "POST",
        body,
      }),
    }),
    getIncidentNearmissReport: builder.query({
      query: (locationId) => ({
        url: `annexures_module/get_report_of_incident_nearmiss/${locationId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateIncidentNearmissReportMutation,
  useGetIncidentNearmissReportQuery,
} = incidentNearmissApi;
