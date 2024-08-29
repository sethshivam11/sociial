import {
  BasicUserI,
  ChatI,
  CommentI,
  EmailNotificationI,
  MessageI,
  NotificationI,
  PostI,
  ProfileI,
  PushNotificationI,
  StoryI,
} from "./types";

export interface UserSliceI {
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
  searchResults: BasicUserI[];
  savedPosts: PostI[];
  suggestions: (BasicUserI & { loading: boolean; isFollowing: boolean })[];
  profile: ProfileI;
  followers: BasicUserI[];
  following: BasicUserI[];
  unreadMessageCount: number;
  newNotifications: boolean;
  loading: boolean;
  skeletonLoading: boolean;
  isLoggedIn: boolean;
  isSendingMail: boolean;
  page: number;
}

export interface FollowSliceI {
  _id: string;
  followers: (BasicUserI & { loading: boolean })[];
  followings: (BasicUserI & { loading: boolean })[];
  skeletonLoading: boolean;
  loading: boolean;
}

export interface PostSliceI {
  posts: PostI[];
  explorePosts: PostI[];
  post: {
    _id: string;
    user: ProfileI;
    caption: string;
    media: string[];
    kind: "image" | "video";
    likes: string[];
    likesCount: number;
    commentsCount: number;
    morePosts: PostI[];
    createdAt: string;
    updatedAt: string;
  };
  likes: BasicUserI[];
  loading: boolean;
  skeletonLoading: boolean;
  loadingMore: boolean;
  maxPosts: number;
  maxExplorePosts: number;
  page: number;
}

export interface ChatSliceI {
  chats: ChatI[];
  chat: ChatI;
  skeletonLoading: boolean;
  loadingMore: boolean;
  loading: boolean;
  page: number;
}

export interface PushNotificationSliceI {
  token: string;
  loading: boolean;
  pushNotifications: PushNotificationI;
  emailNotifications: EmailNotificationI;
}

export interface CommentSliceI {
  comments: CommentI[];
  comment: CommentI;
  loading: boolean;
  skeletonLoading: boolean;
  loadingMore: boolean;
  page: number;
}

export interface NotificationSliceI {
  notifications: NotificationI[];
  loading: boolean;
  skeletonLoading: boolean;
}

export interface StorySliceI {
  stories: StoryI[];
  story: StoryI;
  userStory?: StoryI;
  loading: boolean;
  skeletonLoading: boolean;
}

export interface MessageSliceI {
  messages: MessageI[];
  typing: boolean;
  loading: boolean;
  skeletonLoading: boolean;
  loadingMore: boolean;
  page: number;
  editingMessage: boolean;
}

export interface LikeSliceI {
  loading: boolean;
  likes: BasicUserI[];
}