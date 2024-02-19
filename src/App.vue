<template>
  <nav>
    <router-link to="/"><h1>UPchieve Chat</h1></router-link>
  </nav>
  <Nav />
  <Chat />
  <router-view />
</template>

<script>
import Nav from "@/components/Nav.vue";
import Chat from "@/components/Chat.vue";

export default {
  name: "App",
  components: { Nav, Chat },
};
</script>
