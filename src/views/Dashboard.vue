<template>
  <div class="dashboard-container">
    <p>Dashboard</p>
    <Avatar :src="userPhotoURL" :alt="userName" />
    <p>Welcome, {{ userName }}</p>
    <button @click="signOut" class="text-gray-400 hover:text-white">
      Sign Out
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/firebase";
import Avatar from "../components/Avatar.vue";

const { user, username, signOut: signOutUser } = useAuth();
const router = useRouter();

const defaultIcon = "/icon.png";
const userPhotoURL = computed(() => user.value?.photoURL || defaultIcon);
const userName = computed(() => username.value || "Default User Name");

const signOut = async () => {
  signOutUser();
  router.push("/");
};

if (!user.value) {
  router.push("/");
}
</script>
