import { Geojson, GeojsonReturn } from '../screens/annotator-edition/types';

const converterApiUrl = 'https://tile-referencer.azurewebsites.net/api/reference';

export const pointsToGeoPoints = async (body: Geojson) => {
  try {
    const res = await fetch(converterApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return (await res.json()) as GeojsonReturn[];
  } catch (error) {
    console.log(error);
    return null;
  }
};
