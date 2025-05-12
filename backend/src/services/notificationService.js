const Expo = require('expo-server-sdk');
const User = require('../models/User');

const sendPushNotification = async (userId, { title, body, data = {} }) => {
  const user = await User.findById(userId).select('pushTokens');
  if (!user) return;

  const expo = new Expo();
  const messages = [];
  
  user.pushTokens.forEach(token => {
    if (!Expo.isExpoPushToken(token)) {
      console.log(`Token inválido: ${token}`);
      return;
    }

    messages.push({
      to: token,
      sound: 'default',
      title,
      body,
      data
    });
  });

  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  }
};

module.exports = { sendPushNotification };