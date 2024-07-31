"use client";
import { UserSliceI } from "@/types/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
    followers: 0,
    following: 0,
    postsCount: 0,
    isPremium: false,
  },
  followers: [],
  following: [],
  unreadMessageCount: 0,
  newNotifications: false,
  loading: false,
  isError: false,
  isLoggedIn: false,
  isSendingMail: false,
  page: 0,
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
    const parsed = await fetch(`/api/v1/verify?${username}&code=${code}`);
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

export const getProfile = createAsyncThunk(
  "users/getProfile",
  async ({ username, _id }: { username?: string; _id?: string }) => {
    if (!username && !_id) {
      return;
    }
    const parsed = await fetch(`/api/v1/users?username=${username}&_id=${_id}`);
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

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.isError = false;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoggedIn = true;
      state.loading = false;
      if (action.payload && action.payload.success) {
        state.user = action.payload.data.user;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoggedIn = false;
      state.isError = true;
      state.loading = false;
    });

    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.isError = false;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoggedIn = true;
      state.loading = false;
      if (action.payload && action.payload.success) {
        state.user = action.payload.data;
      }
    });
    builder.addCase(registerUser.rejected, (state) => {
      state.isLoggedIn = false;
      state.isError = true;
      state.loading = false;
    });

    builder.addCase(verifyCode.pending, (state) => {
      state.loading = true;
      state.isError = false;
    });
    builder.addCase(verifyCode.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload && action.payload.success) {
        state.user.isMailVerified = action.payload.isMailVerified;
      }
    });
    builder.addCase(verifyCode.rejected, (state, payload) => {
      state.isError = true;
      state.loading = false;
    });

    builder.addCase(resendVerificationCode.pending, (state) => {
      state.isSendingMail = true;
    });
    builder.addCase(resendVerificationCode.fulfilled, (state) => {
      state.isSendingMail = false;
    });
    builder.addCase(resendVerificationCode.rejected, (state) => {
      state.isSendingMail = false;
    });

    builder.addCase(getProfile.pending, (state) => {
      state.loading = true;
      state.isError = false;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload && action.payload.success) {
        state.profile = action.payload.data;
      } else if (
        action.payload &&
        action.payload.message === "Token expired!"
      ) {
        console.log(action);
      }
    });
    builder.addCase(getProfile.rejected, (state, action) => {
      state.isError = true;
      state.loading = false;
    });

    builder.addCase(logOutUser.pending, (state) => {
      state.loading = true;
      state.isError = false;
    });
    builder.addCase(logOutUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isLoggedIn = false;
      if (action.payload && action.payload.success) {
        state.user = initialState.user;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    });
    builder.addCase(logOutUser.rejected, (state) => {
      state.isError = true;
      state.loading = false;
    });

    builder.addCase(updatePassword.pending, (state) => {
      state.loading = true;
      state.isError = false;
    });
    builder.addCase(updatePassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updatePassword.rejected, (state) => {
      state.isError = true;
      state.loading = false;
    });

    builder.addCase(updateAvatar.pending, (state) => {
      state.loading = true;
      state.isError = false;
    });
    builder.addCase(updateAvatar.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload && action.payload.success) {
        state.user.avatar = action.payload.data.avatar;
      }
    });
    builder.addCase(updateAvatar.rejected, (state) => {
      state.isError = true;
      state.loading = false;
    });

    builder.addCase(removeAvatar.pending, (state) => {
      state.loading = true;
      state.isError = false;
    });
    builder.addCase(removeAvatar.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload && action.payload.success) {
        state.user.avatar = action.payload.data.avatar;
      }
    });
    builder.addCase(removeAvatar.rejected, (state, action) => {
      state.isError = true;
      state.loading = false;
    });

    builder.addCase(getLoggedInUser.pending, (state) => {
      state.loading = true;
      state.isError = false;
    });
    builder.addCase(getLoggedInUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
      if (action.payload && action.payload.success) {
        state.user = action.payload.data;
      }
    });
    builder.addCase(getLoggedInUser.rejected, (state) => {
      state.isError = true;
      state.loading = false;
    });

    builder.addCase(updateDetails.pending, (state) => {
      state.loading = true;
      state.isError = false;
    });
    builder.addCase(updateDetails.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload && action.payload.success) {
        state.user.fullName = action.payload.data.fullName;
        state.user.username = action.payload.data.username;
        state.user.bio = action.payload.data.bio;
      }
    });
    builder.addCase(updateDetails.rejected, (state) => {
      state.isError = true;
      state.loading = false;
    });

    builder.addCase(renewAccessToken.pending, (state) => {
      state.loading = true;
      state.isError = false;
    });
    builder.addCase(renewAccessToken.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload && action.payload.success) {
        localStorage.setItem("accessToken", action.payload.data.accessToken);
      } else if (action.payload && action.payload.success === false) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    });
    builder.addCase(renewAccessToken.rejected, (state) => {
      state.isError = true;
      state.loading = false;
    });

    builder.addCase(blockUser.pending, (state) => {
      state.isError = false;
      state.loading = true;
    });
    builder.addCase(blockUser.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload && action.payload.success) {
        state.user.blocked.push(action.payload.data.blocked);
      }
    });
    builder.addCase(blockUser.rejected, (state) => {
      state.isError = true;
      state.loading = false;
    });

    builder.addCase(unblockUser.pending, (state) => {
      state.isError = false;
      state.loading = true;
    });
    builder.addCase(unblockUser.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload && action.payload.success) {
        state.user.blocked = state.user.blocked.filter(
          (user) => user !== action.payload.data.unblockUserId
        );
      }
    });
    builder.addCase(unblockUser.rejected, (state) => {
      state.loading = false;
      state.isError = true;
    });
  },
});

export default userSlice.reducer;
