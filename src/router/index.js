import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ScooterSearchingView from '@/searching/views/scooter-searching-view.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import HomeView from '@/views/HomeView.vue';
import ReviewsView from '@/review/views/reviews-view.vue';
import CreateReviewView from '@/review/views/create-review-view.vue';
import auth from '@/auth';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresGuest: true }
  },
  {
    path: '/mis-scooters',
    name: 'my-scooters',
    component: () => import('@/views/MyScootersView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/buscar',
    name: 'search',
    component: ScooterSearchingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/scooter/:id',
    name: 'scooter-details',
    component: () => import('@/searching/views/scooter-details-view.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/scooter/edit/:scooterId',
    name: 'edit-scooter',
    component: () => import('@/views/EditarScooterView.vue'),
  },
  {
    path: '/publicar-scooter',
    name: 'publicar-scooter',
    component: () => import('@/views/PublicarScooterView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reviews/:scooterId',
    name: 'reviews',
    component: ReviewsView
  },
  {
    path: '/booking/complete-booking/:scooterId',
    name: 'complete-booking',
    component: () => import('@/reservation/views/completar-reserva-view.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reviews/create/:scooterId',
    name: 'create-review',
    component: CreateReviewView,
    meta: { requiresAuth: true }
  },
  {
    path: '/booking/verify-transaction/:profileId/:bookingId',
    name: 'verify-transaction',
    component: () => import('@/reservation/views/verificar-transaccion-view.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/booking/reservation-details/:profileId/:bookingId',
    name: 'reservation-details',
    component: () => import('@/reservation/views/ScooterReservationDetails.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/historial',
    name: 'history',
    component: () => import('@/reservation/views/scooter-history-view.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/subscription',
    name: 'subscription',
    component: () => import('@/views/SubscriptionView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/estados-reserva',
    name: 'reservation-status',
    component: () => import('@/reservation/views/ScooterReservationStatus.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/two-factor-verification',
    name: 'two-factor-verification',
    component: () => import('@/views/TwoFactorVerificationView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/editar-perfil/:profileId',
    name: 'editar-perfil',
    component: () => import('@/views/EditProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const auth = getAuth();

  if (!auth.currentUser) {
    await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  const isAuthenticated = auth.currentUser !== null;

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (requiresGuest && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
