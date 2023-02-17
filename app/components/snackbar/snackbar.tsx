import React from "react";
import {Snackbar} from "react-native-paper";
import {palette} from "../../theme/palette";

type SnackbarProps = {
    text: string,
    snackbarVisible: boolean,
    onDismissSnackbar: () => void
}

export const BPSnackbar: React.FC<SnackbarProps> = props => {
    const { text, snackbarVisible, onDismissSnackbar } = props;
    return (
        <Snackbar
            visible={snackbarVisible}
            onDismiss={onDismissSnackbar}
            style={{ backgroundColor: 'white', borderRadius: 10, borderColor: palette.secondaryColor, borderBottomWidth: 2, top: 5 }}
            elevation={2}
            action={{
                label: 'X',
                onPress: onDismissSnackbar,
            }}>
            {text}
        </Snackbar>
    );
};
