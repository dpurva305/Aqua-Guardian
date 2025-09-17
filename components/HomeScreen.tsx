
import React from 'react';
import { WaterSource, WaterSourceStatus, Page } from '../types';
import { WATER_SOURCES, ALERTS } from '../constants';
import Card from './Card';
import { CheckCircleIcon, ExclamationTriangleIcon, NoSymbolIcon, MapIcon, AlertIcon, HeartIcon, UsersIcon } from './icons';

interface HomeScreenProps {
  t: (key: string) => string;
  setPage: (page: Page) => void;
}

const getStatusStyles = (status: WaterSourceStatus) => {
  switch (status) {
    case WaterSourceStatus.Safe:
      return {
        bgColor: 'bg-status-safe',
        textColor: 'text-status-safe',
        Icon: CheckCircleIcon,
        ringColor: 'ring-status-safe',
      };
    case WaterSourceStatus.Warning:
      return {
        bgColor: 'bg-status-warning',
        textColor: 'text-status-warning',
        Icon: ExclamationTriangleIcon,
        ringColor: 'ring-status-warning',
      };
    case WaterSourceStatus.Unsafe:
      return {
        bgColor: 'bg-status-unsafe',
        textColor: 'text-status-unsafe',
        Icon: NoSymbolIcon,
        ringColor: 'ring-status-unsafe',
      };
  }
};

const StatusCard: React.FC<{ source: WaterSource, t: (key: string) => string }> = ({ source, t }) => {
  const { bgColor, textColor, Icon, ringColor } = getStatusStyles(source.status);
  return (
    <Card className={`relative overflow-hidden border-2 ${ringColor.replace('ring-','border-')}`}>
      <div className={`p-6 ${bgColor} bg-opacity-10`}>
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${bgColor} text-white`}>
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{t('primary_source')}: {source.name}</p>
            <p className={`text-3xl font-bold ${textColor}`}>{t(`status_${source.status.toLowerCase()}`)}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4 text-right">{t('last_checked')}: {source.lastChecked}</p>
      </div>
    </Card>
  );
};

const FeatureCard: React.FC<{ title: string; icon: React.ReactNode; onClick: () => void }> = ({ title, icon, onClick }) => (
    <Card onClick={onClick} className="text-center p-4 flex flex-col items-center justify-center space-y-2">
        <div className="p-3 bg-brand-light text-brand-primary rounded-full">
            {icon}
        </div>
        <p className="font-semibold text-gray-700">{title}</p>
    </Card>
);


const HomeScreen: React.FC<HomeScreenProps> = ({ t, setPage }) => {
  const primarySource = WATER_SOURCES[0];
  const recentAlerts = ALERTS.slice(0, 2);

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-dark mb-2">{t('water_status')}</h2>
        <StatusCard source={primarySource} t={t} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <FeatureCard title={t('view_map')} icon={<MapIcon className="w-8 h-8"/>} onClick={() => setPage(Page.Map)} />
         <FeatureCard title={t('recent_alerts')} icon={<AlertIcon className="w-8 h-8"/>} onClick={() => setPage(Page.Alerts)} />
         <FeatureCard title={t('health_companion')} icon={<HeartIcon className="w-8 h-8"/>} onClick={() => setPage(Page.Health)} />
         <FeatureCard title={t('community_hub')} icon={<UsersIcon className="w-8 h-8"/>} onClick={() => setPage(Page.Community)} />
      </div>

      <div>
        <h2 className="text-xl font-bold text-brand-dark mb-2">{t('recent_alerts')}</h2>
        <div className="space-y-3">
            {recentAlerts.map(alert => {
                const { textColor, Icon } = getStatusStyles(alert.status);
                return (
                    <Card key={alert.id} className="p-4 flex items-start space-x-3">
                        <Icon className={`w-6 h-6 ${textColor} flex-shrink-0 mt-1`} />
                        <div>
                            <p className="font-bold text-gray-800">{alert.sourceName}</p>
                            <p className="text-sm text-gray-600">{alert.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{alert.timestamp}</p>
                        </div>
                    </Card>
                )
            })}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
