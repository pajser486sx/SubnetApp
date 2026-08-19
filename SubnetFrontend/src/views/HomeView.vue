<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const ipAddress = ref("");
const cidr = ref(24);

//placeholders
const result = ref({
  subnetMask: "",
  networkAddress: "",
  broadcastAddress: "",
  firstUsableHost: "",
  lastUsableHost: "",
  totalAddresses: "",
  usableHosts: ""
});

const goToRegister = () => {
  router.push("/register");
};

const calculate = () => {
  console.log("IP:", ipAddress.value);
  console.log("CIDR:", cidr.value);

  
};

const explainWithAI = () => {
  console.log("AI explanation will be added later.");
};
</script>

<template>
  <main>

    <div>
      <button @click="goToRegister">Register</button>
    </div>

    <hr>

    <h1>SUBNET CALCULATOR</h1>
    <section>

      <div>
        <label for="ip-address">
          IP Address
        </label>

        <br>

        <input id="ip-address"
          v-model="ipAddress"
          type="text"
          placeholder="192.168.1.130"
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
        {{ result.usableHosts || "-" }}
      </p>

    </section>

    <hr>

  </main>
</template>