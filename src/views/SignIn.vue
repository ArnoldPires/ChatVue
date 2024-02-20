<template>
  <div class="auth-container">
    <div v-if="isLogin" class="login">
      <!-- Display the user's photo or a default icon, and the username or "Welcome" message -->
      <Avatar :src="userPhotoURL" :alt="username" />
      <p>Welcome, {{ username }}</p>
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
      <button @click="signInWithGoogle" class="bg-blue-500 hover:bg-blue-600">
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

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth, firestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import Avatar from "../components/Avatar.vue";
import defaultIcon from "../../public/icon.png";

const email = ref("");
const password = ref("");
const router = useRouter();
const {
  user,
  isLogin,
  signIn: signInWithEmailAndPasswordMethod,
  signInWithGoogle,
  signOut,
} = useAuth();

const username = ref("Default User Name"); // New ref for username

// Fetch username from Firestore
async function fetchUsername() {
  if (user.value) {
    const userDocRef = doc(firestore, "users", user.value.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      username.value = userDoc.data().username; // Set the fetched username
    } else {
      console.log("No username found in Firestore.");
    }
  }
}

// Fetch the username once the user is confirmed to be logged in
onMounted(async () => {
  if (isLogin.value) {
    await fetchUsername();
  }
});

const signInWithEmail = async () => {
  try {
    await signInWithEmailAndPasswordMethod(email.value, password.value);
    await fetchUsername(); // Fetch username after successful sign-in
    console.log("Successfully signed in");
    router.push("/");
  } catch (error) {
    console.error("Sign-in error:", error);
    alert(error.message);
  }
};

const userPhotoURL = ref(defaultIcon); // Initialize with default icon

// Update userPhotoURL if user is logged in
onMounted(() => {
  if (user.value?.photoURL) {
    userPhotoURL.value = user.value.photoURL;
  }
});
</script>
