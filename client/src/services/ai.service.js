import { api } from './api';

async function post(url, payload) {
  const { data } = await api.post(url, payload);
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
