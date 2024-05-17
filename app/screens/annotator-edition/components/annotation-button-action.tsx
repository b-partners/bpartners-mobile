import React, { FC } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '../../../components';
import { styles } from '../utils/styles';

const AnnotationButtonAction: FC<any> = props => {
  const { validatePolygon, currentPolygonPoints, handleSubmit, startNewPolygon, setCurrentPolygonPoints, polygonLength, handleCancelAnnotation } = props;
  return (
    <View style={styles.buttonRowContainer}>
      <View style={styles.buttonColumnContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={validatePolygon(currentPolygonPoints) ? styles.button : styles.disabledButton}
            onPress={handleSubmit(startNewPolygon)}
            disabled={!validatePolygon(currentPolygonPoints)}
          >
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.buttonText} tx={'annotationScreen.process.validatePolygon'} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={currentPolygonPoints.length === 0 ? styles.disabledButton : styles.button}
            onPress={() => setCurrentPolygonPoints(prevPoints => prevPoints.slice(0, -1))}
            disabled={currentPolygonPoints.length === 0}
          >
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.buttonText} tx={'annotationScreen.process.removeLastPoint'} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonColumnContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={polygonLength === 0 ? styles.disabledButton : styles.button} onPress={handleCancelAnnotation} disabled={polygonLength === 0}>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.buttonText} tx={'annotationScreen.process.cancelAnnotation'} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={polygonLength === 0 ? styles.disabledButton : styles.button} onPress={() => {}} disabled={polygonLength === 0}>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.buttonText} tx={'annotationScreen.generateQuote'} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AnnotationButtonAction;
