import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Alert, Modal, SafeAreaView, View, ViewStyle } from "react-native";

import { Button, Checkbox, PDFView, Screen, Text } from "../../../components";
import { LegalFileStore } from "../../../models/stores/legal-file-store/legal-file-store";
import { spacing } from "../../../theme";
import { CheckboxProps } from "../../../components/checkbox/checkbox.props";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { palette } from "../../../theme/palette";

interface ILegalFileView {
  legalFile: LegalFileStore;
}

const PDF_CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: "flex-start",
  alignItems: "center",
  margin: spacing[48]
};

const CHECKBOX_CONTAINER: ViewStyle = {
  flexDirection: "row",
  marginVertical: spacing[4]
};

const CHECKBOX_STYLE: CheckboxProps["style"] = {
  alignSelf: "flex-end",
  marginLeft: spacing[2]
};
const FOOTER_CONTENT: ViewStyle = {
  alignItems: "flex-end",
  paddingRight: spacing[6],
  paddingBottom: spacing[6]
};

const CONTINUE_BUTTON_STYLE: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: spacing[2],
  backgroundColor: palette["deepPurple"]
};

export const LegalFileView = observer(function LegalFileView(props: ILegalFileView) {
  const { legalFile } = props;
  const { approvalDatetime, id } = legalFile;
  const [showCGU, setShowCGU] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPageNumber, setLastPageNumber] = useState<number>(1);
  const [contentLoaded, setContentLoaded] = useState<boolean>(false);


  useEffect(() => {
    if (!approvalDatetime) return setShowCGU(true);
    setShowCGU(false);
  }, [approvalDatetime]);

  const acceptCGUAndContinue = async () => {
    await legalFile.approveLegalFile(id);
    setShowCGU(false);
  };

  const source = { uri: legalFile?.fileUrl, cache: true };

  function handleLoaCompletedState(numberOfPages: number) {
    setContentLoaded(true);
    setLastPageNumber(numberOfPages);
    console.log(contentLoaded, currentPage, numberOfPages);
  }

  return (
    <Modal
      statusBarTranslucent={false}
      animationType='slide'
      visible={showCGU}
      onRequestClose={() => {
        if (approvalDatetime) setShowCGU(false);
        Alert.alert("Accept the CGU to continue");
      }}
    >
      <Screen>
        <View style={PDF_CONTAINER}>
          <Text text={`${currentPage}/${lastPageNumber}`} style={{ color: "black", position: "absolute" }} />
          <PDFView source={source}
                   onPageChanged={(page) => setCurrentPage(page)}
                   onLoadComplete={handleLoaCompletedState}
          />
        </View>
      </Screen>

      <SafeAreaView>
        <View style={FOOTER_CONTENT}>
          <View style={CHECKBOX_CONTAINER}>
            <Text text={"Accept"} style={{ color: "black" }} />
            <Checkbox onToggle={() => setAccepted(!accepted)} value={accepted} style={CHECKBOX_STYLE} />
          </View>

          <Button onPress={acceptCGUAndContinue} disabled={!accepted} style={CONTINUE_BUTTON_STYLE}>
            <Text text='Continue' style={{
              marginHorizontal: spacing[2],
              color: accepted ? palette["white"] : palette["lighterGrey"]
            }} />
            <MaterialCommunityIcons name='arrow-right-circle' size={24}
                                    color={accepted ? palette["white"] : palette["lighterGrey"]} />
          </Button>
        </View>
      </SafeAreaView>
    </Modal>);
});
