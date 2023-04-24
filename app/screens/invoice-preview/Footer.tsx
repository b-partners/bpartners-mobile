import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';

import { Icon } from '../../components';
import { color } from '../../theme';

const ACTION_CONTAINER: ViewStyle = {};
const EMAIL_FIELD_CONTAINER: ViewStyle = {};
const EMAIL_COPY_CONTAINER: ViewStyle = {};
const SEND_INVOICE_BUTTON_STYLE: ViewStyle = {
  backgroundColor: color.palette.secondaryColor,
  borderRadius: 25,
  marginLeft: 15,
  flex: 1,
};
type IFooter = {};
const Footer: FC<IFooter> = props => {
  const {} = props;

  function handleSendInvoice() {}

  return (
    <View>
      <View style={ACTION_CONTAINER}>
        <TouchableOpacity>
          <MaterialIcons name='delete-outline' size={24} color='black' />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon icon={'edit'} />
        </TouchableOpacity>
        <TouchableOpacity>
          <AntDesign name='download' size={24} color='black' />
        </TouchableOpacity>
      </View>
      <View style={EMAIL_FIELD_CONTAINER} />
      <View style={EMAIL_COPY_CONTAINER} />
      <TouchableOpacity style={SEND_INVOICE_BUTTON_STYLE} onPress={handleSendInvoice}>
        {/*TODO use text style */}
      </TouchableOpacity>
      {/*<Button*/}
      {/*  tx='invoicePreviewScreen.sendInvoice'*/}
      {/*  onPress={handleInvoicePreviewPress}*/}
      {/*  textStyle={{*/}
      {/*    color: color.palette.white,*/}
      {/*    fontSize: 14,*/}
      {/*    fontFamily: 'Geometria-Bold',*/}
      {/*  }}*/}
      {/*/>*/}
    </View>
  );
};

export default Footer;
