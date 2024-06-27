import { cloneDeep } from 'lodash';
import React, { PropsWithoutRef, useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Dropdown, Loader, Text } from '../../../components';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { Invoice } from '../../../models/entities/invoice/invoice';
import { TransactionCategory, TransactionType } from '../../../models/entities/transaction-category/transaction-category';
import { Transaction as ITransaction } from '../../../models/entities/transaction/transaction';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { handleAsyncRequest } from '../../../utils/asyncRequest';
import { printCurrencyToMajors } from '../../../utils/money';
import { showMessage } from '../../../utils/snackbar';
import { invoicePageSize } from '../../invoice-form/utils/utils';
import { ICON_CONTAINER_STYLE, TRANSACTION_BOTTOM_SIDE, transactionStyles as styles } from '../utils/styles';
import { TransactionStatusColor, TransactionStatusLabel } from '../utils/utils';

export const Transaction = (
  props: PropsWithoutRef<{
    item: ITransaction;
    transactionCategories: TransactionCategory[];
    showTransactionCategory?: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentTransaction: React.Dispatch<React.SetStateAction<ITransaction>>;
  }>
) => {
  const { transactionStore, invoiceStore } = useStores();
  const { item, transactionCategories, setShowModal, setCurrentTransaction } = props;
  const [isModifying, setIsModifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTransactionCategory, setSelectedTransactionCategory] = useState<TransactionCategory | null>(item.category);
  const filteredTransactionCategories = cloneDeep(transactionCategories).filter(category => category.transactionType === item.type);
  const onChange = (category: TransactionCategory) => {
    setIsModifying(true);
    setSelectedTransactionCategory(category);
  };

  const updateTransaction = async () => {
    try {
      setLoading(true);
      await transactionStore.updateTransactionCategory(item.id, selectedTransactionCategory);
      setLoading(false);
      setIsModifying(false);
      await transactionStore.getTransactions({ page: 1, pageSize: invoicePageSize });
    } catch (e) {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{ display: 'flex', flexDirection: 'column', flex: 4 }}>
            <Text
              text={`${item.label}`}
              style={{
                color: color.palette.textClassicColor,
                fontFamily: 'Geometria-Bold',
              }}
            />
            <View
              style={{
                flex: 2,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: spacing[2],
              }}
            >
              <Text
                text={TransactionStatusLabel[item.status]}
                style={{ color: TransactionStatusColor[item.status], fontSize: 13, fontFamily: 'Geometria-LightItalic' }}
              />
              <Text
                text={'\u2B24'}
                style={{
                  fontSize: Platform.select({ android: 7, ios: 5 }),
                  marginHorizontal: spacing[2],
                  color: '#989FB3',
                  fontFamily: 'Geometria-LightItalic',
                }}
              />
              <Text
                text={new Date(item.paymentDatetime).toLocaleDateString()}
                style={{ color: '#989FB3', fontSize: 13, fontFamily: 'Geometria-LightItalic' }}
              />
              <Text
                text={'\u2B24'}
                style={{
                  fontSize: Platform.select({ android: 7, ios: 5 }),
                  marginHorizontal: spacing[2],
                  color: '#989FB3',
                  fontFamily: 'Geometria-LightItalic',
                }}
              />
              <Text
                text={new Date(item.paymentDatetime).toLocaleTimeString()}
                style={{
                  color: '#989FB3',
                  fontFamily: 'Geometria-LightItalic',
                }}
              />
            </View>
          </View>
          <Text
            style={{
              color: item.type === TransactionType.OUTCOME ? palette.pastelRed : color.palette.green,
            }}
            text={`${item.type === TransactionType.OUTCOME ? '-' : '+'}${printCurrencyToMajors(item.amount)}`}
          />
          <TouchableOpacity style={{ marginHorizontal: spacing[2] }}>{/*<Icon icon='ellipsisV' />*/}</TouchableOpacity>
        </View>
      </View>
      <View style={TRANSACTION_BOTTOM_SIDE}>
        <View style={{ display: 'flex', flexDirection: 'row', padding: spacing[0] }}>
          <Dropdown<TransactionCategory>
            items={filteredTransactionCategories}
            labelField='description'
            valueField='id'
            onChangeText={() => {}}
            onChange={category => onChange(category)}
            placeholder={translate('transactionListScreen.transactionCategoryPlaceholder')}
            value={selectedTransactionCategory}
            dropdownContainerStyle={{ padding: 0 }}
            style={styles.dropdown}
            selectedItemTextStyle={{ color: palette.textClassicColor, fontFamily: 'Geometria-Bold' }}
            itemTextStyle={{ color: color.palette.textClassicColor, fontFamily: 'Geometria' }}
            placeholderTextStyle={{ color: color.palette.textClassicColor, fontFamily: 'Geometria-Bold' }}
          >
            <View testID='transaction-category-container' style={styles.dropdownChildren}>
              <Text
                text={
                  selectedTransactionCategory && selectedTransactionCategory.description
                    ? selectedTransactionCategory.description
                    : translate('transactionListScreen.transactionCategoryPlaceholder')
                }
                testID='transaction-category'
                numberOfLines={2}
                style={{
                  color: selectedTransactionCategory && selectedTransactionCategory.description ? palette.textClassicColor : palette.lightGrey,
                  fontFamily: selectedTransactionCategory && selectedTransactionCategory.description ? 'Geometria-Bold' : 'Geometria',
                  fontSize: selectedTransactionCategory && selectedTransactionCategory.description ? 16 : 15,
                }}
              />
              <Ionicons name='chevron-down-sharp' size={17} style={{ color: palette.lightGrey }} />
            </View>
          </Dropdown>
          {isModifying && (
            <>
              <TouchableOpacity onPress={updateTransaction} style={styles.checkmark}>
                {loading ? <Loader animating={true} /> : <Ionicons name='checkmark' size={25} style={{ color: palette.green }} />}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedTransactionCategory(item.category);
                  setIsModifying(false);
                }}
                style={styles.close}
              >
                <AntDesignIcon name='close' size={25} style={{ color: palette.pastelRed }} />
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            style={ICON_CONTAINER_STYLE}
            onPress={async () => {
              invoiceStore.resetInvoice();
              setCurrentTransaction(item);
              setShowModal(true);
              if (item.invoice) {
                await handleAsyncRequest<Invoice>(() => invoiceStore.getInvoice(item.invoice.invoiceId));
              }
            }}
          >
            <MaterialIcons name='add-a-photo' size={25} style={{ color: palette.lightGrey }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
