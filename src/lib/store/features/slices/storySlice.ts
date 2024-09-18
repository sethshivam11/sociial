import { StorySliceI } from "@/types/sliceTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: StorySliceI = {
  stories: [],
  story: {
    _id: "",
    user: {
      _id: "",
      username: "",
      fullName: "",
      avatar: "",
    },
    media: [],
    likes: [],
    seenBy: [],
    blockedTo: [],
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
    const parsed = await fetch("/api/v1//stories/new", {
      method: "POST",
      body: formData,
    });
    return parsed.json();
  }
);

export const getStories = createAsyncThunk("stories/all", async () => {
  const parsed = await fetch("/api/v1/stories");
  return parsed.json();
});

export const getStory = createAsyncThunk(
  "stories/get",
  async (storyId: string) => {
    const parsed = await fetch(`/api/v1/stories/${storyId}`);
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

export const seenStory = createAsyncThunk(
  "stories/seen",
  async (storyId: string) => {
    const parsed = await fetch(`/api/v1/stories/seen/${storyId}`);
    return parsed.json();
  }
);

export const likeStory = createAsyncThunk(
  "stories/like",
  async (storyId: string) => {
    const parsed = await fetch(`/api/v1/stories/like/${storyId}`);
    return parsed.json();
  }
);

export const unlikeStory = createAsyncThunk(
  "stories/unlike",
  async (storyId: string) => {
    const parsed = await fetch(`/api/v1/stories/unlike/${storyId}`);
    return parsed.json();
  }
);

const storySlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
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
      .addCase(getStories.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getStories.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.stories = action.payload.data;
        }
      })
      .addCase(getStories.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(getStory.pending, (state) => {
        state.skeletonLoading = true;
      })
      .addCase(getStory.fulfilled, (state, action) => {
        state.skeletonLoading = false;
        if (action.payload?.success) {
          state.story = action.payload.data;
        }
      })
      .addCase(getStory.rejected, (state) => {
        state.skeletonLoading = false;
      });

    builder
      .addCase(deleteStory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.stories = state.stories.filter(
            (story) => story._id !== action.payload.data._id
          );
        }
      })
      .addCase(deleteStory.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(seenStory.pending, (state) => {
        state.loading = true;
      })
      .addCase(seenStory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.stories = state.stories.map((story) => {
            if (story._id === action.payload.data._id) {
              story.seenBy = action.payload.data.seenBy;
            }
            return story;
          });
        }
      })
      .addCase(seenStory.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(likeStory.pending, (state) => {
        state.loading = true;
      })
      .addCase(likeStory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.stories = state.stories.map((story) => {
            if (story._id === action.payload.data._id) {
              story.likes = action.payload.data.likes;
            }
            return story;
          });
          state.story.likes.push(action.payload.data);
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
            if (story._id === action.payload.data._id) {
              story.likes = action.payload.data.likes;
            }
            return story;
          });
          state.story.likes = action.payload.data.likes;
        }
      })
      .addCase(unlikeStory.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default storySlice.reducer;
export const { setLoading } = storySlice.actions;
