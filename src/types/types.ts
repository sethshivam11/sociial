export interface UserInterface {
  fullName: string;
  email: string;
  username: string;
  password: string;
  avatar: string;
  bio: string;
  blocked: FollowUser[];
  followingCount: number;
  followersCount: number;
  postsCount: number;
  isBlueTick: boolean;
  isMailVerified: boolean;
}

export interface followUser {
  username: string;
  fullName: string;
  avatar: string;
}

export interface Follow {
  _id: string;
  followers: followUser[];
  followings: followUser[];
}

export interface FollowUser {
  _id: string;
  avatar: string;
  fullName: string;
  username: string;
}

export interface Profile {
  _id: string;
  fullName: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  postsCount: number;
  isBlueTick: boolean;
}
