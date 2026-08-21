import { useMutation } from '@tanstack/react-query';
import * as aiApi from '@/services/ai.service';

export const useSkillGap = () => useMutation({ mutationFn: aiApi.skillGap });
export const useCareerRecommendation = () =>
  useMutation({ mutationFn: aiApi.careerRecommendation });
export const useLearningRoadmap = () => useMutation({ mutationFn: aiApi.learningRoadmap });
export const useResumeSuggestions = () => useMutation({ mutationFn: aiApi.resumeSuggestions });
export const useChatbot = () => useMutation({ mutationFn: aiApi.chatbot });
export const useTechnologyRecommendation = () =>
  useMutation({ mutationFn: aiApi.technologyRecommendation });
export const useInterviewQuestions = () => useMutation({ mutationFn: aiApi.interviewQuestions });
export const useSalaryEstimation = () => useMutation({ mutationFn: aiApi.salaryEstimation });
export const useStartMockInterview = () => useMutation({ mutationFn: aiApi.startMockInterview });
export const useContinueMockInterview = () =>
  useMutation({ mutationFn: aiApi.continueMockInterview });
