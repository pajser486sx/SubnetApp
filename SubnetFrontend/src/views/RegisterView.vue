<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");

const register = async () => {
  error.value = "";

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
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

    router.push("/login");

  } catch (err) {
    error.value = "Could not connect to server";
  }
};
</script>

<template>
  <div>
    <h1>Register</h1>

    <form @submit.prevent="register">

      <input
        v-model="email"
        type="email"
        placeholder="Email"
      >

      <input v-model="password" type="password" placeholder="Password">

      <input v-model="confirmPassword" type="password" placeholder="Confirm password">

      <button type="submit">Register</button>

    </form>

    <p v-if="error">
      {{ error }}
    </p>

    <RouterLink to="/login">
      Already have an account? Log in
    </RouterLink>
  </div>
</template>
