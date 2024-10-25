import { StorySliceI } from "@/types/sliceTypes";
import { StoryI } from "@/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: StorySliceI = {
  stories: [],
  userStory: {
    _id: "",
    user: {
      _id: "",
      avatar: "",
      fullName: "",
      username: "",
    },
    media: [],
    seenBy: [],
    likes: [],
    selfSeen: false,
    blockedTo: [],
    createdAt: "",
  },
  loading: false,
  skeletonLoading: false,
};

export const createStory = createAsyncThunk(
  "stories/create",
  async (stories: File[]) => {
    const formData = new FormData();
    stories.forEach((story) => {
      formData.append("media", story);
    });
    const parsed = await fetch("/api/v1/stories/new", {
      method: "POST",
      body: formData,
    });
    return parsed.json();
  }
);

export const replyStory = createAsyncThunk(
  "stories/reply",
  async ({ storyId, content }: { storyId: string; content: string }) => {
    const parsed = await fetch("/api/v1/stories/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ storyId, content }),
    });
    return parsed.json();
  }
);

export const getStories = createAsyncThunk("stories/all", async () => {
  const parsed = await fetch("/api/v1/stories");
  return parsed.json();
});

export const getUserStory = createAsyncThunk(
  "stories/user",
  async (username?: string) => {
    const parsed = await fetch(
      `/api/v1/stories/user${username ? `/${username}` : ""}`
    );
    return parsed.json();
  }
);

export const deleteStory = createAsyncThunk(
  "stories/delete",
  async (storyId: string) => {
    const parsed = await fetch(`/api/v1/stories/delete/${storyId}`, {
      method: "DELETE",
    });
    return parsed.json();
  }
);

export const markSelfSeen = createAsyncThunk("stories/markSeen", async () => {
  const response = await fetch("/api/v1/stories/markSelfSeen", {
    method: "PATCH",
  });
  return response.json();
});

export const seenStory = createAsyncThunk(
  "stories/seen",
  async ({ storyId, userId }: { storyId: string; userId: string }) => {
    const parsed = await fetch(`/api/v1/stories/seen/${storyId}`, {
      method: "PATCH",
    });
    return parsed.json();
  }
);

export const likeStory = createAsyncThunk(
  "stories/like",
  async ({ storyId, userId }: { storyId: string; userId: string }) => {
    const parsed = await fetch(`/api/v1/stories/like/${storyId}`, {
      method: "PATCH",
    });
    return parsed.json();
  }
);

export const unlikeStory = createAsyncThunk(
  "stories/unlike",
  async ({ storyId, userId }: { storyId: string; userId: string }) => {
    const parsed = await fetch(`/api/v1/stories/unlike/${storyId}`, {
      method: "PATCH",
    });
    return parsed.json();
  }
);

const storySlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createStory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.userStory = action.payload.data;
        }
      })
      .addCase(createStory.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(replyStory.pending, (state) => {
        state.loading = true;
      })
      .addCase(replyStory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(replyStory.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getStories.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getStories.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          const existingStories = state.stories;
          const storiesMap = new Map(
            existingStories.map((story) => [story._id, story])
          );

          action.payload.data.forEach((story: StoryI) =>
            storiesMap.set(story._id, story)
          );
          state.stories = Array.from(storiesMap.values());
        }
      })
      .addCase(getStories.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder.addCase(getUserStory.fulfilled, (state, action) => {
      if (action.payload?.success) {
        state.userStory = action.payload.data;
      } else if (action.payload?.message === "No stories found") {
        state.userStory = initialState.userStory;
      }
    });

    builder.addCase(markSelfSeen.fulfilled, (state, action) => {
      if (action.payload?.success && state.userStory) {
        state.userStory.selfSeen = true;
      }
    });

    builder
      .addCase(deleteStory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.userStory = initialState.userStory;
        }
      })
      .addCase(deleteStory.rejected, (state) => {
        state.loading = false;
      });

    builder.addCase(seenStory.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.success) {
        state.stories = state.stories.map((story) => {
          if (story._id === action.meta.arg.storyId) {
            story.seenBy.push(action.meta.arg.userId);
          }
          return story;
        });
      }
    });

    builder
      .addCase(likeStory.pending, (state) => {
        state.loading = true;
      })
      .addCase(likeStory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.stories = state.stories.map((story) => {
            if (story._id === action.meta.arg.storyId) {
              story.likes.push(action.meta.arg.userId);
            }
            return story;
          });
        }
      })
      .addCase(likeStory.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(unlikeStory.pending, (state) => {
        state.loading = true;
      })
      .addCase(unlikeStory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.stories = state.stories.map((story) => {
            if (story._id === action.meta.arg.storyId) {
              story.likes = story.likes.filter(
                (like) => like !== action.meta.arg.userId
              );
            }
            return story;
          });
        }
      })
      .addCase(unlikeStory.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default storySlice.reducer;
export const { setLoading } = storySlice.actions;
