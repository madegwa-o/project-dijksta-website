import { useState, useEffect } from 'react';

const calculateDistance = (point1, point2) => {
    // Haversine formula for calculating distance between two points on Earth
    const toRad = (value) => (value * Math.PI) / 180;
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

const calculatePathDistance = (points) => {
    if (points.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
        totalDistance += calculateDistance(points[i], points[i + 1]);
    }

    return totalDistance;
};

export default function Map() {
    // Sample data points (coordinates)
    const [points, setPoints] = useState([
        { id: 1, name: "Location A", lat: 34.0522, lng: -118.2437 },
        { id: 2, name: "Location B", lat: 37.7749, lng: -122.4194 },
        { id: 3, name: "Location C", lat: 40.7128, lng: -74.0060 },
        { id: 4, name: "Location D", lat: 32.7767, lng: -96.7970 },
        { id: 5, name: "Location E", lat: 29.7604, lng: -95.3698 }
    ]);

    const [selectedPoints, setSelectedPoints] = useState([]);
    const [pathDistance, setPathDistance] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1);

    // Map dimensions
    const mapWidth = 800;
    const mapHeight = 500;

    // Calculate bounds for the map
    const minLat = Math.min(...points.map(p => p.lat)) - 2;
    const maxLat = Math.max(...points.map(p => p.lat)) + 2;
    const minLng = Math.min(...points.map(p => p.lng)) - 2;
    const maxLng = Math.max(...points.map(p => p.lng)) + 2;

    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;

    // Function to convert geographic coordinates to pixel coordinates
    const coordToPixels = (lat, lng) => {
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

    const handlePointSelection = (point) => {
        if (selectedPoints.find(p => p.id === point.id)) {
            // If already selected, remove it
            setSelectedPoints(selectedPoints.filter(p => p.id !== point.id));
        } else {
            // Add to selected points
            setSelectedPoints([...selectedPoints, point]);
        }
    };

    const resetSelection = () => {
        setSelectedPoints([]);
    };

    const isPointSelected = (pointId) => {
        return selectedPoints.some(p => p.id === pointId);
    };

    // Get index if point is in the path
    const getPointIndex = (pointId) => {
        const index = selectedPoints.findIndex(p => p.id === pointId);
        return index >= 0 ? index + 1 : null;
    };

    const handleZoomIn = () => {
        setZoomLevel(prev => prev * 1.2);
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(0.5, prev / 1.2));
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 bg-gray-100">
                <h1 className="text-xl font-bold">Interactive Map</h1>
                <div>
          <span className="mr-4">
            Total Distance: <strong>{pathDistance.toFixed(2)} km</strong>
          </span>
                    <button
                        onClick={resetSelection}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Reset Path
                    </button>
                </div>
            </div>

            <div className="flex flex-1">
                {/* Map Area */}
                <div className="w-3/4 bg-blue-50 relative p-4">
                    <div className="bg-blue-100 h-full rounded-lg border-2 border-blue-200 relative overflow-hidden">
                        {/* Map background with grid */}
                        <div className="absolute inset-0 bg-blue-50">
                            {/* Simplified map background with grid lines */}
                            <svg width="100%" height="100%" className="opacity-30">
                                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="gray" strokeWidth="0.5"/>
                                </pattern>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                            </svg>

                            {/* Longitude/Latitude labels */}
                            <div className="absolute bottom-2 left-2 text-xs text-gray-500">
                                Longitude: {minLng.toFixed(1)} to {maxLng.toFixed(1)}
                            </div>
                            <div className="absolute top-2 left-2 text-xs text-gray-500">
                                Latitude: {minLat.toFixed(1)} to {maxLat.toFixed(1)}
                            </div>
                        </div>

                        {/* Interactive Map */}
                        <div className="absolute inset-0 overflow-auto">
                            <div
                                className="relative"
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
                                            className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center cursor-pointer transition-all transform hover:scale-110 ${
                                                isSelected ? 'bg-green-500 text-white shadow-lg' : 'bg-red-500 text-white hover:bg-red-600'
                                            }`}
                                            style={{
                                                left: position.x,
                                                top: position.y
                                            }}
                                            onClick={() => handlePointSelection(point)}
                                            title={`${point.name} (${point.lat.toFixed(4)}, ${point.lng.toFixed(4)})`}
                                        >
                                            {pointIndex || ''}

                                            {/* Point label */}
                                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs text-gray-800 whitespace-nowrap font-bold">
                                                {point.name}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Map Controls */}
                        <div className="absolute bottom-4 right-4 flex flex-col">
                            <button
                                className="mb-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center"
                                onClick={handleZoomIn}
                            >
                                +
                            </button>
                            <button
                                className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center"
                                onClick={handleZoomOut}
                            >
                                -
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar with location list */}
                <div className="w-1/4 p-4 bg-gray-50 overflow-y-auto">
                    <h2 className="text-lg font-bold mb-4">Locations</h2>
                    <ul className="space-y-2">
                        {points.map((point) => {
                            const isSelected = isPointSelected(point.id);
                            const pointIndex = getPointIndex(point.id);

                            return (
                                <li
                                    key={point.id}
                                    className={`p-3 rounded cursor-pointer ${
                                        isSelected ? 'bg-green-100 border-l-4 border-green-500' : 'bg-white hover:bg-gray-100'
                                    }`}
                                    onClick={() => handlePointSelection(point)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="font-medium">{point.name}</span>
                                            <div className="text-xs text-gray-500">
                                                {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                                            </div>
                                        </div>
                                        {pointIndex && (
                                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                                                {pointIndex}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {selectedPoints.length > 1 && (
                        <div className="mt-6">
                            <h3 className="text-md font-bold mb-2">Path Details</h3>
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 text-left">From</th>
                                    <th className="p-2 text-left">To</th>
                                    <th className="p-2 text-right">Distance</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedPoints.map((point, index) => {
                                    if (index < selectedPoints.length - 1) {
                                        const nextPoint = selectedPoints[index + 1];
                                        const segmentDistance = calculateDistance(point, nextPoint);

                                        return (
                                            <tr key={`path-${index}`} className="border-b border-gray-200">
                                                <td className="p-2">{point.name}</td>
                                                <td className="p-2">{nextPoint.name}</td>
                                                <td className="p-2 text-right">{segmentDistance.toFixed(2)} km</td>
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