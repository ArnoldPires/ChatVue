<template>
  <div class="auth-container">
    <div v-if="isLogin" class="login">
      <!-- Display the user's photo or a default icon -->
      <Avatar :src="userPhotoURL" :alt="userName" />
      <p>{{ userName }}</p>
      <!-- Sign out button -->
      <button @click="signOut" class="text-gray-400 hover:text-white">
        Sign Out
      </button>
    </div>

    <div v-else>
      <!-- Sign in with Google button -->
      <button @click="signInWithGoogle" class="bg-blue-500 hover:bg-blue-600">
        Sign In with Google
      </button>

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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/firebase";
import Avatar from "../components/Avatar.vue";
import defaultIcon from "../../public/icon.png";

const email = ref("");
const password = ref("");
const router = useRouter();
const {
  user,
  isLogin,
  signOut,
  signIn: signInWithEmailAndPasswordMethod,
  signInWithGoogle,
} = useAuth();

const signInWithEmail = async () => {
  try {
    await signInWithEmailAndPasswordMethod(email.value, password.value);
    console.log("Successfully signed in");
    router.push("/");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Sign-in error:", errorMessage);
    alert(errorMessage);
  }
};

const userPhotoURL = computed(() => {
  // Cast user.value to any to bypass TypeScript checks
  const userValue: any = user.value;
  return userValue?.photoURL || defaultIcon;
});

const userName = computed(() => {
  const userValue: any = user.value;
  return userValue?.displayName || "Default User Name";
});
</script>
