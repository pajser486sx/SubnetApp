<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { subnetcalc } from "@/utils/subnetcalc.js";
import { useAuth } from "../composables/useAuth";

const aiExplanation = ref("");
const aiLoading = ref(false);
const aiError = ref("");
const saveMessage = ref("");
const explainedCalculation = ref(null);

const router = useRouter();

const { isLoggedIn, getAuthHeaders } = useAuth();

const ipAddress = ref("");
const cidr = ref(24);

const result = ref({
  subnetMask: "",
  networkAddress: "",
  broadcastAddress: "",
  firstUsableHost: "",
  lastUsableHost: "",
  totalAddresses: "",
  usableHosts: ""
});

watch([ipAddress, cidr], () => {
  result.value = {
    subnetMask: "",
    networkAddress: "",
    broadcastAddress: "",
    firstUsableHost: "",
    lastUsableHost: "",
    totalAddresses: "",
    usableHosts: ""
  };

  aiExplanation.value = "";
  aiError.value = "";
  saveMessage.value = "";
  explainedCalculation.value = null;
  errorMessage.value = "";
});

const errorMessage = ref("");

const goToRegister = () => {
  router.push("/register");
};

const goToUser = () => {
  if (isLoggedIn.value) {
    router.push("/user");
  } else {
    router.push("/login");
  }
};

const calculate = () => {
  try {
    errorMessage.value = "";
    result.value = subnetcalc(
      ipAddress.value,
      Number(cidr.value)
    );
  } catch (error) {
    errorMessage.value = error.message;
  }
};

const explainWithAI = async () => {
  aiError.value = "";
  saveMessage.value = "";
  if (!result.value.networkAddress) {
    aiError.value = "Calculate a subnet first.";
    return;
  }
  aiLoading.value = true;

  try {
    const calculation = {
      ipAddress: ipAddress.value,
      cidr: Number(cidr.value),
      results: { ...result.value }
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/ai/explain`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(calculation)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      aiError.value = data.message || "Could not generate explanation";
      return;
    }

    aiExplanation.value = data.explanation;
    explainedCalculation.value = calculation;

  } catch (error) {
     aiError.value = "Could not connect to the server";

  } finally {
    aiLoading.value = false;
  }
};

const saveExplanation = async () => {
  saveMessage.value = "";

  if (!aiExplanation.value || !explainedCalculation.value) {
    saveMessage.value = "Generate an explanation first.";
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/saved-explanations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          ...explainedCalculation.value,
          explanation: aiExplanation.value
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      saveMessage.value = data.message || "Could not save explanation";
      return;
    }
    saveMessage.value = "Explanation saved.";

  } catch (error) {
    saveMessage.value = "Could not connect to server";
  }
};
</script>

<template>
  <main>

    <button @click="goToUser">
      User
    </button>

    <div>
      <button @click="goToRegister">
        Register
      </button>
    </div>

    <hr>

    <h1>SUBNET CALCULATOR</h1>

    <section>

      <div>
        <label for="ip-address">
          IP Address
        </label>

        <br>

        <input
          id="ip-address"
          v-model="ipAddress"
          type="text"
          placeholder="ex: 192.168.1.130"
        >
      </div>

      <br>

      <div>
        <label for="cidr">
          CIDR Prefix
        </label>

        <br>

        <select
          id="cidr"
          v-model="cidr"
        >
          <option
            v-for="prefix in 33"
            :key="prefix - 1"
            :value="prefix - 1"
          >
            /{{ prefix - 1 }}
          </option>
        </select>
      </div>

      <br>

      <button @click="calculate">
        Calculate
      </button>

      <p
        v-if="errorMessage"
        class="mt-3"
      >
        {{ errorMessage }}
      </p>

      <button @click="explainWithAI">
        Explain with AI
      </button>

    </section>

    <hr>

    <section>

      <h2>Results</h2>

      <p>
        <strong>Subnet Mask:</strong>
        {{ result.subnetMask || "-" }}
      </p>

      <p>
        <strong>Network Address:</strong>
        {{ result.networkAddress || "-" }}
      </p>

      <p>
        <strong>Broadcast Address:</strong>
        {{ result.broadcastAddress || "-" }}
      </p>

      <p>
        <strong>First Usable Host:</strong>
        {{ result.firstUsableHost || "-" }}
      </p>

      <p>
        <strong>Last Usable Host:</strong>
        {{ result.lastUsableHost || "-" }}
      </p>

      <p>
        <strong>Total Number of Addresses:</strong>
        {{ result.totalAddresses || "-" }}
      </p>

      <p>
        <strong>Number of Usable Hosts:</strong>
        {{ result.usableHosts !== "" ? result.usableHosts : "-" }}
      </p>

    </section>

    <hr>

    <section class="mt-8">
      <h2>AI Explanation</h2>

      <p v-if="aiLoading">Loading explanation...</p>
      <p v-if="aiError" class="mt-3">{{ aiError }}</p>

      <div v-if="aiExplanation" class="mt-4 p-4 border border-gray-400 rounded-lg">
        <h3>Explanation: </h3>

        <p class="whitespace-pre-wrap leading-6">{{ aiExplanation }}</p>
      </div>

    </section>

    <button v-if="isLoggedIn && aiExplanation" type="button" @click="saveExplanation">Save Explanation</button>
    <p v-if="saveMessage" class="mt-3">{{ saveMessage }}</p>

  </main>
</template>