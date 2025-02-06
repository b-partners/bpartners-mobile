import { ExportAreaPictureAnnotation } from '@bpartners/typescript-client';
import { useMutation } from '@tanstack/react-query';

import { annotatorProvider } from '../provider';
import { notify } from '../utils/snackbar';

export const useExportAnnotationToPdf = () => {
  const { mutate, isPending } = useMutation({ mutationFn: annotatorProvider.exportToPDF, mutationKey: ['download', 'exportAnnotation'] });

  const exportAsPdf = (exportAreaPictureAnnotation: ExportAreaPictureAnnotation) => {
    notify('Export du document en cours...', 'info');
    mutate(exportAreaPictureAnnotation);
  };

  return {
    exportAsPdf,
    isPending,
  };
};
