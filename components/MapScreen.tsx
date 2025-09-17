import React, { useState, useMemo } from 'react';
import { WaterSource, HealthCenter, WaterSourceStatus, HealthCenterType, Page } from '../types';
import { WATER_SOURCES, HEALTH_CENTERS } from '../constants';
import Card from './Card';
import { MapPinIcon, PhoneIcon, ClockIcon, SearchIcon, CloseIcon } from './icons';
import { CheckCircleIcon, ExclamationTriangleIcon, NoSymbolIcon } from './icons';

type MapItem = (WaterSource & { itemType: 'water' }) | (HealthCenter & { itemType: 'health' });

interface Cluster {
  itemType: 'cluster';
  id: string;
  lat: number;
  lng: number;
  items: MapItem[];
  count: number;
}

type MapDisplayItem = MapItem | Cluster;

const getPosition = (lat: number, lng: number) => ({
    top: `${(26.16 - lat) * 2000}%`,
    left: `${(lng - 91.72) * 2000}%`,
});

const MapPin: React.FC<{ item: MapItem, onClick: () => void }> = ({ item, onClick }) => {
    const position = getPosition(item.lat, item.lng);

    let color = 'text-gray-500';
    if(item.itemType === 'water') {
        switch(item.status) {
            case WaterSourceStatus.Safe: color = 'text-status-safe'; break;
            case WaterSourceStatus.Warning: color = 'text-status-warning'; break;
            case WaterSourceStatus.Unsafe: color = 'text-status-unsafe'; break;
        }
    } else {
        switch(item.type) {
            case HealthCenterType.Hospital: color = 'text-red-500'; break;
            case HealthCenterType.Clinic: color = 'text-blue-500'; break;
            case HealthCenterType.Doctor: color = 'text-green-600'; break;
            case HealthCenterType.Pharmacy: color = 'text-purple-500'; break;
        }
    }

    return (
        <div 
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-transform hover:scale-110"
            style={position}
            onClick={onClick}
        >
            <MapPinIcon className={`w-10 h-10 ${color} drop-shadow-lg`} />
        </div>
    );
};

const ClusterPin: React.FC<{ cluster: Cluster, onClick: () => void }> = ({ cluster, onClick }) => {
    const position = getPosition(cluster.lat, cluster.lng);
    const size = 32 + Math.min(cluster.count * 2, 28); // Dynamic size from 32px to 60px

    return (
        <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={position}
            onClick={onClick}
        >
            <div 
                className="rounded-full bg-brand-primary bg-opacity-80 text-white flex items-center justify-center font-bold border-2 border-white shadow-lg transition-transform hover:scale-110"
                style={{ width: `${size}px`, height: `${size}px`, fontSize: `${12 + Math.min(cluster.count, 8)}px` }}
            >
                {cluster.count}
            </div>
        </div>
    );
};

interface DetailCardProps {
  item: MapDisplayItem;
  t: (key: string) => string;
  onSelectItem: (item: MapItem) => void;
  onClose: () => void;
}

const DetailCard: React.FC<DetailCardProps> = ({ item, t, onSelectItem, onClose }) => {
    const CloseButton = () => (
        <button 
            onClick={onClose} 
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
            aria-label="Close details"
        >
            <CloseIcon className="w-6 h-6" />
        </button>
    );
    
    if (item.itemType === 'cluster') {
        return (
            <Card className="p-4 relative">
                <CloseButton />
                <h3 className="font-bold text-lg text-brand-dark pr-8">Cluster ({item.count} items)</h3>
                <ul className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                    {item.items.map(subItem => (
                        <li 
                            key={`${subItem.itemType}-${subItem.id}`}
                            onClick={() => onSelectItem(subItem)}
                            className="p-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm font-medium text-gray-700"
                        >
                           {subItem.itemType === 'water' && (
                                <span className={`text-xs ${
                                    subItem.status === WaterSourceStatus.Safe ? 'text-status-safe' : 
                                    subItem.status === WaterSourceStatus.Warning ? 'text-status-warning' : 'text-status-unsafe'
                                }`}>● </span>
                            )}
                            {subItem.itemType === 'health' && <span className="text-xs text-blue-500">● </span>}
                            {subItem.name} 
                        </li>
                    ))}
                </ul>
            </Card>
        )
    }

    if (item.itemType === 'water') {
        const { textColor, Icon } = 
            item.status === WaterSourceStatus.Safe ? { textColor: 'text-status-safe', Icon: CheckCircleIcon } :
            item.status === WaterSourceStatus.Warning ? { textColor: 'text-status-warning', Icon: ExclamationTriangleIcon } :
            { textColor: 'text-status-unsafe', Icon: NoSymbolIcon };
        return (
            <Card className="p-4 relative">
                <CloseButton />
                <h3 className="font-bold text-lg text-brand-dark pr-8">{item.name}</h3>
                <div className={`flex items-center space-x-2 mt-2 font-semibold ${textColor}`}>
                    <Icon className="w-6 h-6" />
                    <span>{t(`status_${item.status.toLowerCase()}`)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{t('last_checked')}: {item.lastChecked}</p>
            </Card>
        )
    }
    
    // Health Center
    return (
         <Card className="p-4 relative">
            <CloseButton />
            <h3 className="font-bold text-lg text-brand-dark pr-8">{item.name}</h3>
            <p className="font-semibold text-brand-secondary">{item.type}</p>
            <div className="text-sm text-gray-600 mt-2 space-y-1">
                <div className="flex items-center space-x-2">
                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                    <span>{item.contact}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span>{item.hours}</span>
                </div>
            </div>
        </Card>
    );
}

const MapScreen: React.FC<{ t: (key: string) => string }> = ({ t }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<MapDisplayItem | null>(null);
    const [mapView, setMapView] = useState({ scale: 1, x: 0, y: 0 });

    const allItems: MapItem[] = useMemo(() => [
        ...WATER_SOURCES.map(ws => ({...ws, itemType: 'water' as const})),
        ...HEALTH_CENTERS.map(hc => ({...hc, itemType: 'health' as const})),
    ], []);

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return allItems;
        return allItems.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, allItems]);
    
    const clusteredItems: MapDisplayItem[] = useMemo(() => {
        const CLUSTER_RADIUS = 0.008;
        const points = [...filteredItems];
        const clustersAndPoints: MapDisplayItem[] = [];
        const visited = new Set<number>();

        for(let i = 0; i < points.length; i++) {
            if (visited.has(points[i].id)) continue;

            const clusterItems: MapItem[] = [points[i]];
            visited.add(points[i].id);

            for (let j = i + 1; j < points.length; j++) {
                if (visited.has(points[j].id)) continue;
                
                const distance = Math.sqrt(Math.pow(points[i].lat - points[j].lat, 2) + Math.pow(points[i].lng - points[j].lng, 2));

                if (distance < CLUSTER_RADIUS) {
                    clusterItems.push(points[j]);
                    visited.add(points[j].id);
                }
            }

            if (clusterItems.length > 1) {
                const avgLat = clusterItems.reduce((sum, item) => sum + item.lat, 0) / clusterItems.length;
                const avgLng = clusterItems.reduce((sum, item) => sum + item.lng, 0) / clusterItems.length;
                clustersAndPoints.push({
                    itemType: 'cluster',
                    id: `cluster-${points[i].id}`,
                    lat: avgLat,
                    lng: avgLng,
                    items: clusterItems,
                    count: clusterItems.length
                });
            } else {
                clustersAndPoints.push(points[i]);
            }
        }
        return clustersAndPoints;
    }, [filteredItems]);

    const handleClusterClick = (cluster: Cluster) => {
        setSelectedItem(cluster);

        const PADDING = 0.9;
        const lats = cluster.items.map(i => i.lat);
        const lngs = cluster.items.map(i => i.lng);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        const latRange = maxLat - minLat;
        const lngRange = maxLng - minLng;

        if (latRange === 0 && lngRange === 0) {
            const newScale = 5;
            const centerXPercent = (minLng - 91.72) * 2000;
            const centerYPercent = (26.16 - minLat) * 2000;
            const newX = 50 - centerXPercent * newScale;
            const newY = 50 - centerYPercent * newScale;
            setMapView({ scale: newScale, x: newX, y: newY });
            return;
        }

        const scaleX = lngRange > 0 ? (100 * PADDING) / (lngRange * 2000) : Infinity;
        const scaleY = latRange > 0 ? (100 * PADDING) / (latRange * 2000) : Infinity;
        const newScale = Math.min(scaleX, scaleY, 10);
        const centerLat = minLat + latRange / 2;
        const centerLng = minLng + lngRange / 2;
        const centerXPercent = (centerLng - 91.72) * 2000;
        const centerYPercent = (26.16 - centerLat) * 2000;
        const newX = 50 - centerXPercent * newScale;
        const newY = 50 - centerYPercent * newScale;
        setMapView({ scale: newScale, x: newX, y: newY });
    };

    const resetView = () => {
        setMapView({ scale: 1, x: 0, y: 0 });
        setSelectedItem(null);
    };
    
    return (
        <div className="p-4 flex flex-col">
            <h2 className="text-xl font-bold text-brand-dark mb-4">{t('map')}</h2>
            
            <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                </span>
                <input 
                    type="text"
                    placeholder="Search sources or health centers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                />
            </div>

            <div className="relative w-full h-[55vh] bg-brand-light rounded-lg overflow-hidden shadow-inner">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30" 
                    style={{ backgroundImage: `url('https://picsum.photos/800/600?grayscale&blur=2')` }}
                ></div>

                <div
                    className="absolute inset-0 transition-transform duration-500 ease-in-out"
                    style={{ 
                        transform: `translate(${mapView.x}%, ${mapView.y}%) scale(${mapView.scale})`,
                        transformOrigin: 'top left' 
                    }}
                >
                    {clusteredItems.map(item => {
                        if (item.itemType === 'cluster') {
                            return <ClusterPin key={item.id} cluster={item} onClick={() => handleClusterClick(item)} />;
                        }
                        return <MapPin key={`${item.itemType}-${item.id}`} item={item} onClick={() => setSelectedItem(item)} />;
                    })}
                </div>
                {mapView.scale !== 1 && (
                    <button 
                        onClick={resetView}
                        className="absolute top-2 right-2 bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full shadow-md text-sm font-semibold hover:bg-white z-10 transition-opacity"
                        aria-label="Reset map view"
                    >
                        Reset View
                    </button>
                )}
            </div>
            
            {selectedItem && (
                 <div className="mt-4 animate-fade-in-up">
                    <DetailCard 
                        item={selectedItem} 
                        t={t} 
                        onSelectItem={(item) => setSelectedItem(item)}
                        onClose={() => setSelectedItem(null)}
                    />
                 </div>
            )}
            
            <div className="mt-4 p-2 bg-white rounded-lg shadow-md">
                <h4 className="font-bold mb-2 text-center text-gray-700 text-sm">Legend</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-gray-800">
                    <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-brand-primary mr-1.5"/> Cluster</div>
                    <div className="flex items-center"><MapPinIcon className="w-4 h-4 text-status-safe mr-1"/> Water (Safe)</div>
                    <div className="flex items-center"><MapPinIcon className="w-4 h-4 text-status-warning mr-1"/> Water (Warn)</div>
                    <div className="flex items-center"><MapPinIcon className="w-4 h-4 text-status-unsafe mr-1"/> Water (Unsafe)</div>
                    <div className="flex items-center"><MapPinIcon className="w-4 h-4 text-red-500 mr-1"/> Hospital</div>
                    <div className="flex items-center"><MapPinIcon className="w-4 h-4 text-blue-500 mr-1"/> Clinic</div>
                    <div className="flex items-center"><MapPinIcon className="w-4 h-4 text-purple-500 mr-1"/> Pharmacy</div>
                </div>
            </div>
        </div>
    );
};

export default MapScreen;