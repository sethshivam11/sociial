"use client";

import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { ChatEventEnum, checkForAssets } from "@/lib/helpers";
import { endCall, setCall } from "@/lib/store/features/slices/callSlice";
import {
  addedToGroup,
  groupDeleted,
  groupDetailsUpdated,
  leftGroup,
  newAdmin,
  newChatStarted,
  newGroup,
  removedAdmin,
  removedFromGroup,
} from "@/lib/store/features/slices/chatSlice";
import {
  messageDeleted,
  messageReceived,
  messageUpdated,
  reacted,
  unreacted,
} from "@/lib/store/features/slices/messageSlice";
import { getProfile } from "@/lib/store/features/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { socket } from "@/socket";
import { BasicUserI, CallI, ChatI, Confession, MessageI } from "@/types/types";
import { Phone, Video } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  useState,
  createContext,
  PropsWithChildren,
  useEffect,
  useContext,
} from "react";

interface SocketContextI {
  connected: boolean;
  onlineUsers: string[];
}

const initialState: SocketContextI = {
  connected: false,
  onlineUsers: [],
};

const SocketContext = createContext(initialState);

export function SocketProvider({ children }: PropsWithChildren<{}>) {
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const dispatch = useAppDispatch();
  const location = usePathname();
  const router = useRouter();
  const { chat } = useAppSelector((state) => state.chat);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }
    function onConnect() {
      setConnected(true);
    }
    function onDisconnect() {
      setConnected(false);
    }
    function handleOnlineUsers(payload: string[]) {
      setOnlineUsers(payload);
    }
    function handleMessageReceived(payload: MessageI) {
      if (chat?._id === payload.chat) {
        dispatch(messageReceived(payload));
      } else {
        toast({
          title: "New Message",
          description: `You have a new message from ${payload.sender.username}`,
          action: (
            <ToastAction
              altText="View"
              onClick={() => router.push(`/messages/${payload.chat}`)}
            >
              View
            </ToastAction>
          ),
        });
      }
    }
    function handleMessageDelete(payload: MessageI) {
      if (chat?._id === payload.chat) {
        dispatch(messageDeleted(payload));
      }
    }
    function handleMessageUpdate(payload: {
      message: MessageI;
      user: BasicUserI;
    }) {
      if (chat?._id === payload.message.chat) {
        dispatch(messageUpdated(payload));
      }
    }
    function handleReact(payload: {
      user: BasicUserI;
      content: string;
      chat: string;
      message: {
        content: string;
        kind: string;
      };
    }) {
      if (chat?._id === payload.chat) {
        dispatch(reacted(payload));
      } else {
        toast({
          title: "Reaction on your message",
          description: `${payload.user?.username} reacted ${
            payload.content
          } to ${
            payload?.message.kind === "message"
              ? payload.message.content
              : checkForAssets(payload.message.content, payload.message.kind)
          }`,
          action: (
            <ToastAction
              altText="View"
              onClick={() => router.push(`/messages/${payload.chat}`)}
            >
              View
            </ToastAction>
          ),
        });
      }
    }
    function handleUnreact(payload: { user: string; chat: string }) {
      if (chat?._id === payload.chat) {
        dispatch(unreacted(payload));
      }
    }
    function handleError(error: any) {
      console.log(error);
    }
    function handleNewChat(payload: { chat: ChatI; user: BasicUserI }) {
      dispatch(newChatStarted(payload));
    }
    function handleNewGroup(payload: { chat: ChatI; user: BasicUserI }) {
      dispatch(newGroup(payload));
      toast({
        title: "New Group",
        description: `${payload.user.username} added you to a group`,
        action: (
          <ToastAction
            altText="View"
            onClick={() => router.push(`/messages/${payload.chat}`)}
          >
            View
          </ToastAction>
        ),
      });
    }
    function handleGroupDelete(payload: { chat: ChatI; user: BasicUserI }) {
      dispatch(groupDeleted(payload));
      toast({
        title: "Group Deleted",
        description: `${payload.user.username} deleted the group`,
      });
    }
    function handleNewParticipants(payload: {
      chat: ChatI;
      user: BasicUserI;
      participants: BasicUserI[];
    }) {
      dispatch(addedToGroup(payload));
      toast({
        title: "New Participants",
        description: `${payload.user.username} added ${payload.participants
          .map((p, index) => (index < 3 ? p.username : ""))
          .join(", ")} to the group`,
      });
    }
    function handleRemovedParticipant(payload: {
      participants: BasicUserI[];
      chat: ChatI;
      user: BasicUserI;
    }) {
      dispatch(removedFromGroup(payload));
      toast({
        title: "Participants Removed",
        description: `${payload.user.username} removed ${payload.participants
          .map((p, index) => (index < 3 ? p.username : ""))
          .join(", ")} from the group`,
      });
    }
    function handleGroupUpdated(payload: { chat: ChatI; user: BasicUserI }) {
      dispatch(groupDetailsUpdated(payload));
    }
    function handleGroupLeave(payload: { chat: ChatI; user: BasicUserI }) {
      dispatch(leftGroup(payload));
      if (chat._id === payload.chat._id) {
        toast({
          title: `${payload.user.username} left the group`,
        });
      }
    }
    function handleNewAdmin(payload: {
      newAdmins: BasicUserI[];
      chat: ChatI;
      user: BasicUserI;
    }) {
      dispatch(newAdmin(payload));
      if (chat._id === payload.chat._id) {
        toast({
          title: `${payload.newAdmins
            .map((a) => a.username)
            .join(", ")} are now admins`,
        });
      }
    }
    function handleAdminRemove(payload: {
      removedAdmins: BasicUserI[];
      chat: ChatI;
      user: BasicUserI;
    }) {
      dispatch(removedAdmin(payload));
      if (chat._id === payload.chat._id) {
        toast({
          title: `${payload.removedAdmins
            .map((a) => a.username)
            .join(", ")} are no longer admins`,
        });
      }
    }
    function rejectCall(callId: string) {
      dispatch(endCall(callId)).then((response) => {
        if (!response.payload?.success) {
          toast({
            title: "Failed to reject call",
            description: response.payload?.message || "Something went wrong!",
            variant: "destructive",
          });
        } else {
          if (location.includes("/call")) {
            router.push("/call/ended");
          }
        }
      });
    }
    function handleCall(payload: CallI) {
      if ("vibrate" in navigator) {
        navigator.vibrate([200, 50, 200, 50, 200, 50, 200]);
      }
      dispatch(setCall(payload));
      toast({
        title: `${payload.caller.fullName} is calling...`,
        description: "Swipe right to silent",
        action: (
          <div className="flex gap-2 items-center justify-center">
            <ToastAction
              altText="Answer"
              className="bg-primary hover:bg-primary/80 text-white dark:text-black"
              onClick={() => {
                dispatch(getProfile({ username: payload.caller.username }));
                navigator.mediaDevices
                  .getUserMedia({
                    video: payload.type === "video",
                    audio: true,
                  })
                  .then((stream) => {
                    stream.getTracks().forEach((track) => {
                      track.stop();
                    });
                    router.push(
                      `/call/${payload.caller.username}?video=${
                        payload.type === "video"
                      }&call=${payload._id}&profile=${payload.caller._id}`
                    );
                  })
                  .catch((err) => {
                    console.log(err);
                    router.push("/call/allow");
                  });
              }}
            >
              {payload.type === "video" ? <Video /> : <Phone />}
            </ToastAction>
            <ToastAction
              altText="Decline"
              onClick={() => rejectCall(payload._id)}
            >
              <Phone className="rotate-[135deg]" />
            </ToastAction>
          </div>
        ),
        duration: 30000,
      });
    }
    function handleConfession(payload: Confession) {
      toast({
        title: "New Confession",
        description: payload.content,
        action: (
          <ToastAction
            altText="View"
            onClick={() => router.push("/confessions")}
          >
            View
          </ToastAction>
        ),
      });
    }

    socket.on(ChatEventEnum.GET_USERS, handleOnlineUsers);
    socket.on(ChatEventEnum.CONNECTED_EVENT, onConnect);
    socket.on(ChatEventEnum.DISCONNECT_EVENT, onDisconnect);
    socket.on(ChatEventEnum.NEW_GROUP_CHAT_EVENT, handleNewGroup);
    socket.on(ChatEventEnum.NEW_CHAT_EVENT, handleNewChat);
    socket.on(ChatEventEnum.SOCKET_ERROR_EVENT, handleError);
    socket.on(ChatEventEnum.MESSAGE_RECIEVED_EVENT, handleMessageReceived);
    socket.on(ChatEventEnum.MESSAGE_DELETE_EVENT, handleMessageDelete);
    socket.on(ChatEventEnum.GROUP_DELETE_EVENT, handleGroupDelete);
    socket.on(ChatEventEnum.NEW_REACT_EVENT, handleReact);
    socket.on(ChatEventEnum.NEW_UNREACT_EVENT, handleUnreact);
    socket.on(ChatEventEnum.NEW_EDIT_EVENT, handleMessageUpdate);
    socket.on(ChatEventEnum.NEW_PARTICIPANT_ADDED_EVENT, handleNewParticipants);
    socket.on(
      ChatEventEnum.PARTICIPANT_REMOVED_EVENT,
      handleRemovedParticipant
    );
    socket.on(ChatEventEnum.GROUP_DETAILS_UPDATED, handleGroupUpdated);
    socket.on(ChatEventEnum.GROUP_LEAVE_EVENT, handleGroupLeave);
    socket.on(ChatEventEnum.NEW_ADMIN_EVENT, handleNewAdmin);
    socket.on(ChatEventEnum.ADMIN_REMOVE_EVENT, handleAdminRemove);
    socket.on(ChatEventEnum.NEW_CALL_EVENT, handleCall);
    socket.on(ChatEventEnum.CONFESSION_RECIEVED_EVENT, handleConfession);

    return () => {
      socket.off(ChatEventEnum.CONNECTED_EVENT, onConnect);
      socket.off(ChatEventEnum.DISCONNECT_EVENT, onDisconnect);
      socket.off(ChatEventEnum.NEW_GROUP_CHAT_EVENT, handleNewGroup);
      socket.off(ChatEventEnum.NEW_CHAT_EVENT, handleNewChat);
      socket.off(ChatEventEnum.SOCKET_ERROR_EVENT, handleError);
      socket.off(ChatEventEnum.MESSAGE_RECIEVED_EVENT, handleMessageReceived);
      socket.off(ChatEventEnum.MESSAGE_DELETE_EVENT, handleMessageDelete);
      socket.off(ChatEventEnum.GROUP_DELETE_EVENT, handleMessageDelete);
      socket.off(ChatEventEnum.NEW_REACT_EVENT, handleReact);
      socket.off(ChatEventEnum.NEW_UNREACT_EVENT, handleUnreact);
      socket.off(ChatEventEnum.NEW_EDIT_EVENT, handleMessageUpdate);
      socket.off(
        ChatEventEnum.NEW_PARTICIPANT_ADDED_EVENT,
        handleNewParticipants
      );
      socket.off(
        ChatEventEnum.PARTICIPANT_REMOVED_EVENT,
        handleRemovedParticipant
      );
      socket.off(ChatEventEnum.GROUP_DETAILS_UPDATED, handleGroupUpdated);
      socket.off(ChatEventEnum.GROUP_LEAVE_EVENT, handleGroupLeave);
      socket.off(ChatEventEnum.NEW_ADMIN_EVENT, handleNewAdmin);
      socket.off(ChatEventEnum.ADMIN_REMOVE_EVENT, handleAdminRemove);
      socket.off(ChatEventEnum.NEW_CALL_EVENT, handleCall);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat, dispatch, socket]);

  return (
    <SocketContext.Provider
      value={{
        connected,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
