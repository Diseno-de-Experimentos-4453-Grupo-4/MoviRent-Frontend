import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './firebase';
import api from './api';

export default {
  async login(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return auth.currentUser;
    } catch (error) {
      throw new Error('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    }
  },

  async register({ email, password, firstName, lastName, phone, dni, age, street, neighborhood, city, district }) {
    try {




      const profileData = {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Dni: dni,
        Age: age,
        Phone: phone,
        Street: street || "",
        Neighborhood: neighborhood || "",
        City: city || "",
        District: district || ""
      };

      await api.post('/profile', profileData);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });
      return userCredential.user;
    } catch (error) {
      console.error('Error durante el registro:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Este correo ya está registrado. Por favor, utiliza otro correo.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('La contraseña es demasiado débil. Usa al menos 6 caracteres.');
      } else {
        throw new Error('Error en el registro. Por favor, inténtalo de nuevo.');
      }
    }
  },

  async logout() {
    await signOut(auth);
  },

  getCurrentUser() {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        unsubscribe();
        resolve(user);
      }, reject);
    });
  },

  isAuthenticated() {
    return auth.currentUser !== null;
  }
};
