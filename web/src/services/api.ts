/**
 * API Service for POA Multi-Agent System
 * Handles all HTTP requests to the backend API
 */

import axios, { type AxiosInstance } from 'axios';

import type {
  AnalysisRequest,
  AnalysisResponse,
  HealthCheckResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8100/api/v1';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 300000, // 5 minutes timeout for long-running analysis
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log('✅ API Response:', response.status, response.config.url);
        return response;
      },
      (error) => {
        console.error('❌ Response Error:', error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Submit a new analysis request
   */
  async submitAnalysis(
    request: string,
    sessionId?: string,
    maxTurns: number = 20
  ): Promise<AnalysisResponse> {
    const payload: AnalysisRequest = {
      request,
      session_id: sessionId,
      max_turns: maxTurns,
    };

    try {
      const response = await this.client.post<AnalysisResponse>('/analysis', payload);
      return response.data;
    } catch (error: any) {
      // Handle errors gracefully
      if (error.response) {
        // Server responded with error status
        throw new Error(
          error.response.data?.error || 
          error.response.data?.detail || 
          `API Error: ${error.response.status}`
        );
      } else if (error.request) {
        // Request made but no response
        throw new Error('No response from server. Please check if the API is running.');
      } else {
        // Something else happened
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    try {
      const response = await this.client.get<HealthCheckResponse>('/health');
      return response.data;
    } catch (error: any) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }

  /**
   * Get API base URL
   */
  getBaseUrl(): string {
    return API_BASE_URL;
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export class for testing
export default ApiService;
