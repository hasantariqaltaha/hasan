import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse } from "../types";

// Schema definition for Structured Output
const riskFactorSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    condition: { type: Type.STRING, description: "The medical condition identified" },
    relative: { type: Type.STRING, description: "The family member affected (e.g., Father, Maternal Aunt)" },
    riskAssessment: { type: Type.STRING, enum: ["Low", "Medium", "High", "Unknown"], description: "Estimated risk level for the patient" },
    notes: { type: Type.STRING, description: "Brief justification for the risk level" }
  },
  required: ["condition", "relative", "riskAssessment"]
};

const resultSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    patientId: { type: Type.STRING, description: "The ID provided in the input or 'SINGLE'" },
    summaryEn: { type: Type.STRING, description: "Executive summary in English" },
    summaryAr: { type: Type.STRING, description: "Executive summary in Arabic" },
    riskFactors: {
      type: Type.ARRAY,
      items: riskFactorSchema,
      description: "List of identified genetic or familial risk factors"
    },
    recommendationsEn: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Clinical recommendations in English" },
    recommendationsAr: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Clinical recommendations in Arabic" },
    dataQualityIssue: { type: Type.BOOLEAN, description: "True if the input text was gibberish, too short, or irrelevant" }
  },
  required: ["patientId", "summaryEn", "summaryAr", "riskFactors", "recommendationsEn", "recommendationsAr"]
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    results: {
      type: Type.ARRAY,
      items: resultSchema
    }
  }
};

const SYSTEM_INSTRUCTION = `
You are a specialized Medical Family History Analysis Assistant.
Your role is to extract family history information from text or audio transcripts and provide a risk assessment.

STRICT RULES:
1. You are NOT a doctor. You provide DECISION SUPPORT only.
2. Analyze the input for familial patterns (cardiac, oncological, metabolic, etc.).
3. If the input is empty, gibberish, or not related to health, set 'dataQualityIssue' to true and provide a polite error message in the summaries.
4. Always provide output in BOTH English and Arabic as requested by the schema.
5. Use "High", "Medium", "Low", or "Unknown" for risk assessments based on standard guidelines (e.g., 1st degree relative < 50y = High).
6. Respect the JSON schema strictly.
7. Treat all data as SYNTHETIC. Do not flag privacy concerns for the generated response, as the user has already consented to using synthetic data.
`;

export const analyzePatientData = async (
  inputData: string | { mimeType: string; data: string },
  isBulk: boolean = false
): Promise<AnalysisResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = isBulk 
    ? `Analyze the following JSON/CSV patient data. Return an analysis for each patient item in the list: ${typeof inputData === 'string' ? inputData : 'Audio data provided'}` 
    : `Analyze the following patient family history notes:`;

  const parts = [];
  
  if (typeof inputData === 'string') {
    parts.push({ text: `${prompt}\n\nDATA:\n${inputData}` });
  } else {
    parts.push({ text: prompt });
    parts.push({
      inlineData: {
        mimeType: inputData.mimeType,
        data: inputData.data
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Low temperature for deterministic medical output
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AnalysisResponse;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Return a graceful error structure
    return {
      results: [{
        patientId: "ERROR",
        summaryEn: "An error occurred during processing. Please try again.",
        summaryAr: "حدث خطأ أثناء المعالجة. حاول مرة اخرى.",
        riskFactors: [],
        recommendationsEn: ["Check input format", "Ensure audio is clear"],
        recommendationsAr: ["تحقق من تنسيق الإدخال", "تأكد من وضوح الصوت"],
        dataQualityIssue: true
      }]
    };
  }
};
