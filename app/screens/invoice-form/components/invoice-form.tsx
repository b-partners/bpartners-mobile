import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { FlatList, TextStyle, View, ViewStyle } from "react-native";
import uuid from "react-native-uuid";

import { AutocompletionFormField, Button, Separator, Text, TextField } from "../../../components";
import { DatePickerField } from "../../../components/date-picker-field/date-picker-field";
import { translate } from "../../../i18n";
import { Customer } from "../../../models/entities/customer/customer";
import { Invoice, InvoiceSnapshotIn, InvoiceStatus } from "../../../models/entities/invoice/invoice";
import { Product } from "../../../models/entities/product/product";
import { spacing } from "../../../theme";
import { currencyPipe } from "../../../utils/pipes";
import {
  BUTTON_STYLE,
  INPUT_LABEL_STYLE,
  INPUT_TEXT_STYLE,
  LABEL_CONTAINER_STYLE,
  SECTION_STYLE,
  TEXT_FIELD_STYLE,
  TOTAL_SECTION_STYLE
} from "../styles";
import CardElement from "./CardElement";
import EditableTextField from "./EditableTextField";
import { ProductFormField } from "./product-form-field";
import { palette } from "../../../theme/palette";

type InvoiceFormProps = {
  invoice: Partial<InvoiceSnapshotIn>;
  customers: Customer[];
  products: Product[];
  onSaveInvoice: (invoice: Partial<InvoiceSnapshotIn>) => Promise<void>;
};

const DATEPICKER_ROW_STYLE: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: spacing[4]
};

const SUBMIT_BUTTON_TEXT_STYLE: TextStyle = {
  fontSize: 14
};

const EDITABLE_TF_CONTAINER = {borderWidth: 0.5, borderColor: palette.lighterGrey, flex: 1};

export function InvoiceForm(props: InvoiceFormProps) {
  const { invoice, customers, products, onSaveInvoice } = props;
  const [dataList, setDataList] = useState([]);
  const { format } = currencyPipe(translate("currency"));

  const validate = values => {
    const errors: Partial<Record<keyof Invoice, string>> = {};

    if (values.sendingDate > values.toPayAt) {
      errors.sendingDate = translate("invoiceScreen.errors.sendingDateLaterThanToPayAt");
    }
    return errors;
  };

  const [initialValues, setInitialValues] = useState({
    id: uuid.v4().toString(),
    ref: "",
    title: "",
    comment: null,
    sendingDate: new Date(),
    toPayAt: new Date(),
    customer: {},
    products: [],
    status: InvoiceStatus.DRAFT
  });

  useEffect(() => {
    setInitialValues({
      id: uuid.v4().toString(),
      ref: invoice.ref,
      title: invoice.title,
      comment: null,
      customer: invoice.customer,
      products: invoice.products,
      sendingDate: new Date(invoice.sendingDate),
      toPayAt: new Date(invoice.toPayAt),
      status: invoice.status
    });
  }, [invoice]);

  const handlePress = () => {
    setDataList([...dataList]);
  };

  return (
    <View>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async values => {
          try {
            await onSaveInvoice({
              ...values,
              products: values.products.map(item => ({
                description: item.description,
                unitPrice: item.unitPrice,
                vatPercent: item.vatPercent,
                quantity: item.quantity
              }))
            });
          } catch (e) {
            __DEV__ && console.tron.log(e);
          }
        }}
        validate={validate}
      >
        {({ errors, handleSubmit, setFieldValue, values }) => {
          const total = (values.products as Product[]).reduce((a, c) => {
            return a + c.totalPriceWithVat * c.quantity;
          }, 0);

          return (
            <>
              <View style={{ flex: 1, flexWrap: "wrap" }}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <EditableTextField title={"Titre de devis"} formName={"title"} placeholder={"Placeholder"} containerStyle={EDITABLE_TF_CONTAINER}/>
                    <EditableTextField title={"Numéros du devis"} formName={"ref"} placeholder={"Placeholder"} containerStyle={EDITABLE_TF_CONTAINER}/>
                </View>
                <View style={{ flex: 1, flexDirection: "row"}}>
                  {/*TODO show date picker*/}
                    <EditableTextField title={"Titre de devis"} formName={"title"} placeholder={"Placeholder"} containerStyle={EDITABLE_TF_CONTAINER}/>
                  {/*  <View style={DATEPICKER_ROW_STYLE}>
                    <DatePickerField
                      labelTx='invoiceScreen.labels.sendingDate'
                      value={values.sendingDate}
                      onDateChange={date => setFieldValue("sendingDate", date)}
                      validationError={errors.sendingDate as string}
                    />
                </View>*/}
                  {/*<AutocompletionFormField
                    containerStyle={{ marginBottom: spacing[4], flex: 1 }}
                    id='id'
                    title='name'
                    value={values.customer}
                    data={customers}
                    onValueChange={item => {
                      const c = (customers || []).find(customer => item && item.id === customer.id);
                      setFieldValue('customer', c);
                    }}
                    onSearch={() => {}}
                    onClear={() => {
                      setFieldValue('customer', null);
                    }}
                  />
                  <GridHeaderContent
                    headerText={"Date de l'émission"}
                    bodyText={new Date().toLocaleDateString()}
                    style={{ flex: 1, borderWidth: 1, borderColor: palette.greyDarker }}
                  />*/}
                </View>
              </View>
              <View>
                <CardElement
                  title={"Réparation de la plomberie"}
                  description={"Changement du tuyau"}
                  unitPrice={0.0}
                  quantity={1}
                  tVA={0}
                />
                <Button text={"Ajouter un autre élément"} style={BUTTON_STYLE}
                        onPress={handlePress} />

              </View>

              <TextField
                testID='ref'
                nativeID='ref'
                style={TEXT_FIELD_STYLE}
                labelContainerStyle={LABEL_CONTAINER_STYLE}
                labelStyle={INPUT_LABEL_STYLE}
                inputStyle={INPUT_TEXT_STYLE}
                labelTx='invoiceScreen.labels.ref'
                value={values.ref}
                onChangeText={ref => setFieldValue("ref", ref)}
              />


              <View style={DATEPICKER_ROW_STYLE}>
                <DatePickerField
                  labelTx='invoiceScreen.labels.toPayAt'
                  value={values.toPayAt}
                  onDateChange={date => setFieldValue("toPayAt", date)}
                  validationError={errors.toPayAt as string}
                />
              </View>

              <Text tx='invoiceScreen.labels.customerSection' style={SECTION_STYLE} />
              <Separator style={{ marginBottom: spacing[4] }} />
              <Text tx='invoiceScreen.labels.productSection' style={SECTION_STYLE} />

              <View>
                <AutocompletionFormField
                  value={""}
                  data={products.filter(item => {
                    const selectedProducts = values.products.map(p => p.id);
                    return !selectedProducts.includes(item.id);
                  })}
                  id='id'
                  title='description'
                  onValueChange={item => {
                    if (!item) {
                      return;
                    }
                    const product = products.find(p => item && item.id === p.id);
                    setFieldValue("products", [...values.products, { ...product, quantity: 1 }]);
                  }}
                  onSearch={() => {
                  }}
                  onClear={() => {
                  }}
                />
                <View style={{ marginTop: spacing[4] }}>
                  <FlatList<Product>
                    data={values.products}
                    renderItem={({ item }) => (
                      <ProductFormField
                        key={item.id}
                        product={item}
                        onQuantityChange={quantity => {
                          const selectedProducts = values.products.map(p =>
                            p.id === item.id
                              ? {
                                ...p,
                                quantity
                              }
                              : p
                          );
                          setFieldValue("products", selectedProducts);
                        }}
                        onRemoveProduct={product => {
                          setFieldValue(
                            "products",
                            values.products.filter(p => p.id !== product.id)
                          );
                        }}
                      />
                    )}
                  />
                </View>
              </View>

              <Separator style={{ marginBottom: spacing[4] }} />

              <View style={TOTAL_SECTION_STYLE}>
                <Text text={`${translate("invoiceScreen.labels.totalSection")}: `} style={SECTION_STYLE} />
                <Text text={format(total)} />
              </View>

              <Separator style={{ marginBottom: spacing[4] }} />

              <TextField
                testID='comment'
                nativeID='comment'
                style={TEXT_FIELD_STYLE}
                labelContainerStyle={LABEL_CONTAINER_STYLE}
                labelStyle={INPUT_LABEL_STYLE}
                inputStyle={INPUT_TEXT_STYLE}
                labelTx='invoiceScreen.labels.comment'
                value={values.comment}
                onChangeText={comment => setFieldValue("comment", comment)}
              />

              <View>
                <Button
                  disabled={!!Object.keys(errors).length}
                  tx='invoiceScreen.labels.invoiceForm'
                  textStyle={SUBMIT_BUTTON_TEXT_STYLE}
                  onPress={() => handleSubmit()}
                />
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
}
