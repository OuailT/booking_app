import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Employee {
  id: string;
  name: string;
  role: string;
  loginCode: string;
}

export interface Availability {
  id: string;
  userId: string;
  date: string;
  shift: 'MORNING' | 'AFTERNOON' | 'NIGHT';
}

export interface UpdateAvailabilityPayload {
  employeeId: string;
  availabilities: {
    date: string;
    shift: 'MORNING' | 'AFTERNOON' | 'NIGHT';
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

    // --- Availability ---
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
  // Availability
  useGetAvailabilityByEmployeeIdQuery,
  useUpdateAvailabilityMutation,
  // Schedule
  useGetSchedulesQuery,
  useUpdateScheduleMutation,
} = api;
