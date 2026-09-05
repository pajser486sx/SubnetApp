<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { House } from "lucide-vue-next";

const router = useRouter();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const goHome = () => {
  router.push("/");
};

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
  <main class="min-h-screen flex items-center justify-center p-6 text-cyan-500">

    <button
      type="button"
      @click="goHome"
      class="fixed top-6 left-6 p-3 bg-black border border-cyan-500 rounded-lg hover:bg-gray-900 cursor-pointer"
      title="Home"
    >
      <House class="w-6 h-6 text-cyan-500" />
    </button>

    <section
      class="w-full max-w-md bg-black border border-cyan-500 rounded-lg p-8"
    >
      <h1 class="text-3xl font-bold mb-6 text-center">
        REGISTER
      </h1>

      <form @submit.prevent="register" class="space-y-4">

        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full bg-gray-950 border border-cyan-500 rounded-md px-4 py-3 outline-none focus:ring-1 focus:ring-cyan-500"
        >

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full bg-gray-950 border border-cyan-500 rounded-md px-4 py-3 outline-none focus:ring-1 focus:ring-cyan-500"
        >

        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm password"
          class="w-full bg-gray-950 border border-cyan-500 rounded-md px-4 py-3 outline-none focus:ring-1 focus:ring-cyan-500"
        >

        <button
          type="submit"
          class="w-full bg-cyan-500 text-black px-4 py-3 border border-black rounded-md hover:bg-cyan-300 cursor-pointer font-bold"
        >
          REGISTER
        </button>

      </form>

      <p
        v-if="error"
        class="mt-4 text-red-500 text-center"
      >
        {{ error }}
      </p>

      <RouterLink
        to="/login"
        class="mt-6 block text-center text-cyan-400 hover:text-cyan-300 hover:underline"
      >
        Already have an account? Log in
      </RouterLink>
    </section>

  </main>
</template>
