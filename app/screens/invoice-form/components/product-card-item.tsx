import { Formik } from "formik";
import React, { FC, useEffect, useState } from "react";
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import uuid from "react-native-uuid";
import * as yup from "yup";

import { Separator, Text } from "../../../components";
import { Product } from "../../../models/entities/product/product";
import { color, spacing } from "../../../theme";
import { palette } from "../../../theme/palette";
import { SHADOW_STYLE } from "../styles";
import EditableTextField from "./editable-text-field";
import { SimpleLineIcons } from "@expo/vector-icons";
import { SEPARATOR_STYLE } from "../../invoice-quotation/styles";

const CONTAINER_STYLE: ViewStyle = {
  backgroundColor: palette.white,
  borderRadius: 20,
  margin: spacing[4],
  // overflow: "hidden",
  ...SHADOW_STYLE,
  elevation: 12,
  borderWidth: 0.5,
  borderColor: palette.lighterGrey
};
const EDITABLE_TF_CONTAINER = { borderWidth: 0.5, borderColor: palette.lighterGrey, flex: 1 };
const DELETE_ACTION_POSITION_STYLE: ViewStyle = { position: "absolute", right: -10, top: -10, zIndex: 2 };
const BOTTOM_INFO_STYLE: ViewStyle = { flex: 1, flexDirection: "row", overflow: "hidden" };
const PLACEHOLDER_TEXT_STYLE: TextStyle = { fontStyle: "italic" };
const EDITABLE_TEXT_FIELD_STYLE = { height: 46 };
type ICardElement = {
  item?: Product;
  onAdd?: (product: Product) => void;
  onRemove?: (item: Product) => void;
  onChange: (item: Product) => void;
};

const DELETE_ACTION_CONTAINER_STYLE: ViewStyle = {backgroundColor: color.primary, padding: spacing[2], borderRadius: 14, width: 28};
const ProductCardItem: FC<ICardElement> = ({ onRemove, onAdd, item, onChange }) => {
  const [initialValues, setInitialValues] = useState<Product>(
    item || {
      id: "",
      description: "",
      totalPriceWithVat: 0,
      vatPercent: 0,
      unitPrice: 0,
      quantity: 0,
      totalVat: 0
    }
  );

  useEffect(() => {
    if (!initialValues.id) {
      setInitialValues({ ...initialValues, id: uuid.v4().toString() });
    }
  }, []);


  const validationSchema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().notRequired(),
    unitPrice: yup.number().min(0).required(),
    quantity: yup.number().min(1).required(),
    tva: yup.number().min(0).max(100).required()
  });

  return (
    <Formik<Product>
      initialValues={initialValues}
      onSubmit={values => {
        onAdd(values);
      }}
      validationSchema={validationSchema}
    >
      {({ values }) => {
        useEffect(() => {
          onChange(values);
        }, [values]);
        return (
          <>
            <View>
              <View style={CONTAINER_STYLE}>
                <Text tx={"invoiceFormScreen.invoiceForm.productCartItem.delete"} style={{ color: color.primary, flex: 1, alignSelf: 'flex-end', marginRight: spacing[5], fontSize: 9 }} />
                <TouchableOpacity
                  style={[DELETE_ACTION_POSITION_STYLE, DELETE_ACTION_CONTAINER_STYLE]}
                  onPress={() => {
                    onRemove(values);
                  }}
                >
                    <SimpleLineIcons name={"trash"} color={palette.white} size={12} style={{fontWeight: '200'}}/>
                </TouchableOpacity>
                <View>
                  <EditableTextField
                    titleTx={"invoiceFormScreen.invoiceForm.productCartItem.title"}
                    formName={"title"}
                    placeholderTx={"invoiceFormScreen.invoiceForm.productCartItem.titlePlaceholder"}
                  />
                  <EditableTextField
                    titleTx={"invoiceFormScreen.invoiceForm.productCartItem.description"}
                    formName={"description"}
                    placeholderTx={"invoiceFormScreen.invoiceForm.productCartItem.descriptionPlaceholder"}
                  />
                </View>
                <Separator style={SEPARATOR_STYLE}/>
                <View style={BOTTOM_INFO_STYLE}>
                  <EditableTextField
                    titleTx={"invoiceFormScreen.invoiceForm.productCartItem.unitPrice"}
                    suffix={" €"}
                    formName={"unitPrice"}
                    containerStyle={{...EDITABLE_TF_CONTAINER, borderWidth: 0}}
                    keyboardType={"number-pad"}
                    defaultValue={"0"}
                    style={EDITABLE_TEXT_FIELD_STYLE}
                    placeholderStyle={PLACEHOLDER_TEXT_STYLE}
                  />
                  <EditableTextField
                    titleTx={"invoiceFormScreen.invoiceForm.productCartItem.quantity"}
                    prefix={"x "}
                    formName={"quantity"}
                    containerStyle={{...EDITABLE_TF_CONTAINER, borderTopWidth: 0, borderBottomWidth: 0 ,borderLeftWidth: 1, borderRightWidth: 1}}
                    keyboardType={"number-pad"}
                    defaultValue={"1"}
                  />
                  <EditableTextField title={"TVA"}
                                     formName={"tva"}
                                     containerStyle={{...EDITABLE_TF_CONTAINER,borderWidth: 0}}
                                     suffix={" %"}
                                     defaultValue={"0"}
                  />
                </View>
              </View>
            </View>
          </>
        );
      }}
    </Formik>
  );
};

export default ProductCardItem;
