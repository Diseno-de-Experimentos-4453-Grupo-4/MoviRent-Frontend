import api from './api';
import { ref } from 'vue';


const authState = ref(null);


const storedUser = localStorage.getItem('auth');
authState.value = storedUser ? JSON.parse(storedUser) : null;

export default {
  async login(email, password) {
    try {
      const response = await api.get(`/users?email=${email}&password=${password}`);
      if (response.data.length === 0) throw new Error('Credenciales incorrectas');

      const user = response.data[0];
      localStorage.setItem('auth', JSON.stringify(user));
      authState.value = user;
      return user;
    } catch (error) {
      throw error;
    }
  },

  async register(userData) {
    try {
      const emailCheck = await api.get(`/users?email=${userData.email}`);
      if (emailCheck.data.length > 0) throw new Error('El correo ya está registrado');

      const response = await api.post('/users', userData);
      localStorage.setItem('auth', JSON.stringify(response.data));
      authState.value = response.data;
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('auth');
    authState.value = null;
    setTimeout(() => window.location.reload(), 100);
  },

  getCurrentUser() {
    return authState.value;
  }
};
