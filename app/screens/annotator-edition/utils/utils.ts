export const getPolygonName = (index) => {
    const letter = String.fromCharCode(65 + index);
    return `Polygon ${letter}`;
};

export const calculateCentroid = (polygonPoints) => {
    const numPoints = polygonPoints.length;
    let sumX = 0;
    let sumY = 0;

    for (const point of polygonPoints) {
        sumX += point.x;
        sumY += point.y;
    }

    const centroidX = sumX / numPoints;
    const centroidY = sumY / numPoints;

    return { x: centroidX, y: centroidY };
};
