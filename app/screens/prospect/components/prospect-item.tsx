import { DraftAreaPictureAnnotation, FileType, Prospect } from '@bpartners/typescript-client';
import React, { useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { Card, Paragraph, Portal, Title } from 'react-native-paper';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { default as MaterialCommunity, default as MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import { Text } from '../../../components';
import { useRouteParams, useSheetModal } from '../../../hook';
import { translate } from '../../../i18n';
import { prospectMapper } from '../../../mappers';
import { ProspectStatus } from '../../../models/entities/prospect/prospect';
import { useQueryProspectById } from '../../../queries';
import { color } from '../../../theme';
import { palette } from '../../../theme/palette';
import { getFileUrl } from '../../../utils/file-utils';
import { datePipe } from '../../../utils/pipes';
import { prospectItemStyles as styles } from '../utils/styles';
import { ProspectItemProps } from '../utils/utils';
import { ProcessModal } from './process-modal';
import { ProspectStatusModal } from './prospect-status-modal';

const IconGroup = {
  address: <EntypoIcon name='location-pin' size={18} color={color.palette.secondaryColor} />,
  email: <MaterialCommunity name='email' size={18} color={color.palette.green} />,
  phone: <MaterialCommunity name='phone' size={18} color={color.palette.orange} />,
  town: <MaterialCommunityIcons name='city' size={18} color={color.palette.lighterBlack} />,
  comment: <MaterialIcons name={'insert-comment'} size={18} color={color.palette.lighterBlack} />,
  rating: <EntypoIcon name='star' size={18} color={color.palette.lighterBlack} />,
  date: <Octicons name='clock' size={18} color={color.palette.lighterBlack} />,
};

export const ProspectItem: React.FC<ProspectItemProps> = props => {
  const { prospect: prospectOrAreaPicture, setCurrentStatus, menuItem, navigate } = props;
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<ProspectStatus | null>(null);
  const { open: openSheetModal, close: closeSheetModal } = useSheetModal();
  const { prospect: prospectByAreaPicture, queryProspectById } = useQueryProspectById();

  const prospect = prospectByAreaPicture || prospectOrAreaPicture;

  useEffect(() => {
    const prospectIdFromAreaPicture = (prospectOrAreaPicture as any)?.areaPicture?.prospectId;
    if (prospectIdFromAreaPicture) {
      queryProspectById(prospectIdFromAreaPicture);
    }
  }, [prospectOrAreaPicture]);

  useEffect(() => {
    status != null && setShowModal(true);
  }, [status]);

  const onEditing = () => {
    closeSheetModal();
    navigate('prospectForm', { prospect: prospectMapper.prospectToUpdateProspect(prospect as any as Prospect) });
  };

  const setRouteParams = useRouteParams(({ setParams }) => setParams);

  const handleEdit = async () => {
    if ((prospectOrAreaPicture as any)?.areaPicture?.prospectId) {
      const { areaPicture, id, annotations } = prospectOrAreaPicture as any as DraftAreaPictureAnnotation;
      const pictureUrl = await getFileUrl(areaPicture.fileId, FileType.AREA_PICTURE);
      setRouteParams('annotatorEdition', { areaPictureDetails: areaPicture, pictureUrl, annotations, draftAnnotationId: id });
      navigate('annotatorEdition');
      return;
    }
    openSheetModal(<ProspectStatusModal menuItems={menuItem} onEditing={onEditing} setStatus={setStatus} />, {
      containerStyle: { height: Dimensions.get('screen').height * 0.4 },
    });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.rowDirection}>
          <View style={{ width: '80%', display: 'flex', gap: 5, flexDirection: 'column' }}>
            <Title
              style={{
                fontSize: 16,
                color: palette.black,
                fontWeight: 'bold',
              }}
            >
              {prospect.name ? prospect.name : translate('common.noData')}
            </Title>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.address}</Paragraph>
              <Paragraph style={{ color: palette.black }}>{prospect.address ? <>{prospect.address}</> : translate('common.noData')}</Paragraph>
            </View>
            <View style={styles.cardBody}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.email}</Paragraph>
              <Paragraph style={{ color: palette.black }}>{prospect.email ? <>{prospect.email}</> : translate('common.noData')}</Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 2 }}>{IconGroup.phone}</Paragraph>
              <Paragraph style={{ color: palette.black }}>{prospect.phone ? <> {prospect.phone} </> : translate('common.noData')}</Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.town}</Paragraph>
              <Paragraph style={{ color: palette.black }}>{prospect.townCode ? <>{prospect.townCode}</> : translate('common.noData')}</Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.comment}</Paragraph>
              <Paragraph style={{ color: palette.black }}>{prospect.comment ? <>{prospect.comment}</> : translate('common.noData')}</Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.rating}</Paragraph>
              <Paragraph style={{ color: palette.black }}>
                {prospect.rating && prospect.rating.value > 0 ? <>{prospect.rating.value.toFixed()}</> : translate('common.noData')}
              </Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.date}</Paragraph>
              <Paragraph style={{ color: palette.black }}>
                {prospect.rating && prospect.rating.lastEvaluation ? <>{datePipe(prospect.rating.lastEvaluation).split(' ')[0]}</> : translate('common.noData')}
              </Paragraph>
            </View>
          </View>
          <View style={{ ...styles.menuContainer, marginBottom: 12 }}>
            <TouchableOpacity onPress={handleEdit}>
              <Text tx={'common.edit'} style={styles.editButton} />
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
      {showModal && (
        <Portal>
          <ProcessModal
            showModal={showModal}
            setShowModal={setShowModal}
            prospect={prospect as any}
            setCurrentStatus={setCurrentStatus}
            status={status}
            setStatus={setStatus}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </Portal>
      )}
    </View>
  );
};
