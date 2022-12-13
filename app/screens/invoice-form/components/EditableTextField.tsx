import { useFormikContext } from "formik";
import React, { FC } from "react";
import { TextInputProps, TextStyle, View, ViewStyle } from "react-native";

import { Text, TextField } from "../../../components";
import { spacing } from "../../../theme";
import { palette } from "../../../theme/palette";

interface TEditableTextField extends TextInputProps{
  title?: string;
  formName?: string;
  placeholder?: string;
  containerStyle?: ViewStyle;
}

const CONTAINER_STYLE: ViewStyle = {
  flex: 1,
  padding: spacing[4]
};
const LABEL_STYLE: TextStyle = {
  color: palette.greyDarker,
  fontSize: 14,
  fontWeight: "700"
};

const EditableTextField: FC<TEditableTextField> = props => {
  const { title, formName, placeholder, containerStyle, ...rest } = props;
  const { touched, handleChange, values, setFieldTouched } = useFormikContext();

  return (
    <View style={[CONTAINER_STYLE, containerStyle]}>
      <Text text={title} style={LABEL_STYLE} />
      {touched[formName] || !values[formName] ? (
        <TextField
          {...rest}
          value={values[formName] || ""}
          onChangeText={handleChange(formName)}
          onBlur={() => {
            __DEV__ && console.tron.log("blur changing");
            setFieldTouched(formName, false);
          }}
          placeholder={placeholder}
        />
      ) : (
        <Text text={values[formName]} style={{ color: palette.textClassicColor, fontSize: 18, fontWeight: "700" }}
              onPress={() => setFieldTouched(formName)} />
      )}
    </View>
  );
};

export default EditableTextField;
