import { NotificationSliceI } from "@/types/sliceTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: NotificationSliceI = {
  notifications: [],
  loading: false,
  skeletonLoading: false,
};

export const getNotifications = createAsyncThunk(
  "notifications/get",
  async () => {
    const parsed = await fetch("/api/v1/notifications");
    return parsed.json();
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (notificationId: string) => {
    const parsed = await fetch(`/api/v1/notifications/${notificationId}`, {
      method: "DELETE",
    });
    return parsed.json();
  }
);

export const deleteAllNotification = createAsyncThunk(
  "notifications/deleteAll",
  async () => {
    const parsed = await fetch("/api/v1/notifications/deleteAll", {
      method: "DELETE",
    });
    return parsed.json();
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.notifications = action.payload.data;
        }
      })
      .addCase(getNotifications.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.notifications = state.notifications.filter(
            (notification) => notification._id !== action.payload.data._id
          );
        }
      })
      .addCase(deleteNotification.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(deleteAllNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAllNotification.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.notifications = [];
        }
      })
      .addCase(deleteAllNotification.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default notificationSlice.reducer;
