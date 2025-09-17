
import React from 'react';
import Card from './Card';

interface EducationScreenProps {
  t: (key: string) => string;
}

const EducationCard: React.FC<{ title: string; children: React.ReactNode; image: string }> = ({ title, children, image }) => (
  <Card className="overflow-hidden">
    <img src={image} alt={title} className="w-full h-32 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-bold text-brand-dark">{title}</h3>
      <div className="text-gray-600 text-sm mt-2 space-y-2">{children}</div>
    </div>
  </Card>
);

const EducationScreen: React.FC<EducationScreenProps> = ({ t }) => {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-brand-dark mb-2">{t('education')}</h2>
      
      <EducationCard title={t('boil_water_title')} image="https://picsum.photos/400/200?image=24">
        <p>{t('boil_water_desc')}</p>
        <ol className="list-decimal list-inside space-y-1 mt-2">
          <li>Bring water to a full rolling boil for at least 1 minute.</li>
          <li>At higher altitudes (above 6,500 feet), boil for 3 minutes.</li>
          <li>Let the water cool naturally and store it in a clean, covered container.</li>
        </ol>
      </EducationCard>

      <EducationCard title={t('symptoms_title')} image="https://picsum.photos/400/200?image=1079">
        <p>Learn to recognize the symptoms of common water-borne diseases:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li><strong>{t('cholera')}:</strong> Severe watery diarrhea, vomiting, leg cramps.</li>
          <li><strong>{t('typhoid')}:</strong> High fever, headache, stomach pain, weakness.</li>
          <li><strong>{t('diarrhea')}:</strong> Loose, watery stools three or more times a day.</li>
        </ul>
      </EducationCard>
      
      <EducationCard title={t('hygiene_title')} image="https://picsum.photos/400/200?image=318">
        <p>{t('hygiene_desc')}</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Wash hands with soap and clean water regularly.</li>
            <li>Store drinking water in a clean, covered container.</li>
            <li>Keep sanitation facilities clean and dispose of waste properly.</li>
        </ul>
      </EducationCard>
    </div>
  );
};

export default EducationScreen;
