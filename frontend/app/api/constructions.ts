import { ENDPOINTS } from './endpoints';
import { client } from './client';
import {
  Construction,
  ConstructionResponse,
  ConstructionsResponse,
  CreateConstructionRequest,
  UpdateConstructionRequest,
  ConstructionDetail,
  ConstructionDetailResponse,
  ConstructionDetailsResponse,
  CreateConstructionDetailRequest,
  UpdateConstructionDetailRequest,
} from '../types/api/constructions';

// 工事関連のAPI
export const getConstructions = async (): Promise<Construction[]> => {
  const response = await client.get<ConstructionsResponse>(ENDPOINTS.CONSTRUCTIONS.BASE);
  return response.data.constructions;
};

export const getConstruction = async (id: string): Promise<Construction> => {
  const response = await client.get<ConstructionResponse>(ENDPOINTS.CONSTRUCTIONS.DETAIL(id));
  return response.data.construction;
};

export const createConstruction = async (data: CreateConstructionRequest): Promise<Construction> => {
  const response = await client.post<ConstructionResponse>(ENDPOINTS.CONSTRUCTIONS.BASE, data);
  return response.data.construction;
};

export const updateConstruction = async (id: string, data: UpdateConstructionRequest): Promise<Construction> => {
  const response = await client.put<ConstructionResponse>(ENDPOINTS.CONSTRUCTIONS.DETAIL(id), data);
  return response.data.construction;
};

// 工事詳細関連のAPI
export const getConstructionDetails = async (): Promise<ConstructionDetail[]> => {
  try {
    const response = await client.get<ConstructionDetailsResponse>(ENDPOINTS.CONSTRUCTIONS.DETAILS.LIST);
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    
    if (!response.data) {
      console.error('Response data is missing');
      throw new Error('Invalid response format');
    }

    if (!response.data.success) {
      console.error('Response success flag is false');
      throw new Error(response.data.message || 'Invalid response format');
    }

    if (!response.data.data || !Array.isArray(response.data.data)) {
      console.error('Construction details data is invalid:', response.data.data);
      throw new Error('Invalid response format');
    }

    return response.data.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getConstructionDetail = async (id: number): Promise<ConstructionDetail> => {
  const response = await client.get<ConstructionDetailResponse>(ENDPOINTS.CONSTRUCTIONS.DETAILS.GET(id));
  if (!response.data.success || !response.data.data) {
    throw new Error('工事詳細の取得に失敗しました。');
  }
  return response.data.data;
};

export const createConstructionDetail = async (data: CreateConstructionDetailRequest): Promise<ConstructionDetail> => {
  const response = await client.post<ConstructionDetailResponse>(ENDPOINTS.CONSTRUCTIONS.DETAILS.CREATE, data);
  if (!response.data.success || !response.data.data) {
    throw new Error('工事詳細の作成に失敗しました。');
  }
  return response.data.data;
};

export const updateConstructionDetail = async (id: number, data: UpdateConstructionDetailRequest): Promise<ConstructionDetail> => {
  const response = await client.put<ConstructionDetailResponse>(ENDPOINTS.CONSTRUCTIONS.DETAILS.UPDATE(id), data);
  if (!response.data.success || !response.data.data) {
    throw new Error('工事詳細の更新に失敗しました。');
  }
  return response.data.data;
};

export const deleteConstructionDetail = async (id: number): Promise<void> => {
  await client.delete(ENDPOINTS.CONSTRUCTIONS.DETAILS.DELETE(id));
}; 