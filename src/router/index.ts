import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { me } from '../api/auth.ts'
import ChatRoomView from '../views/ChatRoomView.vue'
import LoginView from '../views/LoginView.vue'
import SettingsView from '../views/SettingsView.vue'
import CreateStoryView from '../views/CreateStoryView.vue'
import StoriesView from '../views/StoriesView.vue'


const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
]

const protectedRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'chat-room',
    component: ChatRoomView,
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/stories/new',
    name: 'create-story',
    component: CreateStoryView,
    meta: { requiresAuth: true },
  },
  {
    path: '/stories',
    name: 'stories',
    component: StoriesView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...publicRoutes, ...protectedRoutes],
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) {
    return true
  }

  try {
    await me()
    return true
  } catch {
    return "/login"
  }
})

export default router
