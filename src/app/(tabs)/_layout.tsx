import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';

const TAB_ACTIVE_COLOR = '#2F6FED';

const TAB_ICONS = {
  home: {
    active: require('../../../assets/images/tabs/tab-home-touch.png'),
    inactive: require('../../../assets/images/tabs/tab-home.png'),
  },
  recording: {
    active: require('../../../assets/images/tabs/tab-recording-touch.png'),
    inactive: require('../../../assets/images/tabs/tab-recording.png'),
  },
  history: {
    active: require('../../../assets/images/tabs/tab-history-touch.png'),
    inactive: require('../../../assets/images/tabs/tab-history.png'),
  },
  mypage: {
    active: require('../../../assets/images/tabs/tab-mypage-touch.png'),
    inactive: require('../../../assets/images/tabs/tab-mypage.png'),
  },
};

function TabIcon({ name, focused }: { name: keyof typeof TAB_ICONS; focused: boolean }) {
  return (
    <Image
      source={focused ? TAB_ICONS[name].active : TAB_ICONS[name].inactive}
      style={{ width: 23, height: 23, marginTop: 4 }}
      resizeMode="contain"
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: TAB_ACTIVE_COLOR,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="recording"
        options={{
          title: '녹음',
          tabBarIcon: ({ focused }) => <TabIcon name="recording" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '히스토리',
          tabBarIcon: ({ focused }) => <TabIcon name="history" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: '마이',
          tabBarIcon: ({ focused }) => <TabIcon name="mypage" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
