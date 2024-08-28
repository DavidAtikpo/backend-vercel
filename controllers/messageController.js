import { io } from '../index.js';  // Adjust path accordingly
import Message from "../models/messageModel.js";

const saveMessage = async (req, res) => {
    try {
        const message = await MessageModel.create(req.body);
        io.emit('newMessage', message);  // Emit event to all clients
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save message' });
    }
};


// Create a new message
export const createMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    // Create a new message document
    const newMessage = new Message({
      senderId,
      receiverId,
      content,
      timestamp: new Date()
    });

    // Save the message to the database
    const savedMessage = await newMessage.save();

    res.status(201).json({
      message: "Message sent successfully",
      data: savedMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send the message",
      error: error.message,
    });
  }
};

// Get all messages between two users (e.g., in a chat)
export const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json({
      message: "Messages retrieved successfully",
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve messages",
      error: error.message,
    });
  }
};

// Get a specific message by ID
export const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.status(200).json({
      message: "Message retrieved successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve the message",
      error: error.message,
    });
  }
};

// Update a message (e.g., editing the content)
export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.status(200).json({
      message: "Message updated successfully",
      data: updatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update the message",
      error: error.message,
    });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.status(200).json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete the message",
      error: error.message,
    });
  }
};

export default {saveMessage,createMessage,getMessagesBetweenUsers,getMessageById,updateMessage,deleteMessage}