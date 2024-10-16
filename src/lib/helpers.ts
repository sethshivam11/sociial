import { getToken } from "firebase/messaging";
import { messaging } from "./store/provider";
import { FirebaseError } from "firebase/app";

export function nameFallback(name: string): string {
  if (!name || name === "") {
    return "";
  }
  const split = name.toUpperCase().split(" ");
  if (split.length >= 2) {
    return `${split[0].slice(0, 1)}${split[1].slice(0, 1)}`;
  } else {
    return `${split[0].slice(0, 1)}${split[0].slice(1, 2)}`;
  }
}

export function getTimeDifference(createdAt: string) {
  const currentTime = new Date();
  const createdTime = new Date(createdAt);

  const differenceInMs = currentTime.getTime() - createdTime.getTime();
  const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60));

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} mins ago`;
  }

  const differenceInHours = Math.floor(differenceInMinutes / 60);
  if (differenceInHours < 24) {
    return `${differenceInHours} hours ago`;
  }

  const differenceInDays = Math.floor(differenceInHours / 24);
  if (differenceInDays < 7) {
    return `${differenceInDays} days ago`;
  }

  const differenceInWeeks = Math.floor(differenceInDays / 7);
  if (differenceInWeeks < 52) {
    return `${differenceInWeeks} weeks ago`;
  }

  const differenceInYears = Math.floor(differenceInWeeks / 52);
  return `${differenceInYears} years ago`;
}

export function isUsernameAvailable(
  username: string,
  setMessage: (message: string) => void,
  setLoading: (isFetching: boolean) => void
) {
  if (!username?.trim()) {
    return;
  }
  setLoading(true);
  fetch(`/api/v1/users/usernameAvailable/${username}`)
    .then((parsed) => parsed.json())
    .then((response) => {
      setMessage(response.message);
    })
    .catch((err) => {
      console.error(err);
      setMessage("Something went wrong");
    })
    .finally(() => setLoading(false));
}

export async function handleConsent(): Promise<{
  token: string | null;
  toast?: {
    title: string;
    description: string;
    variant: "default" | "destructive" | null;
  };
}> {
  try {
    const result = await Notification.requestPermission();
    if (result === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      });
      localStorage.setItem(
        "notificationConsent",
        `{"consent": true,"expiry": null, "token": "${token}"}`
      );
      return {
        token,
      };
    } else {
      localStorage.setItem(
        "notificationConsent",
        `{"consent": false,"expiry": null}`
      );

      return {
        token: null,
        toast: {
          title: "Notification Permission Denied",
          description: "Please allow it in order to recieve notifications.",
          variant: "destructive",
        },
      };
    }
  } catch (err) {
    console.log(err);
    let description = "Please try again later.";
    if (err instanceof FirebaseError) {
      description = err.message;
    }

    localStorage.setItem(
      "notificationConsent",
      `{"consent": false,"expiry": ${Date.now()}}`
    );

    return {
      token: null,
      toast: {
        title: "Something went wrong",
        description,
        variant: null,
      },
    };
  }
}

export function checkForAssets(message: string, kind: string): string {
  switch (kind) {
    case "location":
      return `📍 Location`;
    case "image":
      return `📷 Image`;
    case "video":
      return `🎥 Video`;
    case "audio":
      return `🔊 Audio`;
    case "document":
      return `📄 Document`;
    default:
      return message;
  }
}

export const themes = [
  {
    name: "default",
    color: "bg-stone-800 dark:bg-stone-200",
    text: "white dark:text-black",
  },
  {
    name: "orange",
    color: "bg-orange-500",
    text: "white",
  },
  {
    name: "rose",
    color: "bg-rose-500",
    text: "white",
  },
  {
    name: "emerald",
    color: "bg-emerald-500",
    text: "black",
  },
  {
    name: "sky",
    color: "bg-sky-500",
    text: "black",
  },
  {
    name: "blue",
    color: "bg-blue-500",
    text: "black",
  },
  {
    name: "purple",
    color: "bg-purple-500",
    text: "white",
  },
];

export const ChatEventEnum = Object.freeze({
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  TYPING_EVENT: "typing",
  STOP_TYPING_EVENT: "stopTyping",
  NEW_GROUP_CHAT_EVENT: "newGroup",
  NEW_CHAT_EVENT: "newChat",
  SOCKET_ERROR_EVENT: "socketError",
  MESSAGE_RECIEVED_EVENT: "messageRecieved",
  MESSAGE_DELETE_EVENT: "messageDeleted",
  GROUP_DELETE_EVENT: "deleteGroup",
  NEW_REACT_EVENT: "someoneReacted",
  NEW_UNREACT_EVENT: "someoneUnreacted",
  NEW_EDIT_EVENT: "someoneEditedHisMessage",
  NEW_PARTICIPANT_ADDED_EVENT: "newParticipantAdded",
  PARTICIPANT_REMOVED_EVENT: "participantRemoved",
  GROUP_DETAILS_UPDATED: "groupDetailsUpdated",
  GROUP_LEAVE_EVENT: "someoneLeftGroup",
  NEW_ADMIN_EVENT: "someoneBecameAdmin",
  ADMIN_REMOVE_EVENT: "someoneRemovedFromAdmin",
  NEW_CALL_EVENT: "newCall",
  CALL_ACCEPTED_EVENT: "callAccepted",
  CALL_DISCONNECTED_EVENT: "callDisconnected",
  NEGOTIATE_EVENT: "negotiateCall",
});
