import React from "react";
import {ViewStyle} from "react-native";

export type ModalProps = {
    visibleModal: boolean;
    setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const INVALID_FORM_FIELD: ViewStyle = {
    borderBottomColor: '#FF5983',
    borderBottomWidth: 2,
};