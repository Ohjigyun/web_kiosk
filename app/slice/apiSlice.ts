import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}`
  }),
  tagTypes: ['User'],
  // The "endpoints" represent operations and requests for this server
  endpoints: builder => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getUserInfo: builder.query({
      query: (args) => {
        return `/user/get-user-info?user_id=${args.uid}`
      }
    }),
    getMenu: builder.query({
      query: (args) => {
        return `/menu/get-menu?user_id=${args.uid}`
      }
    }),
    getPresignedUrl: builder.query({
      query: (args) => {
        const { user_id, category, menu_name, image_type } = args
        return `/menu/get-presigned-url?user_id=${user_id}&category=${category}&menu_name=${menu_name}&image_type=${image_type}`
      }
    }),
    getAssetsPresignedUrl: builder.query({
      query: (args) => {
        const { file_name, file_type } = args
        return `/assets/get-presigned-url?file_name=${file_name}&file_type=${file_type}`
      }
    }),
    getUuidToDisplayTable: builder.query({
      query: (args) => {
        const { user_id } = args
        return `/menu/uuid-to-display?user_id=${user_id}`
      }
    }),
    getIsOrderAdditional: builder.query({
      query: (args) => {
        return `/order/is-order-additional?user_id=${args.uid}&table_number=${args.tableNumber}`
      }
    }),
    getOrders: builder.query({
      query: (args) => {
        return `/order/get-orders?user_id=${args.uid}`
      }
    }),
    signupUser: builder.mutation({
      query: (body) => ({
        url: `/user/signup-user`,
        method: 'POST',
        body
      }),
    }),
    addMenu: builder.mutation({
      query: (body) => ({
        url: `/menu/add-menu`,
        method: 'POST',
        body
      }),
    }),
    deleteMenu: builder.mutation({
      query: (body) => ({
        url: `/menu/delete-menu`,
        method: 'POST',
        body
      }),
    }),
    addCategory: builder.mutation({
      query: (body) => ({
        url: `/menu/add-category`,
        method: 'POST',
        body
      }),
    }),
    deleteCategory: builder.mutation({
      query: (body) => ({
        url: `/menu/delete-category`,
        method: 'POST',
        body
      }),
    }),
    deleteCompletedOrder: builder.mutation({
      query: (body) => ({
        url: `/order/delete-completed-order`,
        method: 'POST',
        body
      }),
    }),
    sendOrder: builder.mutation({
      query: (body) => ({
        url: `/order/send-order`,
        method: 'POST',
        body
      }),
    }),
    sendAdditionalOrder: builder.mutation({
      query: (body) => ({
        url: `/order/send-additional-order`,
        method: 'POST',
        body
      }),
    }),
  })
})

export const { useGetUserInfoQuery, useLazyGetMenuQuery, useLazyGetPresignedUrlQuery, useLazyGetAssetsPresignedUrlQuery, useLazyGetUuidToDisplayTableQuery, useLazyGetIsOrderAdditionalQuery, useLazyGetOrdersQuery, useSignupUserMutation, useAddMenuMutation, useDeleteMenuMutation, useAddCategoryMutation, useDeleteCategoryMutation, useDeleteCompletedOrderMutation , useSendOrderMutation, useSendAdditionalOrderMutation } = apiSlice
