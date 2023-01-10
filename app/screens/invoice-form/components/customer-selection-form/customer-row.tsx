import { Customer } from "../../../../models/entities/customer/customer";
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { palette } from "../../../../theme/palette";
import React, { FC } from "react";
import { spacing } from "../../../../theme";
import { Text } from "../../../../components";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import RadioButton from "./radio-button";

type TCustomerRow = {
  customer: Customer,
  onSelect: (customer: Customer) => void
  isSelected?: boolean
}
const CUSTOMER_NAME: TextStyle = {
  color: palette.textClassicColor,
  fontWeight: "bold",
  fontSize: 18
};
const CUSTOMER_ROW_CONTAINER: ViewStyle = {
  flex: 1,
  flexDirection: "row"
};

const EDIT_BUTTON_STYLE: ViewStyle = { flex: 1, justifyContent: "center", alignItems: "flex-end" };
const CustomerRow: FC<TCustomerRow> = (props) => {
  const { customer, onSelect, isSelected = false } = props;

  return (
    <View style={{ ...CUSTOMER_ROW_CONTAINER, paddingVertical: spacing[2] }}>
      <TouchableOpacity style={CUSTOMER_ROW_CONTAINER} onPress={() => onSelect(customer)}>
        <>
          <RadioButton isActive={isSelected} />
          <Text text={customer.name} style={{ ...CUSTOMER_NAME, marginLeft: spacing[2] }} />
        </>
      </TouchableOpacity>
      <TouchableOpacity style={EDIT_BUTTON_STYLE}>
        <Icon name={"pencil-outline"} color={palette.lighterGrey} size={20} />
      </TouchableOpacity>
    </View>);
};

export default CustomerRow;