import React, { useRef, useState } from "react";
import { useChatstore } from "../store/useChatstore";
import { Image, Loader, Send, X } from "lucide-react";
import { useAuthstore } from "../store/useAuthstore";

const MessageInput = () => {
  const { authUser, socket } = useAuthstore();

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);
  const { sendMessage, isMessageSending, selectedUser } = useChatstore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const typingTimeoutRef = useRef(null);

  const handleTyping = () => {
    if (!socket || !selectedUser) return;

    socket.emit("typing", {
      senderId: authUser._id,
      receiverId: selectedUser._id,
      isTyping: true,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
        isTyping: false,
      });
    }, 1500);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      socket.emit("typing", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
        isTyping: false,
      });

      setText("");
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (error) {
      console.log("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="size-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message.."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              handleTyping();
            }}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emrald-1000" : "text-zinc-300"
            }`}
            onClick={() => fileRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        {!isMessageSending ? (
          <button
            type="submit"
            className="btn btn-sm btn-circle"
            disabled={(!text.trim() && !imagePreview) || isMessageSending}
          >
            <Send size={20} />
          </button>
        ) : (
          <Loader size={20} className="animate-spin" />
        )}
      </form>
    </div>
  );
};

export default MessageInput;
