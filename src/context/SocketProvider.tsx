"use client";

import { toast } from "@/components/ui/use-toast";
import { ChatEventEnum } from "@/lib/helpers";
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
  setTyping,
  unreacted,
} from "@/lib/store/features/slices/messageSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { socket } from "@/socket";
import { BasicUserI, ChatI, MessageI } from "@/types/types";
import {
  useState,
  createContext,
  PropsWithChildren,
  useEffect,
  useContext,
} from "react";

const initialState = {
  connected: false,
  transport: "N/A",
};

const SocketContext = createContext(initialState);

export function SocketProvider({ children }: PropsWithChildren<{}>) {
  const [connected, setConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const dispatch = useAppDispatch();
  const { chat } = useAppSelector((state) => state.chat);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      document.cookie = `token=${token}`;
    }
    if (socket.connected) {
      onConnect();
    }
    function onConnect() {
      console.log("connected");
      setConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }
    function onDisconnect() {
      console.log("disconnected");
      setConnected(false);
      setTransport("N/A");
    }
    function typingEventStarted() {
      console.log("typing started");
      setTyping(true);
    }
    function typingEventStopped() {
      console.log("typing stopped");
      setTyping(false);
    }
    function handleMessageReceived(payload: MessageI) {
      if (chat?._id === payload.chat) {
        dispatch(messageReceived(payload));
      } else {
        // TODO: show notification after checking the payload
        // toast({
        //   title: "New Message",
        //   description: `You have a new message from ${payload.sender.username}`,
        // })
      }
    }
    function handleMessageDelete(payload: MessageI) {
      if (chat?._id === payload.chat) {
        dispatch(messageDeleted(payload));
      }
    }
    function handleMessageUpdate(payload: MessageI) {
      // TODO: implement this to update a message
      if (chat?._id === payload.chat) {
        dispatch(messageUpdated(payload));
      }
    }
    function handleReact(payload: {
      user: string;
      content: string;
      chat: string;
    }) {
      if (chat?._id === payload.chat) {
        dispatch(reacted(payload));
      } else {
        // TODO: check the payload and show a notification
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

    // TODO: implement the following handlers
    function handleCall() {}
    function handleCallAccepted() {}
    function handleCallDisconnected() {}
    function handleNegotiate() {}

    socket.on(ChatEventEnum.CONNECTED_EVENT, onConnect);
    socket.on(ChatEventEnum.DISCONNECT_EVENT, onDisconnect);
    socket.on(ChatEventEnum.TYPING_EVENT, typingEventStarted);
    socket.on(ChatEventEnum.STOP_TYPING_EVENT, typingEventStopped);
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
    socket.on(ChatEventEnum.CALL_ACCEPTED_EVENT, handleCallAccepted);
    socket.on(ChatEventEnum.CALL_DISCONNECTED_EVENT, handleCallDisconnected);
    socket.on(ChatEventEnum.NEGOTIATE_EVENT, handleNegotiate);

    return () => {
      socket.off(ChatEventEnum.CONNECTED_EVENT, onConnect);
      socket.off(ChatEventEnum.DISCONNECT_EVENT, onDisconnect);
      socket.off(ChatEventEnum.TYPING_EVENT, typingEventStarted);
      socket.off(ChatEventEnum.STOP_TYPING_EVENT, typingEventStopped);
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
      socket.on(ChatEventEnum.GROUP_DETAILS_UPDATED, handleGroupUpdated);
      socket.on(ChatEventEnum.GROUP_LEAVE_EVENT, handleGroupLeave);
      socket.on(ChatEventEnum.NEW_ADMIN_EVENT, handleNewAdmin);
      socket.on(ChatEventEnum.ADMIN_REMOVE_EVENT, handleAdminRemove);
      socket.on(ChatEventEnum.NEW_CALL_EVENT, handleCall);
      socket.on(ChatEventEnum.CALL_ACCEPTED_EVENT, handleCallAccepted);
      socket.on(ChatEventEnum.CALL_DISCONNECTED_EVENT, handleCallDisconnected);
      socket.on(ChatEventEnum.NEGOTIATE_EVENT, handleNegotiate);
    };
  }, [chat, dispatch]);

  return (
    <SocketContext.Provider value={{ connected, transport }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
