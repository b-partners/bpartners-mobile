import React, { FC } from 'react';
import { View, ViewStyle } from 'react-native';
import {palette} from "../../../theme/palette";

interface TCircleOutline {
    // Icon size value is 20 by default
    size?: number;
    style?: ViewStyle;
}

const ICON_CONTAINER_STYLE: ViewStyle = { justifyContent: 'center', alignItems: 'center' };
const ICON_STYLE: ViewStyle = {
    borderWidth: 1,
    borderColor: palette.lighterGrey,
    borderRadius: 25,
};
/**
 * Icon component of a outlined circle
 * */
export const CircleOutline: FC<TCircleOutline> = props => {
    const { size = 20, style } = props;

    return (
        <View style={ICON_CONTAINER_STYLE}>
            <View style={[ICON_STYLE, { width: size, height: size }, style]} />
        </View>
    );
};
