import { cloneDeep } from 'lodash';
import React, { PropsWithoutRef } from 'react';
import { Platform, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import { Dropdown, Text } from '../../../components';
// import { Dropdown, Icon, Text } from '../../../components';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { TransactionCategory, TransactionType } from '../../../models/entities/transaction-category/transaction-category';
import { Transaction as ITransaction } from '../../../models/entities/transaction/transaction';
import { color, spacing } from '../../../theme';
import { printCurrencyToMajors } from '../../../utils/money';
import { ICON_CONTAINER_STYLE, LIST_CONTAINER, TRANSACTION_ACTIONS, TRANSACTION_BOTTOM_SIDE } from '../styles';

// import { ICON_CONTAINER_STYLE, ICON_STYLE, LIST_CONTAINER, TRANSACTION_ACTIONS, TRANSACTION_BOTTOM_SIDE } from '../styles';

const TRANSACTION_CATEGORY_LABEL_CONTAINER: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  borderRadius: 25,
  backgroundColor: color.palette.white,
  padding: spacing[3],
};

const TRANSACTION_CATEGORY_LABEL_LEFT_ITEM: ViewStyle = { flex: 10 };

const TRANSACTION_CATEGORY_LABEL_RIGHT_ITEM: TextStyle = { color: color.palette.white, flex: 1 };

export const Transaction = (
  props: PropsWithoutRef<{ item: ITransaction; transactionCategories: TransactionCategory[]; showTransactionCategory?: boolean }>
) => {
  const { transactionStore } = useStores();

  const { item, transactionCategories } = props;

  const filteredTransactionCategories = cloneDeep(transactionCategories).filter(category => category.transactionType === item.type);

  return (
    <View style={LIST_CONTAINER}>
      <View>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{ display: 'flex', flexDirection: 'column', flex: 4 }}>
            <Text
              text={`${item.reference} - ${item.label}`}
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
              color: item.type === TransactionType.OUTCOME ? color.palette.textClassicColor : color.palette.green,
            }}
            text={`${item.type === TransactionType.OUTCOME ? '-' : '+'}${printCurrencyToMajors(item.amount)}`}
          />
          <TouchableOpacity style={{ marginHorizontal: spacing[2] }}>{/*<Icon icon='ellipsisV' />*/}</TouchableOpacity>
        </View>
      </View>
      <View style={TRANSACTION_BOTTOM_SIDE}>
        <View style={TRANSACTION_ACTIONS}>
          <Dropdown<TransactionCategory>
            items={filteredTransactionCategories}
            labelField='description'
            valueField='id'
            onChangeText={() => {}}
            onChange={category => transactionStore.updateTransactionCategory(item.id, category)}
            placeholder={translate('transactionListScreen.transactionCategoryPlaceholder')}
            value={item.category}
            dropdownContainerStyle={{ padding: 0 }}
            style={{
              backgroundColor: color.palette.white,
              borderRadius: 25,
              paddingHorizontal: spacing[4],
              borderWidth: 2,
              borderColor: 'red',
            }}
            selectedItemTextStyle={{ color: color.palette.textClassicColor, fontFamily: 'Geometria-Bold' }}
            itemTextStyle={{ color: color.palette.textClassicColor, fontFamily: 'Geometria' }}
            placeholderTextStyle={{ color: color.palette.textClassicColor, fontFamily: 'Geometria-Bold' }}
          >
            <View testID='transaction-category-container' style={TRANSACTION_CATEGORY_LABEL_CONTAINER}>
              {item.category && item.category.description.length > 0 && (
                <View style={TRANSACTION_CATEGORY_LABEL_LEFT_ITEM}>
                  <Text
                    text={item.category.description}
                    testID='transaction-category'
                    numberOfLines={2}
                    style={{
                      color: color.palette.textClassicColor,
                      fontFamily: 'Geometria',
                    }}
                  />
                </View>
              )}
              <AntDesignIcon name='edit' size={15} style={TRANSACTION_CATEGORY_LABEL_RIGHT_ITEM} />
            </View>
          </Dropdown>
          <TouchableOpacity style={ICON_CONTAINER_STYLE}>
            {/*<Icon icon={item.category && item.category.id ? 'check' : 'unchecked'} style={ICON_STYLE} />*/}
          </TouchableOpacity>
          <TouchableOpacity style={ICON_CONTAINER_STYLE}>{/*<Icon icon='upload' style={ICON_STYLE} />*/}</TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
