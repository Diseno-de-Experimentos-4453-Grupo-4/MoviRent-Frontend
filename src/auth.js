import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';import { auth } from './firebase';
import api from './api';

export default {
  async login(email, password) {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;
      if (user != null && !user.emailVerified) {
        await sendEmailVerification(user);
        await signOut(auth);
        throw new Error('Por favor, verifica tu correo electrónico antes de iniciar sesión.');
      }
      return auth.currentUser;
    } catch (error) {
      if (error.message.includes('verifica tu correo electrónico')) {
        throw error;
      }
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

      await sendEmailVerification(userCredential.user);

      await signOut(auth);
      return { message: 'Usuario registrado. Por favor, verifica tu correo electrónico.' };
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
  },

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { message: 'Se ha enviado un correo para restablecer tu contraseña.' };
    } catch (error) {
      console.error('Error al enviar el correo de restablecimiento:', error);
      throw new Error('No se pudo enviar el correo de restablecimiento. Verifica el correo ingresado.');
    }
  }
};
