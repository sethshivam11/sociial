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
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export interface PostI {
  _id: string;
  user: BasicUserI;
  caption: string;
  media: string[];
  thumbnail?: string;
  kind: "image" | "video";
  likes: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatI {
  _id: string;
  admin: string[];
  users: BasicUserI[];
  groupName: string;
  groupIcon: string;
  isGroupChat: boolean;
  lastMessage: null | {
    _id: string;
    content: string;
    kind: "message" | "location" | "call" | "media" | "audio" | "document";
    createdAt: string;
  };
  createdAt: string;
}

export interface CommentI {
  _id: string;
  user: BasicUserI;
  content: string;
  post: string;
  likes: string[];
  likesCount: number;
  createdAt: string;
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
  createdAt: string;
  updatedAt: string;
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
    user: string;
  }[];
  readBy: BasicUserI[];
  reply: {
    username: string;
    content: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReactI {
  _id: string;
  user: BasicUserI;
  content: string;
}

