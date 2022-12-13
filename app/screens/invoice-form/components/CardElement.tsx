import React, { FC, useState } from "react";
import { View, ViewStyle } from "react-native";

import { spacing } from "../../../theme";
import { palette } from "../../../theme/palette";
import { SHADOW_STYLE } from "../styles";
import EditableTextField from "./EditableTextField";
import Form from "../../../components/forms/form";
import * as yup from "yup";
import { Icon } from "../../../components";

type TCardElement = {
  title: string;
  description: string;
  unitPrice: number;
  quantity: number;
  tVA: number;
}
const CONTAINER_STYLE: ViewStyle = {
  backgroundColor: palette.white,
  borderRadius: 20,
  margin: spacing[4],
  overflow: "hidden", ...SHADOW_STYLE
};
const EDITABLE_TF_CONTAINER = { borderWidth: 0.5, borderColor: palette.lighterGrey, flex: 1 };


const CardElement: FC<TCardElement> = props => {
  const { title, description, quantity, tVA, unitPrice } = props;
  const [initialValues] = useState({
    title: "",
    description: "",
    unitPrice: 0,
    quantity: 0,
    tva: 0
  });

  const VALIDATION_SCHEMA = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
    unitPrice: yup.number(),
    quantity: yup.number(),
    tva: yup.number()
  });


  return (
    <>
      <View style={{ position: "absolute", right: 5, top: 5, zIndex: 2 }}>
        <Icon icon={"trash"} />
      </View>
      <View style={CONTAINER_STYLE}>
        <View>
          <Form
            initialValue={initialValues}
            validationSchema={VALIDATION_SCHEMA}
          >
            <View>
              <EditableTextField title={"Titre de l'élement"} formName={"title"} placeholder={"Taper le titre"} />
              <EditableTextField title={"Déscription (facultatif)"} formName={"description"}
                                 placeholder={"Taper le titre"} />
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", overflow: "hidden" }}>
              <EditableTextField title={"Prix unitaire"}
                                 formName={"unitPrice"}
                                 containerStyle={EDITABLE_TF_CONTAINER}
                                 keyboardType={"number-pad"}
                                 value={"0"}
              />
              <EditableTextField title={"Quantité"}
                                 formName={"quantity"}
                                 containerStyle={EDITABLE_TF_CONTAINER}
                                 keyboardType={"number-pad"}
              />
              <EditableTextField
                title={"TVA"}
                formName={"tva"}
                containerStyle={EDITABLE_TF_CONTAINER}
              />
            </View>
          </Form>

        </View>
      </View>
    </>
  );
};

export default CardElement;
