import { User } from "../models/auth.model.js";
import { Message } from "../models/message.model.js";
import cloudinary from '../config/cloudinaryConfig.js'
import { getReceiverSocketId, io } from "../config/socket.js";

export async function getUserForSidebar(req, res) {
  try {
    const users = await User.find({ _id: { $ne: req.currUser._id } }).select(
      "-password"
    );
    return res
      .status(200)
      .json({ message: "Users fetched successfully", users });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error while fetching users", error: error.message });
  }
}

export const getMessages = async (req, res) => {
  try {
    const { id: userInChat } = req.params;
    const myId = req.currUser._id;

    const messages = await Message.find({
      $or: [
        // get messages where I am the sender and the user in chat is the receiver
        // or where the user in chat is the sender and I am the receiver
        { senderId: myId, receiverId: userInChat },
        { senderId: userInChat, receiverId: myId },
      ],
    });
    return res.status(200).json({ messages });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error while fetching messages", error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.currUser._id;
    // console.log("sender I'd is: ", req.user._id);

    let imageUrl;
    if (image) {
      const uploadImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadImage.secure_url;
    }
    const message = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }
    return res.status(200).json({ message });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error while sending message", error: error.message });
  }
};
