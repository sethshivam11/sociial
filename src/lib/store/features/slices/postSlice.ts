import { PostI } from "@/types/types";
import { asyncThunkCreator, createAsyncThunk } from "@reduxjs/toolkit";

const createFeed = createAsyncThunk("posts/createFeed", async () => {
  const parsed = await fetch("/api/v1/posts/createFeed");
  return parsed.json();
});

const fetchMoreFeed = createAsyncThunk(
  "posts/fetchMoreFeed",
  async (page: number) => {
    const parsed = await fetch(`/api/v1/posts/createFeed?page=${page}`);
    return parsed.json();
  }
);

const exploreFeed = createAsyncThunk(
  "posts/exploreFeed",
  async (page: number) => {
    const parsed = await fetch(`/api/v1/posts/exploreFeed?page=${page}`);
    return parsed.json();
  }
);

const getPost = createAsyncThunk("posts/getPost", async (postId: string) => {
  const parsed = await fetch(`/api/v1/posts/${postId}`);
  return parsed.json();
});

const createPost = createAsyncThunk(
  "posts/createPost",
  async ({
    caption,
    media,
    kind,
    user,
  }: {
    caption: string;
    media: Blob[];
    kind: "image" | "video";
    user: string;
  }) => {
    const formData = new FormData();
    formData.append("caption", caption);
    media.forEach((file) => {
      formData.append("media", file);
    });
    formData.append("kind", kind);
    formData.append("user", user);
    const parsed = await fetch("/api/v1/posts", {
      method: "POST",
      body: formData,
    });
    return parsed.json();
  }
);

const deletePost = createAsyncThunk("posts/delete", async (postId: string) => {
  const parsed = await fetch(`/api/v1/posts/delete/${postId}`, {
    method: "DELETE",
  });
  return parsed.json();
});

const likePost = createAsyncThunk("posts/like", async (postId: string) => {
  const parsed = await fetch(`/api/v1/posts/like/${postId}`);
  return parsed.json();
});

const dislikePost = createAsyncThunk("posts/like", async (postId: string) => {
  const parsed = await fetch(`/api/v1/posts/dislike/${postId}`);
  return parsed.json();
});

const getUserPosts = createAsyncThunk(
  "posts/getUserPosts",
  async (userId: string) => {
    const parsed = await fetch(`/api/v1/posts/user/${userId}`);
    return parsed.json();
  }
);

const getMoreUserPosts = createAsyncThunk(
  "posts/getMoreUserPosts",
  async ({ userId, page }: { userId: string; page: number }) => {
    const parsed = await fetch(`/api/v1/posts/user/${userId}?page=${page}`);
    return parsed.json();
  }
);
