
import React, { useState } from 'react';
import Card from './Card';
import { SYMPTOMS, MOCK_SYMPTOM_REPORTS, MOCK_SYMPTOM_TREND_DATA } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface CommunityScreenProps {
  t: (key: string) => string;
}

const SymptomReporting: React.FC<{ t: (key: string) => string }> = ({ t }) => {
    const [selectedSymptom, setSelectedSymptom] = useState<string>('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!selectedSymptom) return;
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setSelectedSymptom('');
        }, 3000);
    };

    return (
        <Card className="p-4">
            <h3 className="text-lg font-bold text-brand-dark">{t('crowdsourced_reporting')}</h3>
            <p className="text-sm text-gray-600 mt-1">{t('report_symptoms_desc')}</p>

            {isSubmitted ? (
                <div className="mt-4 text-center p-4 bg-green-100 text-green-700 rounded-lg">
                    Thank you! Your anonymous report has been submitted.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <select
                        value={selectedSymptom}
                        onChange={(e) => setSelectedSymptom(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                    >
                        <option value="">{t('select_symptoms')}</option>
                        {SYMPTOMS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <button
                        type="submit"
                        disabled={!selectedSymptom}
                        className="w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-brand-dark transition-colors"
                    >
                        {t('submit_report')}
                    </button>
                </form>
            )}
        </Card>
    );
};

const ResourceDashboard: React.FC<{ t: (key: string) => string }> = ({ t }) => {
    const totalReports = MOCK_SYMPTOM_REPORTS.reduce((sum, item) => sum + item.count, 0);

    return (
        <Card className="p-4 bg-gray-50">
            <h3 className="text-lg font-bold text-brand-dark">{t('resource_dashboard')}</h3>
            <p className="text-sm text-gray-600 mt-1 mb-4">{t('community_health_data')}</p>
            
            <Card className="p-4 mb-4 text-center">
                <p className="text-gray-500">{t('total_reports')}</p>
                <p className="text-4xl font-bold text-brand-dark">{totalReports}</p>
            </Card>

            <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">{t('reports_by_symptom')}</h4>
                <div className="w-full h-64">
                    <ResponsiveContainer>
                        <BarChart data={MOCK_SYMPTOM_REPORTS} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="symptom" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#00b4d8" name="Reports" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-gray-700 mb-2">{t('symptom_trend')}</h4>
                 <div className="w-full h-64">
                    <ResponsiveContainer>
                        <LineChart data={MOCK_SYMPTOM_TREND_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Diarrhea" stroke="#ef4444" />
                            <Line type="monotone" dataKey="Fever" stroke="#f59e0b" />
                            <Line type="monotone" dataKey="Vomiting" stroke="#0077b6" />
                        </LineChart>
                    </ResponsiveContainer>
                 </div>
            </div>

        </Card>
    );
};


const CommunityScreen: React.FC<CommunityScreenProps> = ({ t }) => {
    const [activeTab, setActiveTab] = useState('report');

    return (
        <div className="p-4 space-y-6">
            <h2 className="text-2xl font-bold text-brand-dark mb-2">{t('community_hub')}</h2>
            <div className="flex border-b">
                <button 
                    onClick={() => setActiveTab('report')}
                    className={`px-4 py-2 font-semibold ${activeTab === 'report' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500'}`}
                >
                    {t('report_symptoms')}
                </button>
                <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-4 py-2 font-semibold ${activeTab === 'dashboard' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500'}`}
                >
                    {t('resource_dashboard')}
                </button>
            </div>
            
            {activeTab === 'report' && <SymptomReporting t={t} />}
            {activeTab === 'dashboard' && <ResourceDashboard t={t} />}

        </div>
    );
};

export default CommunityScreen;
