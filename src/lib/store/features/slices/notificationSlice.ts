import { NotificationSliceI } from "@/types/sliceTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: NotificationSliceI = {
  notifications: [],
  loading: false,
  skeletonLoading: false,
  loadingMore: false,
  page: 1,
};

export const getNotifications = createAsyncThunk(
  "notifications/get",
  async () => {
    const parsed = await fetch("/api/v1/notifications");
    return parsed.json();
  }
);

export const getMoreNotfications = createAsyncThunk(
  "notifications/getMore",
  async (page: number) => {
    const parsed = await fetch(`/api/v1/notifications?page=${page}`);
    return parsed.json();
  }
);

export const readNotification = createAsyncThunk(
  "notifications/read",
  async () => {
    const parsed = await fetch(`/api/v1/notifications/read`);
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

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNotifications.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getNotifications.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.success) {
        state.notifications = action.payload.data;
      }
    });
    builder.addCase(getNotifications.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(getMoreNotfications.pending, (state) => {
      state.loadingMore = true;
    });
    builder.addCase(getMoreNotfications.fulfilled, (state, action) => {
      state.loadingMore = false;
      if (action.payload.success) {
        state.notifications = [...state.notifications, ...action.payload.data];
      }
    });
    builder.addCase(getMoreNotfications.rejected, (state) => {
      state.loadingMore = false;
    });

    builder.addCase(readNotification.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(readNotification.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.success) {
        state.notifications = state.notifications.map((notification) => {
          notification.read = true;
          return notification;
        });
      }
    });
    builder.addCase(readNotification.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(deleteNotification.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteNotification.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.success) {
        state.notifications = state.notifications.filter(
          (notification) => notification._id !== action.payload.data._id
        );
      }
    });
    builder.addCase(deleteNotification.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default notificationSlice.reducer;
