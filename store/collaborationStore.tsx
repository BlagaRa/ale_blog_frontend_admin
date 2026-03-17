import { create } from "zustand";
import axios from "axios";

export enum Gen {
  ROMANCE = "ROMANCE",
  ACTION = "ACTION",
  FICTION = "FICTION",
  THRILLER = "THRILLER",
  PERSONAL_DEVELOPMENT = "PERSONAL_DEVELOPMENT",
  FOR_KIDS = "FOR_KIDS",
  HISTORICAL = "HISTORICAL",
  HORROR = "HORROR"
}

export enum RequestStatus {
  JUST_SENT = "JUST_SENT",
  IN_PROCESS = "IN_PROCESS",
  READ = "READ",
  REJECTED = "REJECTED"
}

export interface Collaboration {

  id: string;
  bookTitle: string;
  bookDescription: string;
  gen: Gen;
  personName: string;
  email: string;
  phoneNumber?: string;
  message?: string;
  createdAt: string | Date;
  status:string;
  reasonOfContact:string
}

interface CollaborationState {
  collaborations: Collaboration[];
  selectedCollaboration: Collaboration | null;
  
  isLoading: boolean;
  error: string | null;

  getCollaborations: () => Promise<void>;
  getCollaborationById: (id: string) => Promise<void>;
  editCollaboration: (id: string, data: Collaboration) => Promise<boolean>;
  deleteCollaboration: (id: string) => Promise<boolean>;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const useCollaborationStore = create<CollaborationState>((set) => ({

  collaborations: [],
  selectedCollaboration: null,
  isLoading: false,
  error: null,

  getCollaborations: async () => {
    set({ isLoading: true, error: null });

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${baseUrl}/api/collaboration`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      set({
        collaborations: res.data.collaborations || [],
        isLoading: false
      });

    } catch (error: any) {
      set({
        error: "Error loading collaborations!",
        isLoading: false
      });
    }
  },

  getCollaborationById: async (id: string) => {
    set({ isLoading: true });

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${baseUrl}/api/collaboration/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      set({
        selectedCollaboration: res.data.collaboration,
        isLoading: false
      });

    } catch (error) {
      set({
        error: "Error loading collaboration!",
        isLoading: false
      });
    }
  },

  editCollaboration: async (id: string, data: Collaboration) => {
    set({ isLoading: true });

    try {
      const token = localStorage.getItem("token");

      await axios.put(`${baseUrl}/api/collaboration/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      set({ isLoading: false });
      return true;

    } catch (error: any) {
      console.error("Edit failed:", error.response?.data || error.message);
      
      set({
        error: error.response?.data?.message || "Error editing collaboration!",
        isLoading: false
      });

      return false;
    }
  },

  deleteCollaboration: async (id: string) => {
    set({ isLoading: true });

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${baseUrl}/api/collaboration/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      set((state) => ({
        collaborations: state.collaborations.filter(c => c.id !== id),
        isLoading: false
      }));

      return true;

    } catch (error) {
      set({
        error: "Error deleting collaboration!",
        isLoading: false
      });

      return false;
    }
  }

}));