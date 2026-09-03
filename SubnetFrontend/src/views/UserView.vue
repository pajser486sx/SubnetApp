<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();

const { user, logout, getAuthHeaders } = useAuth();

const explanations = ref([]);
const loading = ref(true);
const error = ref("");

const loadExplanations = async () => {
    loading.value = true;
    error.value = "";

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/saved-explanations`,
        {
          headers: { ...getAuthHeaders() }
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        logout();
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        error.value = data.message || "Could not load explanations";
        return;
      }
      explanations.value = data;

    } catch (err) {
      error.value = "Could not connect to server";
    } finally {
      loading.value = false;
    }
  };
const logoutUser = () => {
  logout();
  router.push("/");
};
const formatDate = (date) => {
  return new Date(date).toLocaleString();
};
onMounted(() => { loadExplanations(); });

</script>

<template>
    <main class="max-w-4xl mx-auto p-8">

    <section
      class="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-400">
      <div>
        <h1 class="text-3xl font-bold">
          User
        </h1>
        <p class="mt-1 text-gray-600">{{ user?.email }} </p>
      </div>

      <button
        @click="logoutUser" class="px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-100 cursor-pointer">
        Log out
      </button>
    </section>

    <section>
      <h2 class="text-2xl font-semibold mb-4">Saved explanations</h2>
      <p v-if="loading">Loading...</p>

      <p v-else-if="error" class="mt-3">{{ error }}</p>

      <p v-else-if="explanations.length === 0">You have no saved explanations yet.</p>

      <div v-else class="flex flex-col gap-4">
        <article
          v-for="item in explanations" :key="item._id" class="p-5 border border-gray-400 rounded-lg">

          <h3 class="text-xl font-semibold mb-4">{{ item.ipAddress }}/{{ item.cidr }}</h3>

          <p class="my-1">
            <b>Subnet Mask:</b>
            {{ item.results.subnetMask }}
          </p>

          <p class="my-1">
            <b>Network Address:</b>
            {{ item.results.networkAddress }}
          </p>

          <p class="my-1">
            <b>Broadcast Address:</b>
            {{ item.results.broadcastAddress }}
          </p>

          <p class="my-1">
            <b>First Usable Host:</b>
            {{ item.results.firstUsableHost }}
          </p>

          <p class="my-1">
            <b>Last Usable Host:</b>
            {{ item.results.lastUsableHost }}
          </p>

          <p class="my-1">
            <b>Total Addresses: </b>
            {{ item.results.totalAddresses }}
          </p>

          <p class="my-1">
            <b>Usable Hosts:</b>
            {{ item.results.usableHosts }}
          </p>

          <div class="mt-4 pt-4 border-t border-gray-300">
            <h4 class="font-semibold mb-2">AI Explanation</h4>
            <p class="whitespace-pre-wrap leading-6">{{ item.explanation }}</p>
          </div>

          <small class="block mt-4 opacity-70">Saved: {{ formatDate(item.createdAt) }}</small>

        </article>

      </div>
    </section>
  </main>
</template>