//frontend/src/services/notificationService.js
import { Alert } from 'react-native';

const showNotification = (title, message) => {
  Alert.alert(title, message);
};

export default showNotification;

