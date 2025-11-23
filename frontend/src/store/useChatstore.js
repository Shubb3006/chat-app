import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthstore } from "./useAuthstore";

export const useChatstore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  isTyping: false,

  isMessageSending: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userID) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userID}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { messages, selectedUser } = get();
    set({ isMessageSending: true });
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageSending: false });
    }
  },

  subscribeToMessages: async () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthstore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, newMessage] });
    });

    socket.on("typing", ({ senderId, isTyping }) => {
      if (senderId === selectedUser._id) {
        set({ isTyping });
      }
    });
  },

  unsubscribefromMessages: async () => {
    const socket = useAuthstore.getState().socket;
    socket.off("newMessage");
    socket.off("typing"); 
  },

  setIsTyping: (state) => {
    set({ isTyping: state });
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
