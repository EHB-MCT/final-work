import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export const usePushNotifications = () => {
  useEffect(() => {
    const register = async () => {
      if (!Device.isDevice) return;

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Geen toestemming voor notificaties');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo push token:', token);
      // TODO: Stuur token naar je backend/Firebase als nodig
    };

    register();

    const sub = Notifications.addNotificationReceivedListener(notification => {
      console.log('📬 Notificatie ontvangen:', notification);
    });

    return () => sub.remove();
  }, []);
};
