import { Text } from '../../../components';
import { translate } from '../../../i18n';
import { ProspectStatus } from '../../../models/entities/prospect/prospect';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { datePipe } from '../../../utils/pipes';
import { prospectItemStyles as styles } from '../utils/styles';
import { ProspectItemProps } from '../utils/utils';
import { ProcessModal } from './process-modal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Card, Button as IButton, Paragraph, Portal, Title } from 'react-native-paper';
import Popover from 'react-native-popover-view';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';

const IconGroup = {
  email: <MaterialCommunity name='email' size={18} color={color.palette.secondaryColor} />,
  phone: <MaterialCommunity name='phone' size={18} color={color.palette.secondaryColor} />,
  address: <EntypoIcon name='home' size={18} color={color.palette.secondaryColor} />,
  town: <MaterialCommunityIcons name='city' size={18} color={color.palette.secondaryColor} />,
  comment: <MaterialIcons name={'insert-comment'} size={18} color={color.palette.secondaryColor} />,
  rating: <EntypoIcon name='star' size={18} color={color.palette.secondaryColor} />,
  date: <Octicons name='clock' size={18} color={color.palette.secondaryColor} />,
};

export const ProspectItem: React.FC<ProspectItemProps> = props => {
  const { prospect, setCurrentStatus, menuItem } = props;
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);
  const [status, setStatus] = useState<ProspectStatus | null>(null);

  useEffect(() => {
    status != null && setShowModal(true);
  }, [status]);

  const onEditing = () => {
    setShowModal(true);
    setIsEditing(true);
    setIsPopOverOpen(false);
  };

  const openPopover = () => {
    setIsPopOverOpen(true);
  };

  const closePopover = () => {
    setIsPopOverOpen(false);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.rowDirection}>
          <View style={{ width: '80%' }}>
            <Title
              style={{
                fontSize: 16,
                color: palette.black,
              }}
            >
              {prospect.name ? prospect.name : translate('common.noData')}
            </Title>
            <View style={styles.cardBody}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.email}</Paragraph>
              <Paragraph style={{ color: palette.black }}>{prospect.email ? <>{prospect.email}</> : translate('common.noData')}</Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 2 }}>{IconGroup.phone}</Paragraph>
              <Paragraph style={{ color: palette.black }}>{prospect.phone ? <> {prospect.phone} </> : translate('common.noData')}</Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.address}</Paragraph>
              <Paragraph style={{ color: palette.black }}>{prospect.address ? <>{prospect.address}</> : translate('common.noData')}</Paragraph>
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
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.comment}</Paragraph>
              <Paragraph>{prospect.comment ? <>{prospect.comment}</> : translate('common.noData')}</Paragraph>
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
          <View style={styles.menuContainer}>
            <Popover
              isVisible={isPopOverOpen}
              onRequestClose={closePopover}
              from={
                <TouchableOpacity onPress={openPopover}>
                  <Text tx={'common.edit'} style={styles.editButton} />
                </TouchableOpacity>
              }
            >
              <View style={styles.popOverContainer}>
                <Text
                  tx={'prospectScreen.process.onProspectChangingStatus'}
                  style={{
                    color: palette.black,
                    padding: spacing[3],
                    textAlign: 'center',
                  }}
                />
                {menuItem.map(item => {
                  return (
                    <IButton
                      key={item.id}
                      compact={true}
                      buttonColor={palette.secondaryColor}
                      textColor={palette.white}
                      style={styles.processButton}
                      onPress={() => {
                        setStatus(ProspectStatus[item.label]);
                        closePopover();
                      }}
                    >
                      <Text text={item.title} style={styles.processButtonText} />
                    </IButton>
                  );
                })}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ ...styles.separatorCommonStyle, marginLeft: spacing[4] }} />
                  <View>
                    <Text
                      style={{
                        color: palette.black,
                        padding: spacing[2],
                        textAlign: 'center',
                      }}
                      tx={'common.or'}
                    />
                  </View>
                  <View style={{ ...styles.separatorCommonStyle, marginRight: spacing[4] }} />
                </View>
                <IButton compact={true} buttonColor={palette.secondaryColor} textColor={palette.white} style={styles.processButton} onPress={onEditing}>
                  <Text tx={'prospectScreen.process.editProspect'} style={styles.processButtonText} />
                </IButton>
              </View>
            </Popover>
          </View>
        </Card.Content>
      </Card>
      {showModal && (
        <Portal>
          <ProcessModal
            showModal={showModal}
            setShowModal={setShowModal}
            prospect={prospect}
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
