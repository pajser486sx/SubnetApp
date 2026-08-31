<script setup>
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();

const {
  isLoggedIn
} = useAuth();

const openUserPage = () => {
  if (isLoggedIn.value) {
    router.push("/user");
  } else {
    router.push("/login");
  }
};

</script>

<template>

  <button @click="openUserPage">
    U
  </button>

</template>

