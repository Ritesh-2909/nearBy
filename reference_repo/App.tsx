/* eslint-disable unicorn/filename-case */
import notifee, {
  AndroidImportance,
  AndroidStyle,
  EventType,
  InitialNotification,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { Appearance, PermissionsAndroid, Platform } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import AppInitializer from './src/components/main/app-initializer';
import RootNavigator from './src/components/main/root-initializer';
import { PaymentProvider } from './src/components/payment/payment-context';
import SafeAreaWrapper from './src/components/SafeAreaWrapper';
import { ToastProvider } from './src/components/toast';
import {
  PUSH_NOTIFICATION_STORED,
  PUSH_NOTIFICATION_TOKEN,
} from './src/constants/index';
import AuthProvider from './src/providers/auth-provider';
import {
  isNavigationReady,
  navigationRef,
  setNavigationReady,
} from './src/utils/navigation-ref';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  const isMounted = useRef(true);
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme() || 'light');

  const navigateFromNotificationData = (
    screen: string | unknown,
    params: string | unknown | object,
  ) => {
    if (typeof screen !== 'string' || !screen) {
      return;
    }

    if (isNavigationReady() && navigationRef.isReady()) {
      try {
        const parsedParams =
          typeof params === 'string'
            ? JSON.parse(params || '{}')
            : params || {};
        (navigationRef as any).navigate(screen, parsedParams);
      } catch (error) {
        (navigationRef as any).navigate(screen);
      }
    }
  };

  const handleStoredNotification = async (): Promise<boolean> => {
    const savedData = await AsyncStorage.getItem(PUSH_NOTIFICATION_STORED);
    await AsyncStorage.removeItem(PUSH_NOTIFICATION_STORED);

    if (!savedData) {
      return false;
    }
    try {
      const { screen, params } = JSON.parse(savedData);
      navigateFromNotificationData(screen, params);
      return true;
    } catch (error) {
      AsyncStorage.removeItem(PUSH_NOTIFICATION_STORED);
      return false;
    }
  };

  useEffect(() => {
    isMounted.current = true;
    let unsubscribeForeground: (() => void) | undefined;
    let unsubscribeForegroundEvent: (() => void) | undefined;

    // Listen for theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      setColorScheme(newColorScheme || 'light');
    });

    const setupNotifications = async () => {
      try {
        if (Platform.OS === 'android') {
          await notifee.createChannel({
            id: 'default-high',
            name: 'High Priority Channel',
            importance: AndroidImportance.HIGH,
          });

          if (Platform.Version >= 33) {
            const permission = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            );

            if (permission !== 'granted') {
              return;
            }
          }
        }

        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const token = await messaging().getToken();
          await AsyncStorage.setItem(PUSH_NOTIFICATION_TOKEN, token);
          try {
            await messaging().subscribeToTopic('global');
          } catch (error) {
            // Handle subscription error silently
          }
        }
      } catch (error) {
        // Handle permission error silently
      }
      const initialNotification: InitialNotification | null =
        await notifee.getInitialNotification();

      if (initialNotification && isMounted.current) {
        const { notification } = initialNotification;
        if (notification.data?.screen) {
          try {
            await AsyncStorage.setItem(
              PUSH_NOTIFICATION_STORED,
              JSON.stringify({
                screen: notification.data.screen,
                params: notification.data.params,
              }),
            );
          } catch (error) {
            // Handle storage error silently
          }
        }
      }

      unsubscribeForeground = messaging().onMessage(async remoteMessage => {
        if (!isMounted.current) {
          return;
        }

        if (!remoteMessage.data) {
          return;
        }

        //FCM Foreground call
        const {
          title,
          body,
          image,
          screen,
          params: paramsString,
        } = remoteMessage.data || {};

        let androidStyle;
        const hasImage =
          typeof image === 'string' &&
          image.trim() !== '' &&
          image !== 'undefined';
        const hasLongBody =
          typeof body === 'string' && body.trim().length > 100; // Show BIGTEXT if body is long

        if (hasImage) {
          androidStyle = { type: AndroidStyle.BIGPICTURE, picture: image };
        } else if (hasLongBody) {
          androidStyle = { type: AndroidStyle.BIGTEXT, text: body };
        } else {
          androidStyle = undefined;
        }

        try {
          await notifee.displayNotification({
            title: typeof title === 'string' ? title : 'New Message',
            body: typeof body === 'string' ? body : '',
            android: {
              channelId: 'default-high',
              importance: AndroidImportance.HIGH,
              pressAction: { id: 'default' },
              style: androidStyle as any,
              smallIcon: 'ic_notification', // Use proper notification icon
              largeIcon: 'ic_launcher', // Use app icon for large notification
            },
            data: {
              screen,
              params: paramsString,
            },
          });
        } catch (displayError) {
          // Handle notification display error silently
        }
      });

      unsubscribeForegroundEvent = notifee.onForegroundEvent(
        ({ type, detail }) => {
          if (!isMounted.current) {
            return;
          }
          if (type === EventType.PRESS && detail.notification?.data) {
            const { screen, params } = detail.notification.data;
            navigateFromNotificationData(screen, params);
          }
        },
      );
    };

    setupNotifications();

    return () => {
      isMounted.current = false;
      if (unsubscribeForeground) {
        unsubscribeForeground();
      }
      if (unsubscribeForegroundEvent) {
        try {
          unsubscribeForegroundEvent();
        } catch { }
      }
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Dynamic theme based on color scheme
  const navigationTheme = {
    dark: colorScheme === 'dark',
    colors: {
      primary: '#FF7A00',
      background: colorScheme === 'dark' ? '#0D0D0D' : '#FDFDFD',
      card: colorScheme === 'dark' ? '#1A1A1A' : '#F7F7F7',
      text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
      border: colorScheme === 'dark' ? '#333333' : '#E0E0E0',
      notification: '#FF7A00',
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: 'normal' as const,
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500' as const,
      },
      bold: {
        fontFamily: 'System',
        fontWeight: 'bold' as const,
      },
      heavy: {
        fontFamily: 'System',
        fontWeight: '900' as const,
      },
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PaymentProvider>
        <PaperProvider>
          <AuthProvider>
            <ToastProvider>
              <SafeAreaWrapper>
                <NavigationContainer
                  ref={navigationRef}
                  theme={navigationTheme}
                  onReady={async () => {
                    if (!isMounted.current) {
                      return;
                    }
                    setNavigationReady(true);
                    await handleStoredNotification();
                  }}>
                  <AppInitializer>
                    <RootNavigator />
                  </AppInitializer>
                </NavigationContainer>
              </SafeAreaWrapper>
            </ToastProvider>
          </AuthProvider>
        </PaperProvider>
      </PaymentProvider>
    </QueryClientProvider>
  );
}


export default App;
