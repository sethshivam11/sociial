export interface BasicUserI {
  _id: string;
  avatar: string;
  fullName: string;
  username: string;
  isPremium: boolean;
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

export interface FollowI {
  _id: string;
  followers: BasicUserI[];
  followings: BasicUserI[];
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
  isError: boolean;
  isLoggedIn: boolean;
  isSendingMail: boolean;
  page: number;
}
