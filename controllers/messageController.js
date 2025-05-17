// import { io } from '../index.js';  // Adjust path accordingly
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
    const { receiver_id, content } = req.body;
    const senderId = req.user._id; // Récupérer l'ID de l'utilisateur connecté

    if (!receiver_id || !content) {
      return res.status(400).json({
        message: "Receiver ID and content are required",
      });
    }

    // Create a new message document
    const newMessage = new Message({
      senderId,
      receiverId: receiver_id,
      content,
      timestamp: new Date()
    });

    // Save the message to the database
    const savedMessage = await newMessage.save();

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({
      message: "Failed to send the message",
      error: error.message,
    });
  }
};

// Get all messages between two users
export const getMessagesBetweenUsers = async (req, res) => {
  try {
    const receiverId = req.params.receiverId;
    const senderId = req.user._id; // Récupérer l'ID de l'utilisateur connecté

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
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

    res.status(200).json(message);
  } catch (error) {
    console.error('Error getting message:', error);
    res.status(500).json({
      message: "Failed to retrieve the message",
      error: error.message,
    });
  }
};

// Update a message
export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id; // Récupérer l'ID de l'utilisateur connecté

    // Vérifier si l'utilisateur est le propriétaire du message
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this message",
      });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
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
    const userId = req.user._id; // Récupérer l'ID de l'utilisateur connecté

    // Vérifier si l'utilisateur est le propriétaire du message
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this message",
      });
    }

    await Message.findByIdAndDelete(id);

    res.status(200).json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      message: "Failed to delete the message",
      error: error.message,
    });
  }
};

export default {
  createMessage,
  getMessagesBetweenUsers,
  getMessageById,
  updateMessage,
  deleteMessage
}