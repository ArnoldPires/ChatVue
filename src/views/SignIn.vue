<template>
    <div class="auth-container">
      <form @submit.prevent="signInWithEmail" class="form-container">
        <div class="card">
          <div class="card-header">
            <h3>Sign In</h3>
          </div>
        </div>
        <div class="card-body">
          <label for="signInEmail">Email</label>
          <input type="email" id="signInEmail" v-model="email" required placeholder="Enter your email"/>
          <label for="signInPassword">Password</label>
          <input type="password" id="signInPassword" v-model="password" required placeholder="Enter your password"/>
        </div>
        <button type="submit" class="bg-green-500 hover:bg-green-600">Sign In with Email</button>
      </form>
      <button @click="signInWithGoogle" class="bg-blue-500 hover:bg-blue-600">Sign In with Google</button>
      <div v-if="isLogin">
        <Avatar :src="userPhotoURL" :alt="username" />
        <p>{{ userName }}</p>
      </div>
      <div class="register">
        <p>Don't have an account? Register <RouterLink to="/register" class="nav-link">here.</RouterLink></p>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { ref, computed } from 'vue'; // Add computed to the import statement
import { useRouter } from 'vue-router';
import { useAuth } from '@/firebase'; // Adjust the path as necessary
import Avatar from '../components/Avatar.vue'; // Ensure this path is correct

// Form inputs
const email = ref('');
const password = ref('');
const router = useRouter();

// Use useAuth from firebase.js
const { user, signIn: signInWithEmailAndPasswordMethod, signInWithGoogle } = useAuth();

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

// Computed properties for user's photo URL and name
const userPhotoURL = computed(() => {
  // Use a default icon if the email isn't Gmail or if the user doesn't have a photoURL
  const defaultIcon = '../assets/icon.png'; // Update this path to the correct location of your default icon
  return user.value?.photoURL || (user.value?.email?.endsWith('@gmail.com') ? user.value.photoURL : defaultIcon);
});

const userName = computed(() => user.value?.displayName || 'Default User Name');
</script>