import React from 'react';
import { View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { InvoiceSummaryProps } from '../utils/utils';
import { SummaryCard } from './summary-card';

export const InvoiceSummary: React.FC<InvoiceSummaryProps> = props => {
  const { quotation, paid, unpaid, loading } = props;

  return (
    <View style={{ width: '100%', height: 70, flexDirection: 'row', alignItems: 'center', marginTop: spacing[1] }}>
      <SummaryCard
        colors={[palette.white, palette.lighterGrey, '#A8B3C1']}
        space={'1.5%'}
        icon={<MaterialCommunityIcon name='file-multiple-outline' size={22} color={color.palette.secondaryColor} />}
        label={'invoiceScreen.summary.quotation'}
        amount={quotation}
        loading={loading}
      />
      <SummaryCard
        colors={['#EAFDE7', '#B7E5A7', '#A2F78D']}
        space={'1.5%'}
        icon={<MaterialCommunityIcon name='text-box-check-outline' size={24} color={color.palette.secondaryColor} />}
        label={'invoiceScreen.summary.paid'}
        amount={paid}
        loading={loading}
      />
      <SummaryCard
        colors={[palette.white, palette.Khaki, palette.lightYellow]}
        space={'2%'}
        icon={<MaterialCommunityIcon name='message-text-clock-outline' size={24} color={color.palette.secondaryColor} />}
        label={'invoiceScreen.summary.unpaid'}
        amount={unpaid}
        loading={loading}
      />
    </View>
  );
};
