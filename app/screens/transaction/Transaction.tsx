import React, { PropsWithoutRef } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Text } from "../../components"
import { spacing } from "../../theme"
import { Transaction as ITransaction } from "../../models/transaction/transaction"
import { translate } from "../../i18n"

const TRANSACTION_AMOUNT: TextStyle = { fontSize: 19, fontWeight: "bold" }

const LIST_TEXT: TextStyle = {
  fontWeight: "bold",
  marginBottom: spacing[2],
}

const LIST_CONTAINER: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
  padding: spacing[3],
}

const TRANSACTION_LEFT_SIDE: ViewStyle = {
  flex: 2,
}

const TRANSACTION_RIGHT_SIDE: ViewStyle = {
  marginLeft: "auto",
  flex: 1,
}

export const Transaction = (props: PropsWithoutRef<{ item: ITransaction }>) => {
  const { item } = props
  const date = new Date(item.updateDateTime)
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: translate("currency"),
    maximumFractionDigits: 0,
  })

  return (
    <View style={LIST_CONTAINER}>
      <View style={TRANSACTION_LEFT_SIDE}>
        <Text style={{ ...LIST_TEXT }}>{item.title}</Text>
        <Text style={{ ...LIST_TEXT }}>{date.toISOString().split("T")[0]}</Text>
      </View>
      <View style={TRANSACTION_RIGHT_SIDE}>
        <Text style={TRANSACTION_AMOUNT}>{formatter.format(item.amount)}</Text>
      </View>
    </View>
  )
}
