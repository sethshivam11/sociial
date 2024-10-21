"use client";
import { UserSliceI } from "@/types/sliceTypes";
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
    savedPosts: [],
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
  blocked: [],
  searchResults: [],
  suggestions: [],
  savedPosts: [],
  followers: [],
  following: [],
  unreadMessageCount: 0,
  newNotifications: false,
  loading: false,
  skeletonLoading: false,
  isLoggedIn: false,
  isSendingMail: false,
};

export const loginUser = createAsyncThunk(
  "users/login",
  async ({
    username,
    email,
    password,
    device,
    location,
  }: {
    username: string;
    email: string;
    password: string;
    device: string;
    location: string;
  }) => {
    const parsed = await fetch("/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, location, device }),
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
    // return axios.post("/api/v1/users/register", formData);
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
  async ({ username, email }: { username: string; email?: string }) => {
    if (!username) return;
    const parsed = await fetch(
      `/api/v1/users/resendMail?username=${username}${
        email ? `&email=${email}` : ""
      }`
    );
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
  const token = localStorage.getItem("notification-token") || "";
  const parsed = await fetch(
    `/api/v1/users/logout${token ? `?firebaseToken=${token}` : ""}`
  );
  return parsed.json();
});

export const updatePassword = createAsyncThunk(
  "users/updatePassword",
  async ({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }) => {
    if (!oldPassword || !newPassword) return;
    const parsed = await fetch("/api/v1/users/updatePassword", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    return parsed.json();
  }
);

export const updateEmail = createAsyncThunk(
  "users/updateEmail",
  async ({ email, code }: { email: string; code: string }) => {
    if (!email) return;
    const parsed = await fetch("/api/v1/users/updateEmail", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
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
  const token = localStorage.getItem("token");
  if (!token)
    return {
      success: false,
      data: null,
      message: "No token found",
      status: 401,
    };
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
    if (!fullName && !username && !bio)
      return {
        success: false,
        message: "Atleast one field is required",
        data: null,
        status: 400,
      };
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

export const getBlockedUsers = createAsyncThunk(
  "users/getBlocked",
  async () => {
    const parsed = await fetch("/api/v1/users/blocked");
    return parsed.json();
  }
);

export const blockUser = createAsyncThunk(
  "users/blockUser",
  async (userId: string) => {
    const parsed = await fetch(`/api/v1/users/block?userId=${userId}`);
    return parsed.json();
  }
);

export const unblockUser = createAsyncThunk(
  "users/unblockUser",
  async (userId: string) => {
    const parsed = await fetch(`/api/v1/users/unblock?userId=${userId}`);
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

export const getSavedPosts = createAsyncThunk(
  "users/getSavedPosts",
  async () => {
    const parsed = await fetch("/api/v1/users/saved");
    return parsed.json();
  }
);

export const savePost = createAsyncThunk(
  "users/savePost",
  async (postId: string) => {
    const parsed = await fetch(`/api/v1/users/save/${postId}`);
    return parsed.json();
  }
);

export const unsavePost = createAsyncThunk(
  "users/unsavePost",
  async (postId: string) => {
    const parsed = await fetch(`/api/v1/users/unsave/${postId}`);
    return parsed.json();
  }
);

export const getUserSuggestions = createAsyncThunk(
  "users/suggestions",
  async () => {
    const parsed = await fetch("/api/v1/users/suggestions");
    return parsed.json();
  }
);

export const getSessions = createAsyncThunk("users/sessions", async () => {
  const parsed = await fetch("/api/v1/users/sessions");
  return parsed.json();
});

export const removeSession = createAsyncThunk(
  "users/removeSession",
  async (sessionId: string) => {
    const parsed = await fetch(`/api/v1/users/removeSession/${sessionId}`, {
      method: "DELETE",
    });
    return parsed.json();
  }
);

export const clearCookies = createAsyncThunk("users/clearCookies", async () => {
  const parsed = await fetch("/api/v1/users/clearCookies");
  localStorage.removeItem("token");
  return parsed.json();
});

export const logOutAllDevices = createAsyncThunk(
  "users/logOutAllDevices",
  async () => {
    const parsed = await fetch("/api/v1/users/removeAllSessions", {
      method: "DELETE",
    });
    return parsed.json();
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSuggestionLoading(state, action) {
      state.suggestions = state.suggestions.map((suggestion) => {
        if (suggestion._id === action.payload) {
          suggestion.loading = true;
        }
        return suggestion;
      });
    },
    setFollowing(state, action) {
      state.suggestions = state.suggestions.map((suggestion) => {
        if (suggestion._id === action.payload.userId) {
          suggestion.loading = false;
          suggestion.isFollowing = action.payload.isFollowing;
        }
        return suggestion;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.isLoggedIn = true;
          state.user = action.payload.data.user;
          localStorage.setItem("token", action.payload.data.token);
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
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
        if (action.payload?.success) {
          state.isLoggedIn = true;
          state.user.isMailVerified = action.payload.isMailVerified;
        }
      })
      .addCase(verifyCode.rejected, (state) => {
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
      .addCase(forgotPassword.fulfilled || forgotPassword.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getProfile.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.profile = action.payload.data;
        }
      })
      .addCase(getProfile.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(logOutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logOutUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.isLoggedIn = false;
          state.user = initialState.user;
          if (document?.cookie) document.cookie = "";
          localStorage.removeItem("token");
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
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(updateEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEmail.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) state.user.email = action.meta.arg.email;
      })
      .addCase(updateEmail.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(updateAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
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
        if (action.payload?.success) {
          state.user.avatar = action.payload.data.avatar;
        }
      })
      .addCase(removeAvatar.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getLoggedInUser.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getLoggedInUser.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.isLoggedIn = true;
          state.user = action.payload.data;
          if (!action.payload.data.isMailVerified) {
            state.isLoggedIn = false;
          }
        }
      })
      .addCase(getLoggedInUser.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(updateDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDetails.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          const { username, fullName, bio } = action.meta.arg;
          if (fullName) state.user.fullName = fullName;
          if (username) state.user.username = username;
          if (bio) state.user.bio = bio;
        }
      })
      .addCase(updateDetails.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getBlockedUsers.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getBlockedUsers.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.blocked = action.payload.data;
        }
      })
      .addCase(getBlockedUsers.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(blockUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.user.blocked.push(action.meta.arg);
        }
        state.blocked = state.blocked.filter(
          (user) => user._id !== action.meta.arg
        );
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
        if (action.payload?.success) {
          state.user.blocked = state.user.blocked.filter(
            (user) => user !== action.meta.arg
          );
          state.blocked = state.blocked.filter(
            (user) => user._id !== action.meta.arg
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
        if (action.payload?.success) {
          state.searchResults = action.payload.data;
        } else if (action.payload.message === "No users found") {
          state.searchResults = [];
        }
      })
      .addCase(searchUsers.rejected, (state) => {
        state.skeletonLoading = false;
        state.searchResults = [];
      });

    builder
      .addCase(getSavedPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSavedPosts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.savedPosts = action.payload.data.map(
            (user: { loading: boolean; isFollowing: boolean }) => ({
              ...user,
              loading: false,
              isFollowing: false,
            })
          );
        } else if (!action.payload?.success) {
          state.savedPosts = [];
        }
      })
      .addCase(getSavedPosts.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(savePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(savePost.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.user.savedPosts.push(action.meta.arg);
        }
      })
      .addCase(savePost.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(unsavePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(unsavePost.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.user.savedPosts = state.user.savedPosts.filter(
            (post) => post !== action.meta.arg
          );
        }
      })
      .addCase(unsavePost.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getUserSuggestions.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getUserSuggestions.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.suggestions = action.payload.data;
        } else if (action.payload.message === "No users found") {
          state.suggestions = [];
        }
      })
      .addCase(getUserSuggestions.rejected, (state) => {
        state.skeletonLoading = false;
      });
  },
});

export default userSlice.reducer;
export const { setSuggestionLoading, setFollowing } = userSlice.actions;
