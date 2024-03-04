<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <Avatar :src="userPhotoURL" :alt="userName" class="user-avatar" />
      <h1>Welcome, {{ userName }}</h1>
      <button @click="signOut" class="sign-out-btn">Sign Out</button>
    </div>
    <div class="rooms-container">
      <h2>Select a Room</h2>
      <div class="rooms">
        <div v-for="room in rooms" :key="room.name" class="room">
          <h3>{{ room.name }}</h3>
          <button @click="goToChat(room.name)" class="enter-room-btn">
            Enter Room
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/firebase";
import Avatar from "../components/Avatar.vue";

const { user, username, signOut: signOutUser } = useAuth();
const router = useRouter();

const rooms = [
  { name: "Math" },
  { name: "English" },
  { name: "Science" },
  { name: "College Counseling" },
  { name: "Social Studies" },
  { name: "SAT & ACT Prep" },
];

const defaultIcon = "/icon.png";
const userPhotoURL = computed(() => user.value?.photoURL || defaultIcon);
const userName = computed(() => username.value || "Default User Name");

const signOut = async () => {
  await signOutUser();
  router.push("/");
};

const goToChat = (roomName) => {
  router.push({ name: "Chat", query: { room: roomName } });
};
</script>
