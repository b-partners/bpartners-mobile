import React, { FC, ReactNode, useState } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { List } from 'react-native-paper';

import { palette } from '../../theme/palette';

interface BpAccordionProps {
  children: ReactNode;
  title: string;
  defaultExpanded?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

export const BpAccordion: FC<BpAccordionProps> = ({ children, title, defaultExpanded = false, style, titleStyle }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const toggle = () => setIsExpanded(p => !p);

  return (
    <List.Accordion
      style={[{ backgroundColor: palette.purple }, style]}
      titleStyle={[{ color: palette.white }, titleStyle]}
      expanded={isExpanded}
      onPress={toggle}
      title={title}
    >
      {children}
    </List.Accordion>
  );
};
