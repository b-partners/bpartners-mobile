import React, { FC, ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { Text } from '../text/text';
import { PAGINATION_STYLE as s } from './styles';

interface PaginationProps {
  changePage: (page: number) => void;
  page: number;
  hasNext: boolean;
  actions?: ReactNode;
}

export const Pagination: FC<PaginationProps> = ({ changePage, hasNext, page, actions }) => {
  const hasPrev = page > 1;

  const next = () => hasNext && changePage(page + 1);
  const prev = () => hasPrev && changePage(page - 1);

  return (
    <View style={s.container}>
      <TouchableOpacity onPress={prev} disabled={!hasPrev}>
        <EntypoIcon name='chevron-thin-left' size={25} color={s.iconColor(!hasPrev)} />
      </TouchableOpacity>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={s.pageText} text={`Page: ${page}`} />
      </View>
      <TouchableOpacity onPress={next} disabled={!hasNext}>
        <EntypoIcon color={s.iconColor(!hasNext)} name='chevron-thin-right' size={25} />
      </TouchableOpacity>
      {actions}
    </View>
  );
};
