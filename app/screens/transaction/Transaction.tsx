import React, {PropsWithoutRef} from "react";
import {TextStyle, View, ViewStyle} from "react-native";
import {Text} from "../../components";
import {spacing} from "../../theme";
import {Transaction as ITransaction} from '../../models/transaction/transaction';
import {translate} from "../../i18n";

const TRANSACTION_AMOUNT: TextStyle = {fontSize: 19, fontWeight: 'bold'};

const LIST_TEXT: TextStyle = {
    fontWeight: "bold", marginBottom: spacing[2]
};

const LIST_CONTAINER: ViewStyle = {
    alignItems: "center",
    flexDirection: "row",
    padding: spacing[3],
}

export const Transaction = (props: PropsWithoutRef<{ item: ITransaction }>) => {
    const {item} = props;
    const date = new Date(item.updateDateTime);
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: translate('currency'),
        maximumFractionDigits: 0
    });

    return <View style={LIST_CONTAINER}>
        <View style={{flex: 2}}>
            <Text style={{...LIST_TEXT}}>
                {item.title}
            </Text>
            <Text style={{...LIST_TEXT, fontWeight: "normal"}}>
                {date.toISOString().split("T")[0]}
            </Text>
        </View>
        <View style={{marginLeft: "auto", flexDirection: "row", flex: 1}}>
            <Text style={TRANSACTION_AMOUNT}>{formatter.format(item.amount)}</Text>
        </View>
    </View>;
}
