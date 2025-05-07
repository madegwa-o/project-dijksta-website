import { useState, useEffect } from 'react';
import styles from './Maps.module.css';

type Point =  { id: number, name: string, lat: number, lng: number }


const calculateDistance = (point1: Point, point2: Point) => {
    // Haversine formula for calculating distance between two points on Earth
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km

    const dLat = toRad(point2.lat - point1.lat);
    const dLon = toRad(point2.lng - point1.lng);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    return distance;
};

const calculatePathDistance = (points: Point[]) => {
    if (points.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
        totalDistance += calculateDistance(points[i], points[i + 1]);
    }

    return totalDistance;
};

//some test points
const testPoints: Point[] = [
    { id: 1, name: "Safe stay", lat: 34.0522, lng: -118.2437 },
    { id: 2, name: "jilad", lat: 37.7749, lng: -122.4194 },
    { id: 3, name: "Blasmart", lat: 40.7128, lng: -74.0060 },
    { id: 4, name: "Havens", lat: 32.7767, lng: -96.7970 },
    { id: 5, name: "Ezzy Palace", lat: 29.7604, lng: -95.3698 }
]
export default function Map() {
    // Sample data points (coordinates)
    const [points, setPoints] = useState<Point[]>([]);
    const [selectedPoints, setSelectedPoints] = useState<Point[]>([]);
    const [pathDistance, setPathDistance] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1);

    useEffect(() => {
        setPoints(testPoints);
    }, []);

    // Map dimensions
    const mapWidth = 500;
    const mapHeight = 500;

    // Calculate bounds for the map
    const minLat = Math.min(...points.map(p => p.lat)) - 2;
    const maxLat = Math.max(...points.map(p => p.lat)) + 2;
    const minLng = Math.min(...points.map(p => p.lng)) - 2;
    const maxLng = Math.max(...points.map(p => p.lng)) + 2;

    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;

    // Function to convert geographic coordinates to pixel coordinates
    const coordToPixels = (lat: number, lng: number) => {
        // Apply zoom factor
        const zoomFactor = zoomLevel;

        // Calculate position as percentage of range
        const x = ((lng - minLng) / lngRange) * mapWidth * zoomFactor;
        const y = ((maxLat - lat) / latRange) * mapHeight * zoomFactor;

        return { x, y };
    };

    useEffect(() => {
        // Calculate the distance whenever selected points change
        const distance = calculatePathDistance(selectedPoints);
        setPathDistance(distance);
    }, [selectedPoints]);

    const handlePointSelection = (point: Point) => {
        if (selectedPoints.find((p: Point) => p.id === point.id)) {
            // If already selected, remove it
            setSelectedPoints(selectedPoints.filter((p: Point) => p.id !== point.id));
        } else {
            // Add to selected points
            setSelectedPoints([...selectedPoints, point]);
        }
    };

    const resetSelection = () => {
        setSelectedPoints([]);
    };

    const isPointSelected = (pointId: number) => {
        return selectedPoints.some((p:Point) => p.id === pointId);
    };

    // Get index if point is in the path
    const getPointIndex = (pointId: number) => {
        const index = selectedPoints.findIndex((p: Point) => p.id === pointId);
        return index >= 0 ? index + 1 : null;
    };

    const handleZoomIn = () => {
        setZoomLevel(prev => prev * 1.2);
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(0.5, prev / 1.2));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Interactive Map</h1>
                <div>
                    <span className={styles.distanceInfo}>
                        Total Distance: <strong>{pathDistance.toFixed(2)} km</strong>
                    </span>
                    <button
                        onClick={resetSelection}
                        className={styles.resetButton}
                    >
                        Reset Path
                    </button>
                </div>
            </div>

            <div className={styles.mapContainer}>
                {/* Map Area */}
                <div className={styles.mapArea}>
                    <div className={styles.mapCanvas}>
                        {/* Map background with grid */}
                        <div className={styles.mapBackground}>
                            {/* Simplified map background with grid lines */}
                            <svg width="100%" height="100%" className="opacity-30">
                                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="gray" strokeWidth="0.5"/>
                                </pattern>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                            </svg>

                            {/* Longitude/Latitude labels */}
                            <div className={styles.lngLabel}>
                                Longitude: {minLng.toFixed(1)} to {maxLng.toFixed(1)}
                            </div>
                            <div className={styles.latLabel}>
                                Latitude: {minLat.toFixed(1)} to {maxLat.toFixed(1)}
                            </div>
                        </div>

                        {/* Interactive Map */}
                        <div className={styles.interactiveMapContainer}>
                            <div
                                className={styles.interactiveMap}
                                style={{
                                    width: `${mapWidth * zoomLevel}px`,
                                    height: `${mapHeight * zoomLevel}px`
                                }}
                            >
                                {/* Map lines connecting selected points */}
                                <svg width={mapWidth * zoomLevel} height={mapHeight * zoomLevel} className="absolute top-0 left-0">
                                    {selectedPoints.length > 1 && selectedPoints.map((point, index) => {
                                        if (index < selectedPoints.length - 1) {
                                            const start = coordToPixels(point.lat, point.lng);
                                            const end = coordToPixels(selectedPoints[index + 1].lat, selectedPoints[index + 1].lng);

                                            return (
                                                <g key={`path-${index}`}>
                                                    <line
                                                        x1={start.x}
                                                        y1={start.y}
                                                        x2={end.x}
                                                        y2={end.y}
                                                        stroke="blue"
                                                        strokeWidth="2"
                                                        strokeDasharray="5,5"
                                                    />
                                                    {/* Distance label */}
                                                    <text
                                                        x={(start.x + end.x) / 2}
                                                        y={(start.y + end.y) / 2 - 10}
                                                        fill="blue"
                                                        fontSize="12"
                                                        textAnchor="middle"
                                                        className="bg-white px-1"
                                                    >
                                                        {calculateDistance(point, selectedPoints[index + 1]).toFixed(1)} km
                                                    </text>
                                                </g>
                                            );
                                        }
                                        return null;
                                    })}
                                </svg>

                                {/* Map Points */}
                                {points.map((point) => {
                                    const position = coordToPixels(point.lat, point.lng);
                                    const isSelected = isPointSelected(point.id);
                                    const pointIndex = getPointIndex(point.id);

                                    return (
                                        <div
                                            key={point.id}
                                            className={`${styles.mapPoint} ${isSelected ? styles.mapPointSelected : styles.mapPointDefault}`}
                                            style={{
                                                left: position.x,
                                                top: position.y
                                            }}
                                            onClick={() => handlePointSelection(point)}
                                            title={`${point.name} (${point.lat.toFixed(4)}, ${point.lng.toFixed(4)})`}
                                        >
                                            {pointIndex || ''}

                                            {/* Point label */}
                                            <div className={styles.pointLabel}>
                                                {point.name}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Map Controls */}
                        <div className={styles.mapControls}>
                            <button
                                className={`${styles.zoomButton} ${styles.zoomInButton}`}
                                onClick={handleZoomIn}
                            >
                                +
                            </button>
                            <button
                                className={styles.zoomButton}
                                onClick={handleZoomOut}
                            >
                                -
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar with location list */}
                <div className={styles.sidebar}>
                    <h2 className={styles.sidebarTitle}>Locations</h2>
                    <ul className={styles.locationsList}>
                        {points.map((point) => {
                            const isSelected = isPointSelected(point.id);
                            const pointIndex = getPointIndex(point.id);

                            return (
                                <li
                                    key={point.id}
                                    className={`${styles.locationItem} ${isSelected ? styles.locationItemSelected : styles.locationItemDefault}`}
                                    onClick={() => handlePointSelection(point)}
                                >
                                    <div className={styles.locationItemContent}>
                                        <div>
                                            <span className={styles.locationName}>{point.name}</span>
                                            <div className={styles.locationCoords}>
                                                {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                                            </div>
                                        </div>
                                        {pointIndex && (
                                            <div className={styles.locationIndex}>
                                                {pointIndex}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {selectedPoints.length > 1 && (
                        <div className={styles.pathDetails}>
                            <h3 className={styles.pathDetailsTitle}>Path Details</h3>
                            <table className={styles.pathTable}>
                                <thead>
                                <tr className={styles.pathTableHeader}>
                                    <th className={styles.pathTableHeaderCell}>From</th>
                                    <th className={styles.pathTableHeaderCell}>To</th>
                                    <th className={styles.pathTableHeaderCellRight}>Distance</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedPoints.map((point, index) => {
                                    if (index < selectedPoints.length - 1) {
                                        const nextPoint = selectedPoints[index + 1];
                                        const segmentDistance = calculateDistance(point, nextPoint);

                                        return (
                                            <tr key={`path-${index}`} className={styles.pathTableRow}>
                                                <td className={styles.pathTableCell}>{point.name}</td>
                                                <td className={styles.pathTableCell}>{nextPoint.name}</td>
                                                <td className={styles.pathTableCellRight}>{segmentDistance.toFixed(2)} km</td>
                                            </tr>
                                        );
                                    }
                                    return null;
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
