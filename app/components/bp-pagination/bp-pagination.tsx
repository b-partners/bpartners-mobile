import { palette } from '../../theme/palette';
import { Text } from '../text/text';
import { paginationStyles as styles } from './utils/styles';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

type InvoicePaginationProps = {
  maxPage: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};
export const BpPagination: React.FC<InvoicePaginationProps> = props => {
  const { page, setPage, maxPage } = props;

  const incrementPage = () => setPage(page + 1);
  const reducePage = () => setPage(page - 1);

  return (
    <View style={styles.container}>
      {page === 1 ? (
        <View style={styles.leftDisabled}>
          <EntypoIcon name='chevron-thin-left' size={27} color={palette.lighterGrey} />
        </View>
      ) : (
        <TouchableOpacity style={styles.left} onPress={reducePage}>
          <EntypoIcon name='chevron-thin-left' size={25} color='#000' />
        </TouchableOpacity>
      )}
      <View style={styles.page}>
        <Text text={page.toString()} style={{ fontSize: 20, fontWeight: '600', color: palette.textClassicColor }} />
      </View>
      {page === maxPage ? (
        <View style={styles.rightDisabled}>
          <EntypoIcon name='chevron-thin-right' size={27} color={palette.lighterGrey} />
        </View>
      ) : (
        <TouchableOpacity style={styles.right} onPress={incrementPage}>
          <EntypoIcon name='chevron-thin-right' size={25} color='#000' />
        </TouchableOpacity>
      )}
    </View>
  );
};
