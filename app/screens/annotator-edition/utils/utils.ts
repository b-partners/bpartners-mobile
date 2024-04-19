export const getPolygonName = (index) => {
    const letter = String.fromCharCode(65 + index);
    return `Polygon ${letter}`;
};

// Calculate the distance between two polygon's points
export const calculateDistance = (point1, point2) => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
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
