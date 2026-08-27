import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type AccordionItemProps = {
  title: string;
  children: string;
};

export function AccordionItem({ title, children }: AccordionItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.header}
        onPress={() => setExpanded((current) => !current)}
        accessibilityRole="button">
        <Text style={styles.title}>{title}</Text>
        <MaterialIcons name={expanded ? 'expand-less' : 'expand-more'} size={22} color="#8A94A6" />
      </Pressable>

      {expanded && <Text style={styles.body}>{children}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#EDF1F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#202938',
  },
  body: {
    paddingBottom: 16,
    fontSize: 13,
    lineHeight: 20,
    color: '#6B7280',
  },
});
