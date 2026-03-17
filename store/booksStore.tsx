import { create } from 'zustand';
import axios from 'axios';

export enum Gen {
  ROMANCE = 'ROMANCE',
  ACTION = 'ACTION',
  FICTION = 'FICTION',
  THRILLER = 'THRILLER',
  PERSONAL_DEVELOPMENT = 'PERSONAL_DEVELOPMENT',
  FOR_KIDS = 'FOR_KIDS',
  HISTORICAL = 'HISTORICAL',
  HORROR = 'HORROR'
}

interface Book {
  id: string;
  title: string;
  image?: string;
  description: string;
  gen: Gen;
  buyLink?: string;
  writtenAt: string | Date;
  author: string;
  createdAt: string | Date;
  review:Review | null;
}

export interface Review {
  id: string;
  bookId: string;
  description: string;
  stars: number;
  createdAt?: string | Date;
  editedAt?: string | Date;
}

interface BookState {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  getBooks: () => Promise<void>;
  createBook: (formData: FormData) => Promise<boolean>;
  deleteBook: (id: string) => Promise<boolean>;
  editBook: (id: string, formData: FormData) => Promise<boolean>;
  addReview: (bookId: string, reviewData: { description: string; stars: number }) => Promise<boolean>;
  updateReview: (id: string, reviewData: { description?: string; stars?: number }) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const useBookStore = create<BookState>((set) => ({
  books: [],
  isLoading: false,
  error: null,

  getBooks: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${baseUrl}/api/book`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

    let booksData = Array.isArray(response.data) ? response.data : [];
    
    if (!Array.isArray(response.data) && response.data.books) {
      booksData = response.data.books;
    }

    set({ books: booksData, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Loading books error!';
      set({ error: message, isLoading: false });
    }
  },

deleteBook: async (id: string) => {
  set({ isLoading: true });
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${baseUrl}/api/book/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    set((state) => ({
      books: state.books.filter((b) => b.id !== id),
      isLoading: false
    }));
    return true;
  } catch (error) {
    set({ isLoading: false, error: "Error deleting the book!" });
    return false;
  }
},
  

createBook: async (formData: FormData) => {
  set({ isLoading: true, error: null });
  try {
    const token = localStorage.getItem('token');
    await axios.post(`${baseUrl}/api/book`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
        Authorization: `Bearer ${token}`
      }
    });
    
    const getBooks = useBookStore.getState().getBooks;
    await getBooks();
    
    set({ isLoading: false });
    return true;
  } catch (error: any) {
    set({ error: "Error creating the book!", isLoading: false });
    return false;
  }
},



  addReview: async (bookId: string, reviewData: { description: string; stars: number }) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${baseUrl}/api/review/${bookId}`, reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set((state) => ({
        books: state.books.map((book) => 
          book.id === bookId ? { ...book, review: response.data.review } : book
        ),
        isLoading: false
      }));
      
      return true;
    } catch (error:any) {
      const message = error.response?.data?.message || 'Error adding the book!';
      set({ isLoading: false, error: message });
      return false;
    }
  },

  updateReview: async (id: string, reviewData: { description?: string; stars?: number }) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${baseUrl}/api/review/${id}`, reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set((state) => ({
        books: state.books.map((book) => 
          book.review?.id === id ? { ...book, review: response.data.review } : book
        ),
        isLoading: false
      }));
      
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error updating the review!';
      set({ isLoading: false, error: message });
      return false;
    }
  },

  deleteReview: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseUrl}/api/review/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set((state) => ({
        books: state.books.map((book) => 
          book.review?.id === id ? { ...book, review: null } : book
        ),
        isLoading: false
      }));
      
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error deleting review!';
      set({ isLoading: false, error: message });
      return false;
    }
  },
  editBook: async (id: string, formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${baseUrl}/api/book/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
          Authorization: `Bearer ${token}`
        }
      });
      
      const getBooks = useBookStore.getState().getBooks;
      await getBooks();
      
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: "Error editing book!", isLoading: false });
      return false;
    }
  },
  


}));