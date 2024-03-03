<template>
  <h1>Create an Account</h1>
  <form @submit.prevent="register">
    <p>
      <label for="registerWithEmail">Email</label>
      <input
        type="email"
        id="registerWithEmail"
        placeholder="Email"
        v-model="email"
        required
      />
    </p>
    <p>
      <label for="registerWithUsername">Username</label>
      <input
        type="text"
        id="registerWithUsername"
        placeholder="Username"
        v-model="username"
        required
      />
    </p>
    <p>
      <label for="registerWithPassword">Password</label>
      <input
        type="password"
        id="registerWithPassword"
        placeholder="Password"
        v-model="password"
        required
      />
    </p>
    <button type="submit" class="submit-button">Submit</button>
  </form>
  <button @click="handleGoogleSignIn" class="bg-blue-500 hover:bg-blue-600">
    Register with Google
  </button>
  <div class="signIn">
    <p>
      Already have an account? Login
      <RouterLink to="/" class="nav-link">here.</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth, firestore } from "@/firebase"; // Make sure to export firestore from firebase.js
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import setDoc for Firestore

const email = ref("");
const password = ref("");
const username = ref(""); // Add a ref for the username
const router = useRouter();

// Function to save username in Firestore
async function saveUsername(userId, username) {
  await setDoc(doc(firestore, "users", userId), {
    username: username,
  });
}

const register = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    console.log("Successfully registered!");
    await saveUsername(userCredential.user.uid, username.value); // Save the username in Firestore
    router.push("/dashboard");
  } catch (error) {
    console.error("Registration error:", error);
    alert(error.message);
  }
};

const handleGoogleSignIn = async () => {
  const googleProvider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Successfully signed in with Google");
    const user = result.user;
    // Check if username exists, if not, save the Google name as the username
    await saveUsername(user.uid, user.displayName || "Google User");
    router.push("/dashboard");
  } catch (error) {
    console.error("Google Sign-in error:", error);
    alert(error.message);
  }
};
</script>
