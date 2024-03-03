<template>
  <div class="auth-container">
    <div v-if="isLogin" class="login">
      <!-- Display the user's photo or a default icon, and the username or "Welcome" message -->
      <Avatar :src="userPhotoURL" :alt="userName" />
      <p>Welcome, {{ userName }}</p>
      <!-- Sign out button -->
      <button @click="signOut" class="text-gray-400 hover:text-white">
        Sign Out
      </button>
    </div>
    <div v-else>
      <!-- Sign in with email form -->
      <form @submit.prevent="signInWithEmail" class="form-container">
        <div class="card">
          <div class="card-header">
            <h3>Sign In</h3>
          </div>
        </div>
        <div class="card-body">
          <label for="signInEmail">Email</label>
          <input
            type="email"
            id="signInEmail"
            v-model="email"
            required
            placeholder="Enter your email"
          />
          <label for="signInPassword">Password</label>
          <input
            type="password"
            id="signInPassword"
            v-model="password"
            required
            placeholder="Enter your password"
          />
        </div>
        <!-- Sign in with email button -->
        <button type="submit" class="bg-green-500 hover:bg-green-600">
          Sign In with Email
        </button>
      </form>
      <!-- Sign in with Google button -->
      <button @click="handleSignInWithGoogle" class="bg-blue-500 hover:bg-blue-600">
        Sign In with Google
      </button>
    </div>
    <div class="register">
      <p>
        Don't have an account? Register
        <RouterLink to="/register" class="nav-link">here.</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/firebase'; // Adjust the path as necessary
import Avatar from '../components/Avatar.vue'; // Ensure this path is correct

const email = ref('');
const password = ref('');
const router = useRouter();

// Use useAuth from firebase.js
const { user, signIn: signInWithEmailAndPasswordMethod, signInWithGoogle, signOut, isLogin } = useAuth();

const signInWithEmail = async () => {
    try {
        await signInWithEmailAndPasswordMethod(email.value, password.value);
        console.log('Successfully signed in');
        router.push('/');
    } catch (error) {
        console.error('Sign-in error:', error);
        alert(error.message);
    }
};

// This function handles Google sign-in
const handleSignInWithGoogle = async () => {
    try {
        await signInWithGoogle();
        console.log('Successfully signed in with Google');
        router.push('/');
    } catch (error) {
        console.error('Google sign-in error:', error);
        alert(error.message);
    }
};
const defaultIcon = '/icon.png';
// Computed properties for user's photo URL and name
const userPhotoURL = computed(() => { 
  return user.value?.photoURL || defaultIcon;
});

const userName = computed(() => user.value?.displayName || 'Default User Name');
</script>
