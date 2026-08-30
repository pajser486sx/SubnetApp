import { ref, computed } from "vue";

const token = ref(
  localStorage.getItem("subnetToken")
);

const storedUser = localStorage.getItem("subnetUser");

const user = ref(
  storedUser ? JSON.parse(storedUser) : null
);

export const useAuth = () => {
  const isLoggedIn = computed(() => {
    return !!token.value;
  });

  const saveAuth = (data) => {
    token.value = data.token;
    user.value = data.user;

    localStorage.setItem(
      "subnetToken",
      data.token
    );

    localStorage.setItem(
      "subnetUser",
      JSON.stringify(data.user)
    );
  };

  const logout = () => {
    token.value = null;
    user.value = null;

    localStorage.removeItem("subnetToken");
    localStorage.removeItem("subnetUser");
  };

  return {
    token,
    user,
    isLoggedIn,
    saveAuth,
    logout
  };
};