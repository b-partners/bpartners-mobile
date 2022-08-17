import React, {PropsWithoutRef} from "react";
import {TextStyle, View, ViewStyle} from "react-native";
import {Text} from "../../components";
import {spacing} from "../../theme";
import { Transaction as ITransaction } from '../../models/transaction/transaction';

const TRANSACTION_AMOUNT: TextStyle = {fontSize: 20, fontWeight: 'bold'};

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

    return <View style={LIST_CONTAINER}>
        <View>
            <Text style={{...LIST_TEXT }}>
                {item.title}
            </Text>
            <Text style={{...LIST_TEXT, fontWeight: "normal"}}>
                {date.toISOString().split("T")[0]}
            </Text>
        </View>
        <View style={{marginLeft: "auto", flexDirection: "row"}}>
            <Text style={TRANSACTION_AMOUNT}>{item.amount}</Text>
            <Text style={{...TRANSACTION_AMOUNT, marginLeft: 5}} tx="transactionListScreen.currency"></Text>
        </View>
    </View>;
}
