import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const milestonePaymentApi = createApi({
  reducerPath: "milestonePaymentApi",
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
    createMilestonePayment: builder.mutation({
      query: (paymentData) => ({
        url: "project_module/create_inflow_payment_on_milestone",
        method: "POST",
        body: paymentData,
      }),
    }),
    updateMilestonePayment: builder.mutation({
      query: ({ id, ...paymentData }) => ({
        url: `project_module/update_inflow_payment_on_milestone/${id}`,
        method: "PUT",
        body: paymentData,
      }),
    }),
    getMilestonePayment: builder.query({
      query: (milestoneId) => ({
        url: `project_module/milestone_id_wise_get_inflow_payment_on_milestone/${milestoneId}`,
        method: "GET",
      }),
    }),
    addPaymentOnMilestone: builder.mutation({
  query: (paymentData) => ({
    url: "project_module/add_payment_on_milestone",
    method: "POST",
    body: paymentData,
  }),
}),
  }),
});

export const { 
  useCreateMilestonePaymentMutation, 
  useUpdateMilestonePaymentMutation, 
  useGetMilestonePaymentQuery,
  useAddPaymentOnMilestoneMutation  
} = milestonePaymentApi;
