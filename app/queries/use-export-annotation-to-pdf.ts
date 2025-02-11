import { ExportAreaPictureAnnotation } from '@bpartners/typescript-client';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import FileViewer from 'react-native-file-viewer';

import { annotatorProvider } from '../provider';
import { notify } from '../utils/snackbar';

export const useExportAnnotationToPdf = () => {
  const { mutate, isPending, data } = useMutation({ mutationFn: annotatorProvider.exportToPDF, mutationKey: ['download', 'exportAnnotation'] });

  const { fileName, filePath } = data || {};

  const openFile = async () => {
    await FileViewer.open(`file://${filePath}`);
  };

  useEffect(() => {}, []);

  const showNotification = async () => {
    if (Platform.OS === 'android') {
      const channelId = await notifee.createChannel({
        id: 'export_annotation',
        name: 'Export annotation notification',
        lights: false,
        vibration: true,
        importance: AndroidImportance.HIGH,
      });

      await notifee.requestPermission();

      await notifee.displayNotification({
        title: 'Export terminer',
        body: `Cliquez pour ouvrir le fichier ${fileName}`,
        android: {
          channelId,
          smallIcon: 'ic_launcher_adaptive_fore',
        },
      });
    } else {
      notify('Document exporté avec succès.', 'success');
    }
  };

  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS && detail?.notification?.title === 'Export terminer') {
      openFile();
    }
  });

  const exportAsPdf = (exportAreaPictureAnnotation: ExportAreaPictureAnnotation) => {
    notify('Export du document en cours...', 'info');
    mutate(exportAreaPictureAnnotation);
  };

  useEffect(() => {
    if (filePath) {
      showNotification();
    }
  }, [filePath]);

  return {
    exportAsPdf,
    isPending,
  };
};
