import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { Text } from '../../../components';
import { palette } from '../../../theme/palette';

type InvoicePaginationProps = {
  maxPage: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};
export const InvoicePagination: React.FC<InvoicePaginationProps> = props => {
  const { page, setPage, maxPage } = props;

  return (
    <View style={{ width: '25%', alignItems: 'center', flexDirection: 'row', height: '100%', justifyContent: 'space-evenly' }}>
      {page === 1 ? (
        <View style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
          <EntypoIcon name='chevron-thin-left' size={27} color={palette.lighterGrey} />
        </View>
      ) : (
        <TouchableOpacity
          style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            setPage(page - 1);
          }}
        >
          <EntypoIcon name='chevron-thin-left' size={25} color='#000' />
        </TouchableOpacity>
      )}
      <View style={{ width: '30%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
        <Text text={page.toString()} style={{ fontSize: 20, fontWeight: '600', color: palette.textClassicColor }} />
      </View>
      {page === maxPage ? (
        <View style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
          <EntypoIcon name='chevron-thin-right' size={27} color={palette.lighterGrey} />
        </View>
      ) : (
        <TouchableOpacity
          style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            setPage(page + 1);
          }}
        >
          <EntypoIcon name='chevron-thin-right' size={25} color='#000' />
        </TouchableOpacity>
      )}
    </View>
  );
};
