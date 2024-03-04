<template>
  <Nav />
  <router-view />
</template>

<script>
import Nav from "@/components/Nav.vue";
import Chat from "@/views/Chat.vue";

export default {
  name: "App",
  components: { Nav, Chat },
};
</script>
