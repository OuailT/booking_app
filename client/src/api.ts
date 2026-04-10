import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface CreateEmployeePayload {
  name: string;
  password: string;
  position: 'WAITER' | 'RUNNER' | 'HEAD_WAITER';
}

export interface Employee extends CreateEmployeePayload {
  id: string;
  role: string;
  availabilities?: Availability[];
}

export interface Availability {
  id: string;
  userId: string;
  date: string;
  shift: 'MORNING' | 'AFTERNOON' | 'NIGHT';
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'PREFERRED_TO_WORK';
  user?: {
    id: string;
    name: string;
  };
}

export interface UpdateAvailabilityPayload {
  employeeId: string;
  availabilities: {
    date: string;
    shift: 'MORNING' | 'AFTERNOON' | 'NIGHT';
    status: 'AVAILABLE' | 'UNAVAILABLE' | 'PREFERRED_TO_WORK';
  }[];
}

export interface Schedule {
  id: string;
  userId: string;
  date: string;
  shift: 'MORNING' | 'AFTERNOON' | 'NIGHT';
  user?: {
    id: string;
    name: string;
  };
}

export interface UpdateSchedulePayload {
  assignments: {
    userId: string;
    date: string;
    shift: 'MORNING' | 'AFTERNOON' | 'NIGHT';
  }[];
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
 
  prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  // tags for invalidation and refetching
  tagTypes: [
    "Employees",
    "Availability",
    "Schedule",
  ],
  endpoints: (build) => ({
    // --- Employees ---
    getEmployees: build.query<Employee[], void>({
      query: () => `/employees`,
      providesTags: ["Employees"],
    }),
    getEmployeeById: build.query<Employee, string>({
      query: (id) => `/employees/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Employees", id }],
    }),
    createEmployee: build.mutation<Employee, CreateEmployeePayload>({
      query: (payload) => ({
        url: `/employees`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ["Employees"],
    }),

    // --- Availability ---
    getAvailabilities: build.query<Availability[], void>({
      query: () => `/availability`,
      providesTags: ["Availability"],
    }),
    getAvailabilityByEmployeeId: build.query<Availability[], string>({
      query: (employeeId) => `/availability/${employeeId}`,
      providesTags: (_result, _error, id) => [{ type: "Availability", id }],
    }),
    updateAvailability: build.mutation<void, UpdateAvailabilityPayload>({
      query: ({ employeeId, availabilities }) => ({
        url: `/availability/${employeeId}`,
        method: 'PUT',
        body: { availabilities },
      }),
      invalidatesTags: (_result, _error, { employeeId }) => [{ type: "Availability", id: employeeId }],
    }),

    // --- Schedule ---
    getSchedules: build.query<Schedule[], void>({
      query: () => `/schedule`,
      providesTags: ["Schedule"],
    }),
    updateSchedule: build.mutation<void, UpdateSchedulePayload>({
      query: (payload) => ({
        url: `/schedule`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ["Schedule"],
    }),
  }),
});

export const {
  // Employees
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  // Availability
  useGetAvailabilitiesQuery,
  useGetAvailabilityByEmployeeIdQuery,
  useUpdateAvailabilityMutation,
  // Schedule
  useGetSchedulesQuery,
  useUpdateScheduleMutation,
} = api;
