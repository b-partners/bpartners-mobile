import * as Font from 'expo-font';

export const initFonts = async () => {
  await Font.loadAsync({
    Geometria: require('./Geometria/Geometria.ttf'),
    'Geometria-Bold': require('./Geometria/Geometria-Bold.ttf'),
    'Geometria-BoldItalic': require('./Geometria/Geometria-BoldItalic.ttf'),
    'Geometria-ExtraBold': require('./Geometria/Geometria-ExtraBold.ttf'),
    'Geometria-ExtraBoldItalic': require('./Geometria/Geometria-ExtraBoldItalic.ttf'),
    'Geometria-ExtraLight': require('./Geometria/Geometria-ExtraLight.ttf'),
    'Geometria-ExtraLightItalic': require('./Geometria/Geometria-ExtraLightItalic.ttf'),
    'Geometria-Heavy': require('./Geometria/Geometria-Heavy.ttf'),
    'Geometria-HeavyItalic': require('./Geometria/Geometria-HeavyItalic.ttf'),
    'Geometria-Light': require('./Geometria/Geometria-Light.ttf'),
    'Geometria-LightItalic': require('./Geometria/Geometria-LightItalic.ttf'),
    'Geometria-Medium': require('./Geometria/Geometria-Medium.ttf'),
    'Geometria-MediumItalic': require('./Geometria/Geometria-MediumItalic.ttf'),
    'Geometria-Thin': require('./Geometria/Geometria-Thin.ttf'),
    'Geometria-ThinItalic': require('./Geometria/Geometria-ThinItalic.ttf'),
  });
};
