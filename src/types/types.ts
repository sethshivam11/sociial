export interface BasicUserI {
  _id: string;
  avatar: string;
  fullName: string;
  username: string;
}

export interface UserI {
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
  blocked: BasicUserI[];
}

export interface ProfileI {
  _id: string;
  fullName: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  postsCount: number;
  isPremium: boolean;
}

export interface PostI {
  _id: string;
  user: string;
  caption: string;
  images: string[];
  kind: "image" | "video";
  likesCount: number;
  commentsCount: number;
}

export interface ChatI {
  _id: string;
  admin: [];
  users: BasicUserI[];
  groupName: string;
  groupIcon: string;
  isGroupChat: boolean;
}

export interface CommentI {
  _id: string;
  user: BasicUserI;
  comment: string;
  post: string;
  likes: BasicUserI[];
  likesCount: number;
}

export interface StoryI {
  _id: string;
  user: {
    _id: string;
    avatar: string;
    fullName: string;
    username: string;
  };
  media: string[];
  seenBy: string[];
  likes: string[];
  blockedTo: string[];
}

export interface NotificationI {
  _id: string;
  user: BasicUserI;
  title: string;
  description: string;
  link: string;
  read: boolean;
}

export interface PushNotificationI {
  likes: boolean;
  comments: boolean;
  commentLikes: boolean;
  storyLikes: boolean;
  newFollowers: boolean;
  newMessages: boolean;
  newGroups: boolean;
}

export interface EmailNotificationI {
  newProducts: boolean;
  announcements: boolean;
  support: boolean;
}

export interface MessageI {
  _id: string;
  sender: BasicUserI;
  chat: string;
  content: string;
  kind?: "message" | "location" | "call" | "media" | "audio" | "document";
  attachments: {
    url: string;
    type: "image" | "video" | "audio" | "document";
  }[];
  reacts: {
    _id: string;
    content: string;
    user: BasicUserI;
  }[];
  readBy: BasicUserI[];
  reply: {
    username: string;
    content: string;
  };
  createdAt: string;
  updatedAt: string;
}

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
  profile: ProfileI;
  followers: BasicUserI[];
  following: BasicUserI[];
  unreadMessageCount: number;
  newNotifications: boolean;
  loading: boolean;
  isLoggedIn: boolean;
  isSendingMail: boolean;
  page: number;
}

export interface FollowSliceI {
  _id: string;
  followers: BasicUserI[];
  followings: BasicUserI[];
  maxFollowers: number;
  maxFollowings: number;
  loading: boolean;
  loadingMore: boolean;
  page: number;
}

export interface PostSliceI {
  posts: PostI[];
  post: PostI;
  loading: boolean;
  skeletonLoading: boolean;
  loadingMore: boolean;
  maxPosts: number;
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
  loadingMore: boolean;
  page: number;
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
