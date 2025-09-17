
import { GoogleGenAI, Type } from "@google/genai";
import { SymptomCheckResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const checkSymptomsWithGemini = async (symptoms: string[]): Promise<SymptomCheckResult | null> => {
  if (!API_KEY) {
    // Return mock data if API key is not available
    console.log("Returning mock data because API key is not set.");
    return {
        severity: 'Moderate',
        possibleConditions: ['Gastroenteritis (Stomach Flu)', 'Cholera (less likely without severe dehydration)'],
        recommendations: [
            'Stay hydrated by drinking plenty of fluids, preferably Oral Rehydration Solution (ORS).',
            'Rest as much as possible.',
            'Eat bland foods like rice, bananas, and toast.',
            'Monitor for signs of severe dehydration (e.g., no urination, dizziness, sunken eyes).',
            'If symptoms worsen or do not improve in 24-48 hours, seek medical attention immediately.'
        ]
    };
  }

  const prompt = `A person in a rural area with potential water contamination issues is experiencing the following symptoms: ${symptoms.join(', ')}.
    Based ONLY on these symptoms, provide a basic health assessment.
    This is for informational purposes and not a medical diagnosis.
    Focus on potential water-borne diseases like Cholera, Typhoid, and Diarrhea.
    The response must be a JSON object.
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: {
              type: Type.STRING,
              description: "The assessed severity of the symptoms (e.g., Mild, Moderate, Severe).",
            },
            possibleConditions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of possible conditions related to the symptoms, focusing on water-borne illnesses.",
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of recommended actions, such as home care tips and when to see a doctor.",
            },
          },
          required: ["severity", "possibleConditions", "recommendations"],
        },
      },
    });

    const jsonString = response.text;
    const result: SymptomCheckResult = JSON.parse(jsonString);
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
};
