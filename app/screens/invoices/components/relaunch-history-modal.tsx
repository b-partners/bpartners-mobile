import { Button, Text } from '../../../components';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { InvoiceRelaunch, InvoiceStatus } from '../../../models/entities/invoice/invoice';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import {
  MODAL_HEADER_BUTTON_STYLE,
  MODAL_HEADER_BUTTON_TEXT_STYLE,
  MODAL_HEADER_STYLE,
  MODAL_HEADER_TEXT_STYLE,
  MODAL_STYLE,
  relaunchHistoryModalStyles as styles,
} from '../utils/styles';
import { RelaunchHistoryProps } from '../utils/utils';
import { RelaunchItem } from './relaunch-item';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import CloseIcon from 'react-native-vector-icons/AntDesign';

export const RelaunchHistoryModal = (props: RelaunchHistoryProps) => {
  const { isOpen, setOpen, item, setCurrentRelaunch } = props;
  const { invoiceStore } = useStores();
  const [relaunches, setRelaunches] = useState<InvoiceRelaunch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const invoiceRelaunches = await invoiceStore.getInvoiceRelaunches(item.id, { page: 1, pageSize: 500 });
      if (invoiceRelaunches) {
        setRelaunches(invoiceRelaunches);
      }
      relaunches && setLoading(false);
    })();
  }, [isOpen]);

  return (
    <Modal visible={isOpen} transparent={true} onDismiss={() => setOpen(false)}>
      <View style={MODAL_STYLE}>
        <View style={styles.modalContainer}>
          <View style={MODAL_HEADER_STYLE}>
            <Text tx={'relaunchHistoryModal.title'} style={MODAL_HEADER_TEXT_STYLE} />
            <Button
              onPress={() => {
                setOpen(false);
              }}
              style={MODAL_HEADER_BUTTON_STYLE}
              textStyle={MODAL_HEADER_BUTTON_TEXT_STYLE}
            >
              <CloseIcon name='close' size={25} color={palette.secondaryColor} />
            </Button>
          </View>
          <View style={styles.referenceContainer}>
            <Text
              text={`${translate(item.status === InvoiceStatus.PROPOSAL ? 'invoicePreviewScreen.quotation' : 'invoicePreviewScreen.invoice')} : (${item.ref})`}
              style={styles.reference}
            />
          </View>
          {loading ? (
            <View style={{ height: '75%', paddingTop: spacing[4] }}>
              <ProgressBar progress={0.5} color={palette.secondaryColor} indeterminate={true} />
            </View>
          ) : (
            <ScrollView style={{ flex: 1, marginBottom: spacing[4], backgroundColor: palette.white, flexDirection: 'column', marginTop: spacing[2] }}>
              {relaunches.map((relaunch: InvoiceRelaunch, index: number) => {
                return <RelaunchItem item={relaunch} key={relaunch.id} index={index} setCurrentRelaunch={setCurrentRelaunch} />;
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};
