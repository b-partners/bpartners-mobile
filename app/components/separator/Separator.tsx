import { View, ViewStyle } from "react-native"
import { palette } from "../../theme/palette"
import React from "react"

export function Separator() {
  const STYLE: ViewStyle = { borderTopWidth: 1, borderStyle: "solid", borderColor: palette.white }

  return <View style={STYLE} />
}
