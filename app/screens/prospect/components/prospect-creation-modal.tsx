import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Modal } from 'react-native-paper';
import uuid from 'react-native-uuid';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { v4 as uuidv4 } from 'uuid';

import { Text } from '../../../components';
import { BpInput } from '../../../components/bp-input';
import { KeyboardLayout } from '../../../components/keyboard-layout/KeyboardLayout';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { ZoomLevel } from '../../../models/entities/area-picture/area-picture';
import { navigate } from '../../../navigators/navigation-utilities';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { useProspectInfoForm } from '../../../utils/resolvers';
import { showMessage } from '../../../utils/snackbar';
import { ProspectCreationModalProps, ProspectFeedback } from '../utils/utils';
import { ButtonActions } from './button-action';
import { ProspectCreationStyle } from './style';

export const ProspectCreationModal: React.FC<ProspectCreationModalProps> = props => {
  const { showModal, setShowModal, status, setStatus } = props;

  const { prospectStore, areaPictureStore } = useStores();

  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const [current, setCurrent] = React.useState<ProspectFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const closeModal = () => {
    setStatus(null);
    setCurrent(null);
    setCurrentPage(1);
    setShowModal(false);
  };

  const form = useProspectInfoForm();

  const handleAmountRender = () => {
    setCurrentPage(2);
  };

  const onSubmit = async prospectInfos => {
    setIsLoading(true);
    const prospectId = uuidv4();
    const fileId = uuid.v4();
    try {
      await prospectStore.creationProspect({
        id: prospectId,
        status: 'TO_CONTACT',
        ...prospectInfos,
      });
      showMessage(translate('common.added'), { backgroundColor: palette.green });
      await areaPictureStore.getAreaPictureFile(prospectId, prospectInfos.address, fileId as string, ZoomLevel.HOUSES_0, false);
      await areaPictureStore.getPictureUrl(fileId as string);
      navigate('annotatorEdition');
    } catch {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.yellow });
    } finally {
      setIsLoading(false);
      closeModal();
      await prospectStore.getProspects();
    }
  };

  return (
    <KeyboardLayout setKeyboardOpen={setKeyboardOpen}>
      <Modal visible={showModal} dismissableBackButton={true} onDismiss={closeModal} style={ProspectCreationStyle.modal(keyboardOpen)}>
        <ScrollView style={ProspectCreationStyle.scrollViewContainer}>
          <View style={ProspectCreationStyle.headerContainer}>
            <View style={ProspectCreationStyle.headerTitleContainer}>
              <Text text='Prospect : ' style={ProspectCreationStyle.headerTitle} />
              <Text text='' style={ProspectCreationStyle.headerTitle} />
            </View>
            <TouchableOpacity onPress={closeModal} style={ProspectCreationStyle.closeButton}>
              <AntDesignIcon name='close' color={color.palette.lightGrey} size={20} />
            </TouchableOpacity>
          </View>
          {currentPage === 1 && (
            <FormProvider {...form}>
              <View style={{ flex: 1, paddingHorizontal: spacing[4], paddingTop: spacing[2] }}>
                <BpInput name='address' labelTx='prospectScreen.process.address' />
                <BpInput name='name' labelTx='prospectScreen.process.name' />
                <BpInput name='firstName' labelTx='prospectScreen.process.firstName' />
                <BpInput name='email' labelTx='prospectScreen.process.email' />
                <BpInput name='phone' labelTx='prospectScreen.process.phone' />
                <BpInput multiline name='comment' labelTx='prospectScreen.process.comment' />
              </View>
            </FormProvider>
          )}
          <View style={ProspectCreationStyle.actionContainer}>
            <ButtonActions
              isLoading={isLoading}
              isCreating={true}
              prospectStatus={status}
              selectedStatus={status}
              prospectFeedBack={current}
              currentPage={currentPage}
              handleSubmit={form.handleSubmit}
              onSubmit={onSubmit}
              handleAmountRender={handleAmountRender}
              closeModal={closeModal}
              setCurrentPage={setCurrentPage}
            />
          </View>
        </ScrollView>
      </Modal>
    </KeyboardLayout>
  );
};
