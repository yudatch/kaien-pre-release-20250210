import { ApiResponse } from '@/app/types/common/api';
import { Customer, CreateCustomerData } from '@/app/types/customer';
import { client } from './client';
import { ENDPOINTS } from './endpoints';
import { AxiosError } from 'axios';

export const customersApi = {
  getCustomers: async (): Promise<ApiResponse<Customer[]>> => {
    const response = await client.get(ENDPOINTS.CUSTOMERS.BASE);
    return response.data;
  },

  getCustomer: async (id: number): Promise<ApiResponse<Customer>> => {
    const response = await client.get(ENDPOINTS.CUSTOMERS.DETAIL(id.toString()));
    return response.data;
  },

  createCustomer: async (data: CreateCustomerData): Promise<ApiResponse<Customer>> => {
    const response = await client.post(ENDPOINTS.CUSTOMERS.BASE, data);
    return response.data;
  },

  updateCustomer: async (id: number, data: Partial<CreateCustomerData>): Promise<ApiResponse<Customer>> => {
    const response = await client.put(ENDPOINTS.CUSTOMERS.DETAIL(id.toString()), data);
    return response.data;
  },

  deleteCustomer: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await client.delete(ENDPOINTS.CUSTOMERS.DETAIL(id.toString()));
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }
}; 