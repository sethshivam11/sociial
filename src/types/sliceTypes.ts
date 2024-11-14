import {
  AnonymousMessage,
  BasicUserI,
  CallI,
  ChatI,
  CommentI,
  EmailNotificationI,
  MessageI,
  NotificationI,
  PostI,
  ProfileI,
  PushNotificationI,
  ReactI,
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
    savedPosts: string[];
  };
  searchResults: BasicUserI[];
  blocked: BasicUserI[];
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
}

export interface FollowSliceI {
  _id: string;
  followers: (BasicUserI & { loading: boolean })[];
  follow: {
    _id: string;
    followers: string[];
    followings: string[];
  };
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
    thumbnail?: string;
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
}

export interface NotificationPreferenceSliceI {
  loading: boolean;
  skeletonLoading: boolean;
  pushNotifications: PushNotificationI;
  emailNotifications: EmailNotificationI;
}

export interface CommentSliceI {
  comments: CommentI[];
  comment: CommentI;
  loading: boolean;
  likes: BasicUserI[];
  skeletonLoading: boolean;
  loadingMore: boolean;
}

export interface NotificationSliceI {
  notifications: NotificationI[];
  loading: boolean;
  skeletonLoading: boolean;
}

export interface StorySliceI {
  stories: StoryI[];
  userStory?: {
    _id: string;
    user: {
      _id: string;
      avatar: string;
      fullName: string;
      username: string;
    };
    media: string[];
    selfSeen: boolean;
    seenBy: BasicUserI[];
    likes: BasicUserI[];
    blockedTo: string[];
    createdAt: string;
  };
  loading: boolean;
  skeletonLoading: boolean;
}

export interface MessageSliceI {
  messages: MessageI[];
  loading: boolean;
  skeletonLoading: boolean;
  reactions: ReactI[];
  editingMessage: boolean;
}

export interface LikeSliceI {
  loading: boolean;
  likes: BasicUserI[];
}

export interface CallSliceI {
  skeletonLoading: boolean;
  loading: boolean;
  startingCall: boolean;
  endingCall: boolean;
  calls: CallI[];
  call: CallI;
}

export interface AnonymousMessageSliceI {
  messages: AnonymousMessage[];
  loading: boolean;
  skeletonLoading: boolean;
}