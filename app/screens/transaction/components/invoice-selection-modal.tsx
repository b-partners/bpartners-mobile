import React, { useState } from 'react';
import { FlatList, Modal, TouchableOpacity, View } from 'react-native';
import RNVIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { Button, Separator, Text } from '../../../components';
import { Invoice } from '../../../models/entities/invoice/invoice';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { BUTTON_INVOICE_STYLE, BUTTON_TEXT_STYLE } from '../../invoice-quotation/styles';
import { InvoiceRow } from './invoice-row';

type InvoiceSelectionModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  invoices: Invoice[];
};

export const InvoiceSelectionModal: React.FC<InvoiceSelectionModalProps> = props => {
  const { showModal, setShowModal, invoices } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const startItemIndex = (currentPage - 1) * itemsPerPage;
  const endItemIndex = currentPage * itemsPerPage;
  const displayedInvoices = invoices.slice(startItemIndex, endItemIndex);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>();
  const maxPage = Math.ceil(invoices.length / itemsPerPage);

  return (
    <Modal visible={showModal} animationType='fade' transparent={true} onRequestClose={() => setShowModal(false)}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'rgba(10, 16, 69, 0.5)',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <View
          style={[
            {
              padding: spacing[4],
              backgroundColor: palette.white,
              width: '100%',
              height: '60%',
            },
          ]}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: spacing[1], paddingHorizontal: spacing[2], height: '5%' }}>
            <Text
              tx={'paymentListScreen.tabs.invoices'}
              style={{
                color: color.palette.lightGrey,
                fontFamily: 'Geometria',
                fontSize: 15,
              }}
            />
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <RNVIcon name='close' color={color.palette.lightGrey} size={14} />
            </TouchableOpacity>
          </View>
          <View style={{ paddingVertical: spacing[2], height: '80%' }}>
            <FlatList
              data={displayedInvoices}
              keyExtractor={item => item.id}
              renderItem={({ item: current }) => {
                return <InvoiceRow invoice={current} isSelected={current.id === selectedInvoice?.id} onSelect={() => setSelectedInvoice(current)} />;
              }}
              ItemSeparatorComponent={() => <Separator style={{ borderColor: palette.lighterGrey }} />}
            />
          </View>
          <View style={{ flexDirection: 'row', marginTop: spacing[2], height: 80 }}>
            <View style={{ width: '25%', alignItems: 'center', flexDirection: 'row', height: '100%', justifyContent: 'space-evenly' }}>
              {currentPage === 1 ? (
                <View style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
                  <EntypoIcon name='chevron-thin-left' size={27} color={palette.lighterGrey} />
                </View>
              ) : (
                <TouchableOpacity
                  style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => {
                    setCurrentPage(currentPage - 1);
                  }}
                >
                  <EntypoIcon name='chevron-thin-left' size={25} color='#000' />
                </TouchableOpacity>
              )}
              <View style={{ width: '30%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
                <Text text={currentPage.toString()} style={{ fontSize: 20, fontWeight: '600', color: palette.textClassicColor }} />
              </View>
              {currentPage === maxPage ? (
                <View style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
                  <EntypoIcon name='chevron-thin-right' size={27} color={palette.lighterGrey} />
                </View>
              ) : (
                <TouchableOpacity
                  style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => {
                    setCurrentPage(currentPage + 1);
                  }}
                >
                  <EntypoIcon name='chevron-thin-right' size={25} color='#000' />
                </TouchableOpacity>
              )}
            </View>
            <View style={{ width: '75%', justifyContent: 'center' }}>
              <Button
                tx='invoiceFormScreen.customerSelectionForm.validate'
                style={BUTTON_INVOICE_STYLE}
                textStyle={BUTTON_TEXT_STYLE}
                onPress={() => setShowModal(false)}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
