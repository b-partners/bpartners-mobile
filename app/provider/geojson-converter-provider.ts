import env from '../config/env';
import { Geojson, GeojsonReturn } from '../screens/annotator-edition/types';

const converterApiUrl = env.geoReferencerUrl;

export const pointsToGeoPoints = async (body: Geojson) => {
  try {
    const res = await fetch(converterApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body || {}),
    });
    if (res.status === 200) return (await res.json()) as GeojsonReturn[];
    return null;
  } catch (error) {
    console.log(`pointsToGeoPoints - ${error}`);
    return null;
  }
};
