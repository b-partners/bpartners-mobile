import { StyleSheet } from "react-native";

export const sheetModalStyles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      width: '100%',
      backgroundColor: '#00000050',
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
      minHeight: 200,
      width: '100%',
    },
    fullHeight: {
      height: '100%',
    },
  });