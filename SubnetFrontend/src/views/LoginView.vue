<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();

const {
  saveAuth
} = useAuth();

const email = ref("");
const password = ref("");
const error = ref("");

const login = async () => {
  error.value = "";

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email: email.value,
          password: password.value
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      error.value = data.message;
      return;
    }

    saveAuth(data);

    router.push("/");

  } catch (err) {
    error.value = "Could not connect to server";
  }
};
</script>
<template>
  <div>
    <h1>Login</h1>

    <form @submit.prevent="login">

      <input
        v-model="email"
        type="email"
        placeholder="Email"
      >

      <input
        v-model="password"
        type="password"
        placeholder="Password"
      >

      <button type="submit">
        Log in
      </button>

    </form>

    <p v-if="error">
      {{ error }}
    </p>

    <RouterLink to="/register">
      Don't have an account? Register
    </RouterLink>
  </div>
</template>