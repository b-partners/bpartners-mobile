import React from 'react';
import { View } from 'react-native';

import { Button, Loader, Text } from '../../../components';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { SHADOW_STYLE } from '../../invoices/utils/styles';

export const ButtonActions = props => {
  const {
    isLoading,
    isCreating,
    isEditing,
    prospectStatus,
    selectedStatus,
    prospectFeedBack,
    currentPage,
    handleSubmit,
    onSubmit,
    handleAmountRender,
    closeModal,
    setCurrentPage,
  } = props;

  const getPrimaryButtonText = (status, feedback, currentStatus) => {
    if (isCreating) {
      return 'common.create';
    }

    if (isEditing) {
      return 'common.edit';
    }
    const statuses = {
      TO_CONTACT: {
        NOT_INTERESTED: 'prospectScreen.buttonActions.abandonProspect',
        CONTACTED: 'prospectScreen.buttonActions.bookProspect',
        CONVERTED: 'prospectScreen.buttonActions.convertProspectIntoCustomer',
      },
      CONTACTED: {
        PROPOSAL_DECLINED: 'prospectScreen.buttonActions.abandonProspect',
        TO_CONTACT: 'prospectScreen.buttonActions.freeUpProspect',
        CONVERTED: 'prospectScreen.buttonActions.convertProspectIntoCustomer',
      },
      CONVERTED: {
        PROPOSAL_DECLINED: 'prospectScreen.buttonActions.abandonProspect',
        TO_CONTACT: 'prospectScreen.buttonActions.freeUpProspect',
        CONTACTED: 'prospectScreen.buttonActions.convertCustomerIntoProspect',
      },
    };

    const defaultText = 'common.submit';

    if (statuses[status]) {
      const statusObj = statuses[status];
      if (statusObj[feedback]) {
        return statusObj[feedback];
      } else if (statusObj[currentStatus]) {
        return statusObj[currentStatus];
      }
    }

    return defaultText;
  };

  return (
    <>
      <Button
        tx={currentPage === 1 || isCreating ? 'common.cancel' : 'common.back'}
        style={{
          ...SHADOW_STYLE,
          backgroundColor: palette.secondaryColor,
          borderRadius: 10,
          paddingVertical: spacing[3],
          paddingHorizontal: spacing[2],
          width: 110,
          height: 40,
          marginRight: spacing[2],
        }}
        onPress={() => {
          currentPage === 1 || isCreating ? closeModal() : setCurrentPage(1);
        }}
        textStyle={{ fontSize: 13, fontFamily: 'Geometria-Bold' }}
      />
      {isLoading ? (
        <View style={{ paddingVertical: spacing[3], paddingHorizontal: spacing[2], width: 100, height: 40 }}>
          <Loader size={20} color={palette.secondaryColor} />
        </View>
      ) : prospectFeedBack === null && currentPage === 2 && !isCreating && !isEditing ? (
        <View
          style={{
            backgroundColor: palette.solidGrey,
            borderRadius: 10,
            paddingVertical: spacing[3],
            paddingHorizontal: spacing[2],
            width: 200,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text tx={getPrimaryButtonText(prospectStatus, prospectFeedBack, selectedStatus)} style={{ color: palette.lighterGrey }} />
        </View>
      ) : (
        <Button
          tx={currentPage === 1 && !isCreating ? 'common.next' : getPrimaryButtonText(prospectStatus, prospectFeedBack, selectedStatus)}
          style={{
            ...SHADOW_STYLE,
            backgroundColor: palette.secondaryColor,
            borderRadius: 10,
            paddingVertical: spacing[3],
            paddingHorizontal: spacing[2],
            width: 200,
            height: 40,
          }}
          onPress={currentPage !== 1 || isCreating ? handleSubmit(onSubmit) : handleAmountRender}
          textStyle={{ fontSize: 13, fontFamily: 'Geometria-Bold' }}
        />
      )}
    </>
  );
};
