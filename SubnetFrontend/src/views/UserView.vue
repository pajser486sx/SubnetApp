<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { marked } from "marked";
import { useAuth } from "../composables/useAuth";
import { House, Trash2 } from "lucide-vue-next";

const router = useRouter();

const goHome = () => {
  router.push("/");
};

const { user, logout, getAuthHeaders } = useAuth();

const explanations = ref([]);
const loading = ref(true);
const error = ref("");
const selectedExplanation = ref(null);

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

const openExplanation = (item) => {
  selectedExplanation.value = item;
};

const closeExplanation = () => {
  selectedExplanation.value = null;
};
const renderedExplanation = computed(() => {
  if (!selectedExplanation.value) {
    return "";
  }

  return marked.parse(selectedExplanation.value.explanation);
});

const deleteExplanation = async () => {
  if (!selectedExplanation.value) {
    return;
  }

  error.value = "";

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/saved-explanations/${selectedExplanation.value._id}`,
      {
        method: "DELETE",
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
      error.value = data.message || "Could not delete explanation";
      return;
    }

    explanations.value = explanations.value.filter(
      item => item._id !== selectedExplanation.value._id
    );

    closeExplanation();

  } catch (err) {
    error.value = "Could not connect to server";
  }
};

onMounted(() => {
  loadExplanations();
});
</script>

<template>
  <main class="max-w-4xl mx-auto p-8">
    <button
      type="button"
      @click="goHome"
      class="fixed top-6 left-6 p-3 bg-black border border-cyan-500 rounded-lg hover:bg-gray-900 cursor-pointer"
      title="Home">
  <House class="w-6 h-6 text-cyan-500" />
</button>

    <section class="flex items-center justify-between gap-4 mb-8 border-2 bg-black rounded-lg p-5">
      <div class="flex flex-wrap items-center gap-2">
        <h1 class="text-cyan-500 text-2xl font-bold">
          Currently logged in as:
        </h1>

        <p class="text-cyan-500 text-lg">
          {{ user?.email }}
        </p>
      </div>

      <button
        @click="logoutUser"
        class="bg-red-500 px-4 py-2 border border-black rounded-md hover:bg-cyan-500 cursor-pointer font-bold">
        LOG OUT
      </button>
    </section>

    <section>
      <h2 class="text-2xl font-semibold mb-4">
        Your saved explanations:
      </h2>

      <p v-if="loading">Loading...</p>

      <p v-else-if="error" class="mt-3">
        {{ error }}
      </p>

      <p v-else-if="explanations.length === 0">
        You have no saved explanations yet.
      </p>

      <div v-else class="flex flex-wrap gap-5">

        <button
          v-for="item in explanations"
          :key="item._id"
          type="button"
          @click="openExplanation(item)"
          class="w-50 h-50 p-4 bg-black text-cyan-500 border border-gray-500 rounded-lg text-left overflow-hidden hover:bg-gray-900 cursor-pointer">

          <h3 class="text-lg font-semibold mb-3">
            {{ item.ipAddress }}/{{ item.cidr }}
          </h3>

          <p class="text-sm">
            <b>Network:</b>
            {{ item.results.networkAddress }}
          </p>

          <p class="text-sm">
            <b>Hosts:</b>
            {{ item.results.usableHosts }}
          </p>

          <p class="text-sm mt-3 line-clamp-3">
            {{ item.explanation }}
          </p>

          <small class="block mt-3 opacity-60">
            {{ formatDate(item.createdAt) }}
          </small>

        </button>

      </div>
    </section>

    <div
      v-if="selectedExplanation" class="fixed inset-0 bg-black/50 flex items-center justify-center p-6"
      @click.self="closeExplanation">

      <article class="bg-black w-full max-w-3xl max-h-[80vh] overflow-y-auto p-6 rounded-lg">

        <div class="flex justify-between items-start mb-5">

          <h3 class="text-cyan-500 text-2xl font-semibold">
            {{ selectedExplanation.ipAddress }}/{{ selectedExplanation.cidr }}
          </h3>

          <div class="flex items-center gap-2">

            <button
              type="button"
               @click="deleteExplanation"
              class="p-2 bg-red-500 border border-black rounded-md hover:bg-cyan-500"
              title="Delete explanation">
              <Trash2 class="w-5 h-5 text-black" />
            </button>

            <button
              type="button"
              @click="closeExplanation"
              class="text-cyan-500 px-3 py-1 border border-cyan-500 rounded-md hover:bg-cyan-900 cursor-pointer">
              X
            </button>

          </div>
        </div>
        <div class="text-cyan-500">
        <p class="my-1">
          <b>Subnet Mask:</b>
          {{ selectedExplanation.results.subnetMask }}
        </p>

        <p class="my-1">
          <b>Network Address:</b>
          {{ selectedExplanation.results.networkAddress }}
        </p>

        <p class="my-1">
          <b>Broadcast Address:</b>
          {{ selectedExplanation.results.broadcastAddress }}
        </p>

        <p class="my-1">
          <b>First Usable Host:</b>
          {{ selectedExplanation.results.firstUsableHost || "-" }}
        </p>

        <p class="my-1">
          <b>Last Usable Host:</b>
          {{ selectedExplanation.results.lastUsableHost || "-" }}
        </p>

        <p class="my-1">
          <b>Total Addresses:</b>
          {{ selectedExplanation.results.totalAddresses }}
        </p>

        <p class="my-1">
          <b>Usable Hosts:</b>
          {{ selectedExplanation.results.usableHosts }}
        </p>

        <div class="mt-4 pt-4 border-t border-gray-300">
          <h4 class="font-semibold mb-3">
            AI Explanation
          </h4>
        </div>
          <div
            class="leading-6 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2
                   [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2
                   [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-2
                   [&_p]:my-2
                   [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2
                   [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2
                   [&_li]:my-1
                   [&_strong]:font-bold
                   [&_code]:bg-cyan-900 [&_code]:px-1 [&_code]:rounded"
            v-html="renderedExplanation">
          </div>

        </div>

        <small class="block mt-4 opacity-70">
          Saved: {{ formatDate(selectedExplanation.createdAt) }}
        </small>

      </article>

    </div>

  </main>
</template>