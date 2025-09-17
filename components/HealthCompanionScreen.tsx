
import React, { useState } from 'react';
import Card from './Card';
import { SYMPTOMS } from '../constants';
import { checkSymptomsWithGemini } from '../services/geminiService';
import { SymptomCheckResult, Symptom } from '../types';
import { CloseIcon } from './icons';

interface HealthCompanionScreenProps {
  t: (key: string) => string;
}

const SymptomChecker: React.FC<{t: (key: string) => string}> = ({ t }) => {
    const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<SymptomCheckResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSymptomToggle = (symptomId: string) => {
        setSelectedSymptoms(prev => {
            const newSet = new Set(prev);
            if (newSet.has(symptomId)) {
                newSet.delete(symptomId);
            } else {
                newSet.add(symptomId);
            }
            return newSet;
        });
    };

    const handleSubmit = async () => {
        if (selectedSymptoms.size === 0) return;
        setIsLoading(true);
        setError(null);
        setResult(null);

        const symptomNames = SYMPTOMS
            .filter(s => selectedSymptoms.has(s.id))
            .map(s => s.name);
        
        try {
            const apiResult = await checkSymptomsWithGemini(symptomNames);
            if(apiResult) {
                setResult(apiResult);
            } else {
                setError("Failed to get a response. Please try again later.");
            }
        } catch (e) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    if (result) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-md animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-brand-dark">Assessment Result</h3>
                    <button onClick={() => {setResult(null); setSelectedSymptoms(new Set())}} className="text-gray-500 hover:text-gray-800">
                        <CloseIcon />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <p className="font-semibold">Severity:</p>
                        <p className={`font-bold text-xl ${result.severity === 'Severe' ? 'text-red-500' : result.severity === 'Moderate' ? 'text-yellow-500' : 'text-green-500'}`}>{result.severity}</p>
                    </div>
                     <div>
                        <p className="font-semibold">Possible Conditions:</p>
                        <ul className="list-disc list-inside text-gray-700">
                            {result.possibleConditions.map((cond, i) => <li key={i}>{cond}</li>)}
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold">Recommendations:</p>
                        <ul className="list-disc list-inside text-gray-700">
                             {result.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                        </ul>
                    </div>
                </div>
                <p className="text-xs text-red-600 bg-red-100 p-2 rounded-md mt-4">{t('disclaimer')}</p>
            </div>
        )
    }

    return (
        <Card className="p-4">
            <h3 className="text-lg font-bold text-brand-dark">{t('symptom_checker')}</h3>
            <p className="text-sm text-gray-600 mt-1">{t('symptom_checker_prompt')}</p>
            
            <div className="mt-4">
                <p className="font-semibold text-gray-700 mb-2">{t('select_symptoms')}:</p>
                <div className="flex flex-wrap gap-2">
                    {SYMPTOMS.map((symptom) => (
                        <button
                            key={symptom.id}
                            onClick={() => handleSymptomToggle(symptom.id)}
                            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                                selectedSymptoms.has(symptom.id)
                                ? 'bg-brand-primary text-white border-brand-primary'
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                            }`}
                        >
                            {symptom.name}
                        </button>
                    ))}
                </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            
            <button
                onClick={handleSubmit}
                disabled={selectedSymptoms.size === 0 || isLoading}
                className="mt-6 w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-brand-dark transition-colors"
            >
                {isLoading ? 'Checking...' : t('check_symptoms')}
            </button>
        </Card>
    );
};


const HealthCompanionScreen: React.FC<HealthCompanionScreenProps> = ({ t }) => {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-brand-dark mb-2">{t('health_companion')}</h2>
      
      <SymptomChecker t={t}/>

       <Card className="p-4">
        <h3 className="text-lg font-bold text-brand-dark">{t('home_remedies')}</h3>
        <p className="font-semibold mt-2">{t('ors_title')}</p>
        <p className="text-sm text-gray-600 mt-1">Mix 6 level teaspoons of sugar and 1/2 level teaspoon of salt in 1 litre of clean, boiled and cooled water. Stir until dissolved. Sip frequently.</p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-lg font-bold text-brand-dark">{t('find_nearest_care')}</h3>
        <p className="text-sm text-gray-600 mt-1">Use the map feature to locate nearby hospitals, clinics, and pharmacies.</p>
      </Card>
    </div>
  );
};

export default HealthCompanionScreen;
