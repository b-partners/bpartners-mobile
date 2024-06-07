import React from 'react';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { dropDownStyles } from '../../screens/annotator-edition/utils/styles';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { Text } from '../text/text';

export const LabelledDropdown = props => {
  const { control, name, labelTx, data } = props;

  return (
    <View style={{ position: 'relative', height: 70, width: '100%', borderBottomWidth: 1, borderColor: palette.lighterGrey }}>
      <Text
        tx={labelTx}
        style={{
          fontSize: 12,
          color: palette.lightGrey,
          paddingTop: spacing[3],
          paddingLeft: spacing[4],
        }}
      />
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Dropdown
            style={dropDownStyles.dropdown}
            placeholderStyle={dropDownStyles.placeholderStyle}
            selectedTextStyle={dropDownStyles.selectedTextStyle}
            inputSearchStyle={dropDownStyles.inputSearchStyle}
            iconStyle={dropDownStyles.iconStyle}
            itemTextStyle={dropDownStyles.itemTextStyle}
            data={data}
            search
            maxHeight={300}
            labelField='label'
            valueField='value'
            placeholder='Choisir une valeur'
            searchPlaceholder='Rechercher...'
            value={value}
            onChange={onChange}
          />
        )}
      />
    </View>
  );
};
