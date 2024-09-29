import { NotificationPreferenceSliceI } from "@/types/sliceTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: NotificationPreferenceSliceI = {
  loading: false,
  skeletonLoading: false,
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
  "notificationPreference/saveToken",
  async (token: string) => {
    const parsed = await fetch("/api/v1/notificationPreferences/saveToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        prevToken: localStorage.getItem("notificationToken"),
      }),
    });
    return parsed.json();
  }
);

export const deleteToken = createAsyncThunk(
  "notificationPreference/deleteToken",
  async (token: string) => {
    const parsed = await fetch(
      `/api/v1/notificationPreferences/deleteToken/${token}`,
      {
        method: "DELETE",
      }
    );
    return parsed.json();
  }
);

export const updateToken = createAsyncThunk(
  "notificationPreference/updateToken",
  async ({ prevToken, newToken }: { prevToken: string; newToken: string }) => {
    const parsed = await fetch("/api/v1/notificationPreferences/updateToken", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prevToken, newToken }),
    });
    return parsed.json();
  }
);

export const checkExistingToken = createAsyncThunk(
  "notificationPreference/checkExistingToken",
  async (token: string) => {
    const parsed = await fetch(
      `/api/v1/notificationPreferences/checkToken/${token}`
    );
    return parsed.json();
  }
);

export const getPreferences = createAsyncThunk(
  "notificationPreference/getPreferences",
  async () => {
    const parsed = await fetch("/api/v1/notificationPreferences/get");
    return parsed.json();
  }
);

export const updatePreferences = createAsyncThunk(
  "notificationPreference/updatePreferences",
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
    builder
      .addCase(saveToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveToken.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          localStorage.setItem(
            "notificationToken",
            `{"consent": false,"expiry": 0, "token": "${
              action.meta.arg
            }", "lastChecked": ${Date.now()}}`
          );
        }
      })
      .addCase(saveToken.rejected, (state) => {
        state.loading = false;
      });

    builder.addCase(checkExistingToken.fulfilled, (_, action) => {
      if (!action.payload?.success) {
        localStorage.removeItem("notificationToken");
      } else {
        localStorage.setItem(
          "notificationToken",
          `{"consent": false,"expiry": 0, "token": "${
            action.meta.arg
          }", "lastChecked": ${Date.now()}}`
        );
      }
    });

    builder
      .addCase(updateToken.pending, (state) => {
        state.loading = false;
      })
      .addCase(updateToken.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          localStorage.setItem(
            "notificationToken",
            `{"consent": false,"expiry": 0, "token": "${
              action.meta.arg.newToken
            }", "lastChecked": ${Date.now()}}`
          );
        }
      })
      .addCase(updateToken.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(deleteToken.pending, (state) => {
        state.loading = false;
      })
      .addCase(deleteToken.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          localStorage.setItem(
            "notificationToken",
            `{"consent": false,"expiry": 0, "token": null, "lastChecked": ${Date.now()}}`
          );
        }
      })
      .addCase(deleteToken.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getPreferences.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getPreferences.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.pushNotifications = action.payload.data.pushNotifications;
          state.emailNotifications = action.payload.data.emails;
        }
      })
      .addCase(getPreferences.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(updatePreferences.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.pushNotifications = action.payload.data.pushNotifications;
          state.emailNotifications = action.payload.data.emails;
        }
      })
      .addCase(updatePreferences.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default notificationPreference.reducer;
