export interface FollowUser {
  _id: string;
  avatar: string;
  fullName: string;
  username: string;
  isPremium: boolean;
}

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
  isPremium: boolean;
  isMailVerified: boolean;
}

export interface Follow {
  _id: string;
  followers: FollowUser[];
  followings: FollowUser[];
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
  isPremium: boolean;
}

export interface UserContext {
  user: UserInterface;
  loading: boolean;
  storage: {
    accessToken: string;
    refreshToken: string;
  };
  setLoading: Function;
  followers: FollowUser[];
  following: FollowUser[];
  unreadMessageCount: number;
  setUnreadMessageCount: Function;
  newNotifications: boolean;
  setNewNotifications: Function;
  setFollowers: Function;
  setFollowing: Function;
  getProfile: Function;
  profile: Profile;
  setProfile: Function;
  fetchUser: Function;
  registerUser: Function;
  loginUser: Function;
  logoutUser: Function;
  verifyMail: Function;
  updatePassword: Function;
  updateAvatar: Function;
  removeAvatar: Function;
  updateDetails: Function;
  updateBlueTick: Function;
  blockUser: Function;
  unblockUser: Function;
  renewAccessToken: Function;
  isSendingMail: boolean;
  setIsSendingMail: Function;
  isOffline: boolean;
  setIsOffline: Function;
  resendVerificationCode: Function;
  isLoggedIn: boolean;
  setIsLoggedIn: Function;
  follow: Function;
  unfollow: Function;
  getFollowers: Function;
  getFollowing: Function;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
}
