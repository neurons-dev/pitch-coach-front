import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { logout } from '@/api/auth-api';
import { getRefreshToken } from '@/store/auth-store';
import { RecordingColors } from '@/constants/recording-theme';
import { useCurrentUser } from '@/hooks/use-current-user';

type MenuItem = {
  key: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  danger?: boolean;
};

export default function MyPageScreen() {
  const { name, email } = useCurrentUser();
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      await logout(refreshToken).catch(() => {});
    }
    setIsLoggingOut(false);
    setIsLogoutVisible(false);
    router.replace('/login');
  };

  const menuItems: MenuItem[] = [
    {
      key: 'password',
      label: '비밀번호 변경',
      icon: 'vpn-key',
      onPress: () => router.push('/password-change'),
    },
    {
      key: 'terms',
      label: '이용약관',
      icon: 'description',
      onPress: () => router.push('/terms'),
    },
    {
      key: 'privacy',
      label: '개인정보 처리방침',
      icon: 'privacy-tip',
      onPress: () => router.push('/privacy'),
    },
    {
      key: 'logout',
      label: '로그아웃',
      icon: 'logout',
      onPress: () => setIsLogoutVisible(true),
    },
    {
      key: 'account-deletion',
      label: '회원 탈퇴',
      icon: 'delete-forever',
      onPress: () => router.push('/account-deletion'),
      danger: true,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>마이</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Image
              source={require('../../../assets/images/login-character.png')}
              style={styles.avatar}
              contentFit="contain"
            />
          </View>

          <View style={styles.profileText}>
            <Text style={styles.profileName}>{name ?? '발표자'}</Text>
            <Text style={styles.profileEmail}>{email ?? ''}</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.key}
              style={[styles.menuRow, index === menuItems.length - 1 && styles.menuRowLast]}
              onPress={item.onPress}
              accessibilityRole="button">
              <View style={styles.menuLeft}>
                <View style={styles.menuIconWrap}>
                  <MaterialIcons
                    name={item.icon}
                    size={20}
                    color={item.danger ? '#EF4444' : '#5A6472'}
                  />
                </View>
                <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>
                  {item.label}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#C4CCD9" />
            </Pressable>
          ))}
        </View>

        <Text style={styles.footer}>Pitch Coach v1.0.0</Text>
      </ScrollView>

      <Modal visible={isLogoutVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <MaterialIcons name="logout" size={26} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>로그아웃 하시겠어요?</Text>
            <Text style={styles.modalDescription}>로그아웃 후에도 학습 데이터는 유지됩니다.</Text>

            <View style={styles.modalButtonRow}>
              <Pressable
                style={styles.modalCancelButton}
                onPress={() => setIsLogoutVisible(false)}
                disabled={isLoggingOut}>
                <Text style={styles.modalCancelText}>아니요</Text>
              </Pressable>
              <Pressable
                style={styles.modalConfirmButton}
                onPress={handleLogout}
                disabled={isLoggingOut}>
                <Text style={styles.modalConfirmText}>
                  {isLoggingOut ? '로그아웃 중...' : '로그아웃 할게요'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: RecordingColors.screen,
  },
  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E8F5',
  },
  pageTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E8F5',
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF1FE',
  },
  avatar: {
    width: 50,
    height: 50,
    marginLeft: 3,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A94A6',
  },
  menuCard: {
    marginTop: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E8F5',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F4F9',
  },
  menuRowLast: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202938',
  },
  menuLabelDanger: {
    color: '#EF4444',
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#A1AAB8',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15,23,42,0.45)',
  },
  modalCard: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  modalIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDEAEA',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A94A6',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#EEF1F5',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#5A6472',
  },
  modalConfirmButton: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#EF4444',
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
