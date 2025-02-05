import { ApiResponse } from '@/app/types/common/api';
import { Project, CreateProjectData } from '@/app/types/project';
import { Quotation } from '@/app/types/quotation';
import { Invoice } from '@/app/types/invoice';
import { client } from './client';
import { ENDPOINTS } from './endpoints';
import { AxiosError } from 'axios';
import { apiClient } from '@/app/lib/apiClient';
import { CreateProjectData as ApiCreateProjectData, UpdateProjectData, ProjectResponse } from '@/app/types/api/projects';

interface CreateProjectResponse {
  project: Project;
  quotation: Quotation;
  invoice: Invoice;
}

export const projectsApi = {
  getProjects: async (): Promise<ApiResponse<Project[]>> => {
    try {
      const response = await apiClient.get('/projects');
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  getProject: async (id: number | string): Promise<ApiResponse<Project>> => {
    try {
      const response = await apiClient.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  createProject: async (data: ApiCreateProjectData): Promise<ProjectResponse> => {
    try {
      const response = await apiClient.post('/projects', {
        ...data,
        contact_histories: data.contact_histories?.map(history => ({
          contact_date: history.contact_date,
          contact_time: history.contact_time,
          contact_method: history.contact_method,
          contact_person: history.contact_person,
          contact_content: history.contact_content
        }))
      });
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  updateProject: async (id: number | string, data: UpdateProjectData): Promise<ProjectResponse> => {
    try {
      const response = await apiClient.put(`/projects/${id}`, {
        ...data,
        contact_histories: data.contact_histories?.map(history => ({
          contact_date: history.contact_date,
          contact_time: history.contact_time,
          contact_method: history.contact_method,
          contact_person: history.contact_person,
          contact_content: history.contact_content
        }))
      });
      return response.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  deleteProject: async (id: number | string): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
}; 