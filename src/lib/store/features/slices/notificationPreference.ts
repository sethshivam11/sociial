import { NotificationPreferenceSliceI } from "@/types/sliceTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: NotificationPreferenceSliceI = {
  loading: false,
  pushNotifications: {
    likes: false,
    comments: false,
    commentLikes: false,
    storyLikes: false,
    newFollowers: false,
    newMessages: false,
    newGroups: false,
  },
  emailNotifications: {
    newProducts: false,
    announcements: false,
    support: false,
  },
};

export const saveToken = createAsyncThunk(
  "pushNotification/saveToken",
  async (token: string) => {
    const parsed = await fetch("/api/v1/notificationPreferences/saveToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    return parsed.json();
  }
);

export const getPreferences = createAsyncThunk(
  "pushNotification/getPreferences",
  async () => {
    const parsed = await fetch("/api/v1/notificationPreferences/get");
    return parsed.json();
  }
);

export const updatePreferences = createAsyncThunk(
  "pushNotification/updatePreferences",
  async (preferences: {
    likes?: boolean;
    comments?: boolean;
    commentLikes?: boolean;
    storyLikes?: boolean;
    newFollowers?: boolean;
    newMessages?: boolean;
    newGroups?: boolean;
    newProducts?: boolean;
    announcements?: boolean;
    support?: boolean;
  }) => {
    const parsed = await fetch(
      "/api/v1/notificationPreferences/updatePreferences",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      }
    );
    return parsed.json();
  }
);

const notificationPreference = createSlice({
  name: "pushNotification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(saveToken.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(saveToken.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(saveToken.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(getPreferences.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPreferences.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.pushNotifications = action.payload.data.pushNotifications;
        state.emailNotifications = action.payload.data.emails;
      }
    });
    builder.addCase(getPreferences.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(updatePreferences.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updatePreferences.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.pushNotifications = action.payload.data.pushNotifications;
        state.emailNotifications = action.payload.data.emails;
      }
    });
    builder.addCase(updatePreferences.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default notificationPreference.reducer;
