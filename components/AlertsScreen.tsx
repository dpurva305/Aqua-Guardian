import React from 'react';
import { ALERTS } from '../constants';
import { WaterSourceStatus } from '../types';
import Card from './Card';
import { CheckCircleIcon, ExclamationTriangleIcon, NoSymbolIcon } from './icons';

interface AlertsScreenProps {
  t: (key: string) => string;
}

const getStatusStyles = (status: WaterSourceStatus) => {
  switch (status) {
    case WaterSourceStatus.Safe:
      return { textColor: 'text-status-safe', Icon: CheckCircleIcon };
    case WaterSourceStatus.Warning:
      return { textColor: 'text-status-warning', Icon: ExclamationTriangleIcon };
    case WaterSourceStatus.Unsafe:
      return { textColor: 'text-status-unsafe', Icon: NoSymbolIcon };
  }
};

const AlertsScreen: React.FC<AlertsScreenProps> = ({ t }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-brand-dark mb-2">{t('alert_history')}</h2>
      <p className="text-gray-600 mb-6">{t('all_alerts_for_area')}</p>
      
      <div className="space-y-4">
        {ALERTS.map((alert) => {
          const { textColor, Icon } = getStatusStyles(alert.status);
          const statusText = t(`status_${alert.status.toLowerCase()}`);
          return (
            // FIX: The Card component does not accept a 'style' prop. Replaced with a dynamic className to set the border color using Tailwind CSS, consistent with app's styling conventions.
            <Card key={alert.id} className={`p-4 border-l-4 ${textColor.replace('text-', 'border-')}`}>
              <div className="flex items-start space-x-4">
                <Icon className={`w-8 h-8 ${textColor} flex-shrink-0`} />
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-lg text-gray-800">{alert.sourceName}</p>
                    <p className={`font-semibold text-sm ${textColor}`}>{statusText}</p>
                  </div>
                  <p className="text-gray-700 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{alert.timestamp}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsScreen;
