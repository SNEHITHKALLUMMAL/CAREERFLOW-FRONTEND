import { api } from './api';

// AI endpoints proxy to Gemini (free tier) and can legitimately take longer than
// the app's default 20s timeout, especially for multi-step generations like the
// learning roadmap or mock interview. Override per-request rather than raising
// the global default, which would also slow down failure detection on every
// other endpoint.
const AI_TIMEOUT_MS = 60000;

async function post(url, payload) {
  const { data } = await api.post(url, payload, { timeout: AI_TIMEOUT_MS });
  return data.data;
}

export const skillGap = (payload) => post('/ai/skill-gap', payload);
export const careerRecommendation = () => post('/ai/career-recommendation');
export const learningRoadmap = (payload) => post('/ai/learning-roadmap', payload);
export const resumeSuggestions = () => post('/ai/resume-suggestions');
export const chatbot = (payload) => post('/ai/chatbot', payload);
export const technologyRecommendation = (payload) => post('/ai/technology-recommendation', payload);
export const interviewQuestions = (payload) => post('/ai/interview-questions', payload);
export const salaryEstimation = (payload) => post('/ai/salary-estimation', payload);
export const startMockInterview = (payload) => post('/ai/mock-interview/start', payload);
export const continueMockInterview = (payload) => post('/ai/mock-interview/answer', payload);
