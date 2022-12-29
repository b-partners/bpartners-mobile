import React from 'react';
import { Dimensions, ViewStyle } from 'react-native';
import Pdf from 'react-native-pdf';

type TSource = { uri: string; cache?: boolean } | number;

interface IPDFView {
  source: TSource;
  onLoadProgress?: (percent: number) => void;
  onLoadComplete?: (numberOfPages?: number, path?: string) => void;
  onError?: (error) => any;
  onPageChanged?: (page: number, numberOfPages: number) => void;
  style?: ViewStyle;
  renderActivityIndicator: (progress?: number) => React.ReactElement;
}

export function PDFView(props: IPDFView) {
  const { source, onPageChanged, onLoadComplete, onError, style, onLoadProgress, renderActivityIndicator } = props;

  return (
    <Pdf
      enablePaging={true}
      trustAllCerts={false}
      source={source}
      onLoadComplete={onLoadComplete}
      onPageChanged={onPageChanged}
      onError={onError}
      style={[PDF_STYLE, style]}
      onLoadProgress={onLoadProgress}
      renderActivityIndicator={renderActivityIndicator}
    />
  );
}

const PDF_STYLE: ViewStyle = {
  flex: 1,
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
