const Chat = require('../models/Chat');

const getResponse = (msg) => {
  // Simulated logic; can integrate AI later
  if (msg.toLowerCase().includes('hello')) return 'Hi there!';
  if (msg.toLowerCase().includes('how are you')) return 'I am a bot, always fine!';
  return 'I did not understand that.';
};

exports.chatHandler = async (req, res) => {
  const { message } = req.body;
  const response = getResponse(message);

  const chat = new Chat({ message, response });
  await chat.save();

  res.json({ message, response });
};

exports.getChats = async (req, res) => {
  const chats = await Chat.find().sort({ timestamp: 1 });
  res.json(chats);
};
