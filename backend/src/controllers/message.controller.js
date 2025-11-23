import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { io } from "../lib/socket.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUser } });
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatWith } = req.params;
    const sender_id = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: sender_id, receiverId: userToChatWith },
        { senderId: userToChatWith, receiverId: sender_id },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiver_id } = req.params;

    const sender_id = req.user._id;
    let image_url;
    if (image) {
      const uploaded_response = await cloudinary.uploader.upload(image);
      image_url = uploaded_response.secure_url;
    }
    console.log("IMAGE LENGTH:", image?.length);

    const newMessage = new Message({
      senderId: sender_id,
      receiverId: receiver_id,
      text,
      image: image_url,
    });

    await newMessage.save();

    //realtime functionality to send msg via socket.io
    const receiverSocketId = getReceiverSocketId(receiver_id);
    if (receiverSocketId) {
      //means user is online
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
