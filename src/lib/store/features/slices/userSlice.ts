"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface StateI {
  user: {
    _id: string;
    avatar: string;
    fullName: string;
    username: string;
    email: string;
    followingCount: number;
    followersCount: number;
    postsCount: number;
    isMailVerified: boolean;
    bio: string;
    blocked: string[];
  };
  profile: {
    _id: string;
    fullName: string;
    username: string;
    avatar: string;
    bio: string;
    followers: number;
    following: number;
    postsCount: number;
    isPremium: boolean;
  };
  isOffline: boolean;
  followers: {
    _id: string;
    avatar: string;
    fullName: string;
    username: string;
  }[];
  following: {
    _id: string;
    avatar: string;
    fullName: string;
    username: string;
  }[];
  unreadMessageCount: number;
  newNotifications: boolean;
  loading: boolean;
  isError: boolean;
  isLoggedIn: boolean;
  isSendingMail: boolean;
  page: number;
}

const initialState: StateI = {
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
  isOffline: false,
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
      state.user = action.payload.user;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    });
    builder.addCase(loginUser.rejected, (state, payload) => {
      state.isLoggedIn = false;
      state.isError = true;
      state.loading = false;
      console.log(payload);
    });
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.isError = false;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoggedIn = true;
      state.loading = false;
      state.user = action.payload.user;
    });
    builder.addCase(registerUser.rejected, (state, payload) => {
      state.isLoggedIn = false;
      state.isError = true;
      state.loading = false;
    });
  },
});

export default userSlice.reducer;
