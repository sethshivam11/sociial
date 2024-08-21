"use client";
import { UserSliceI } from "@/types/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { store, useAppDispatch } from "../../store";

const initialState: UserSliceI = {
  user: {
    _id: "",
    avatar: "",
    fullName: "",
    username: "",
    email: "",
    followingCount: 0,
    followersCount: 0,
    postsCount: 0,
    isMailVerified: false,
    bio: "",
    blocked: [],
  },
  profile: {
    _id: "",
    fullName: "",
    username: "",
    avatar: "",
    bio: "",
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
  },
  searchResults: [],
  followers: [],
  following: [],
  unreadMessageCount: 0,
  newNotifications: false,
  loading: false,
  skeletonLoading: false,
  isLoggedIn: false,
  isSendingMail: false,
  page: 1,
};

export const loginUser = createAsyncThunk(
  "users/login",
  async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    const parsed = await fetch("/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    return parsed.json();
  }
);

export const registerUser = createAsyncThunk(
  "users/register",
  async ({
    username,
    email,
    password,
    fullName,
    avatar,
  }: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    avatar: File | null;
  }) => {
    if (!username || !email || !password || !fullName) {
      return;
    }
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("fullName", fullName);
    if (avatar) formData.append("avatar", avatar);
    const parsed = await fetch("/api/v1/users/register", {
      method: "POST",
      body: formData,
    });
    return parsed.json();
  }
);

export const verifyCode = createAsyncThunk(
  "users/verifyCode",
  async ({ username, code }: { username: string; code: number }) => {
    if (!username || !code) return;
    const parsed = await fetch(
      `/api/v1/users/verify?username=${username}&code=${code}`
    );
    return parsed.json();
  }
);

export const resendVerificationCode = createAsyncThunk(
  "users/resendCode",
  async (username: string) => {
    if (!username) return;
    const parsed = await fetch(`/api/v1/users/resendMail?username=${username}`);
    return parsed.json();
  }
);

export const forgotPassword = createAsyncThunk(
  "users/forgotPassword",
  async ({
    email,
    code,
    username,
    password,
  }: {
    email: string;
    code: string;
    username: string;
    password: string;
  }) => {
    if (!email && !username) return;
    const parsed = await fetch("/api/v1/users/forgotPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, code, password }),
    });
    return parsed.json();
  }
);

export const getProfile = createAsyncThunk(
  "users/getProfile",
  async ({ username, _id }: { username?: string; _id?: string }) => {
    if (!username && !_id) {
      return;
    }
    const parsed = await fetch(
      `/api/v1/users/getProfile?${
        username ? `username=${username}` : `_id=${_id}`
      }`
    );
    return parsed.json();
  }
);

export const logOutUser = createAsyncThunk("users/logout", async () => {
  const parsed = await fetch("/api/v1/users/logout");
  return parsed.json();
});

export const updatePassword = createAsyncThunk(
  "users/changePassword",
  async ({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }) => {
    if (!oldPassword || !newPassword) return;
    const parsed = await fetch("/api/v1/users/changePassword", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    return parsed.json();
  }
);

export const updateAvatar = createAsyncThunk(
  "users/updateAvatar",
  async (avatar: File) => {
    if (!avatar) return;
    const formData = new FormData();
    formData.append("avatar", avatar);
    const parsed = await fetch("/api/v1/users/updateAvatar", {
      method: "PATCH",
      body: formData,
    });
    return parsed.json();
  }
);

export const removeAvatar = createAsyncThunk("users/removeAvatar", async () => {
  const parsed = await fetch("/api/v1/users/removeAvatar");
  return parsed.json();
});

export const getLoggedInUser = createAsyncThunk("users/getUser", async () => {
  const parsed = await fetch("/api/v1/users/get");
  return parsed.json();
});

export const updateDetails = createAsyncThunk(
  "users/updateDetails",
  async ({
    fullName,
    username,
    bio,
  }: {
    fullName?: string;
    username?: string;
    bio?: string;
  }) => {
    if (!fullName && !username && !bio) return;
    const parsed = await fetch("/api/v1/users/updateDetails", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullName, username, bio }),
    });
    return parsed.json();
  }
);

export const renewAccessToken = createAsyncThunk(
  "users/renewAccessToken",
  async () => {
    const parsed = await fetch("/api/v1/users/renewAccessToken", {
      method: "POST",
      body: JSON.stringify({
        refreshToken: localStorage.getItem("refreshToken"),
      }),
    });
    return parsed.json();
  }
);

export const blockUser = createAsyncThunk(
  "users/blockUser",
  async (userId: string) => {
    const parsed = await fetch(`/api/v1/users/block/${userId}`);
    return parsed.json();
  }
);

export const unblockUser = createAsyncThunk(
  "usrers/unblockUser",
  async (userId: string) => {
    const parsed = await fetch(`/api/v1/users/unblock/${userId}`);
    return parsed.json();
  }
);

export const searchUsers = createAsyncThunk(
  "users/search",
  async (query: string) => {
    if (query.trim() === "")
      return {
        data: null,
        success: false,
        message: "Not Found",
        status: 404,
      };
    const parsed = await fetch(`/api/v1/users/search?query=${query.trim()}`);
    return parsed.json();
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.isLoggedIn = true;
          state.user = action.payload.data.user;
          localStorage.setItem("accessToken", action.payload.data.accessToken);
          localStorage.setItem(
            "refreshToken",
            action.payload.data.refreshToken
          );
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
      });

    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user = action.payload.data;
        }
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(verifyCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.isLoggedIn = true;
          state.user.isMailVerified = action.payload.isMailVerified;
        }
      })
      .addCase(verifyCode.rejected, (state, payload) => {
        state.loading = false;
      });

    builder
      .addCase(resendVerificationCode.pending, (state) => {
        state.isSendingMail = true;
      })
      .addCase(
        resendVerificationCode.fulfilled || resendVerificationCode.rejected,
        (state) => {
          state.isSendingMail = false;
        }
      );

    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        forgotPassword.fulfilled || forgotPassword.rejected,
        (state, action) => {
          state.loading = false;
        }
      );

    builder
      .addCase(getProfile.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload.success) {
          state.profile = action.payload.data;
        }
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(logOutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logOutUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.isLoggedIn = false;
          state.user = initialState.user;
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("notificationConsent");
          localStorage.removeItem("message-theme");
          localStorage.removeItem("recentSearches");
        }
      })
      .addCase(logOutUser.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePassword.fulfilled || updatePassword.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(updateAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user.avatar = action.payload.data.avatar;
        }
      })
      .addCase(updateAvatar.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(removeAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeAvatar.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user.avatar = action.payload.data.avatar;
        }
      })
      .addCase(removeAvatar.rejected, (state, action) => {
        state.loading = false;
      });

    builder
      .addCase(getLoggedInUser.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getLoggedInUser.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload.success) {
          state.isLoggedIn = true;
          state.user = action.payload.data;
        }
        if (!action.payload?.success) {
          switch (action.payload?.message) {
            case "Invalid token!" || "Token expired!":
              localStorage.getItem("refreshToken") &&
                store.dispatch(renewAccessToken());
              break;
            case "User not found":
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              break;
          }
        }
      })
      .addCase(getLoggedInUser.rejected, (state, action) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(updateDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDetails.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user.fullName = action.payload.data.fullName;
          state.user.username = action.payload.data.username;
          state.user.bio = action.payload.data.bio;
        }
      })
      .addCase(updateDetails.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(renewAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(renewAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          localStorage.setItem("accessToken", action.payload.data.accessToken);
        }
      })
      .addCase(renewAccessToken.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(blockUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user.blocked.push(action.payload.data.blocked);
        }
      })
      .addCase(blockUser.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(unblockUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user.blocked = state.user.blocked.filter(
            (user) => user !== action.payload.data.unblockUserId
          );
        }
      })
      .addCase(unblockUser.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(searchUsers.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload.success) {
          state.searchResults = action.payload.data;
        } else if (action.payload.message === "No users found") {
          state.searchResults = [];
        }
      })
      .addCase(searchUsers.rejected, (state) => {
        state.skeletonLoading = false;
        state.searchResults = [];
      });
  },
});

export default userSlice.reducer;
export const { setPage } = userSlice.actions;
