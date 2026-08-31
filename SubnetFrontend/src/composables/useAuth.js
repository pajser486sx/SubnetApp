import { ref, computed } from "vue";

const TOKEN_KEY = "subnetToken";
const USER_KEY = "subnetUser";
const storedUser = localStorage.getItem(USER_KEY);

const token = ref(
  localStorage.getItem(TOKEN_KEY) || "");

const user = ref(
  storedUser ? JSON.parse(storedUser) : null
);

const isLoggedIn = computed(() => {
  return Boolean(token.value && user.value);
});

export const useAuth = () => {

  const saveAuth = (data) => {
    token.value = data.token;
    user.value = data.user;

    localStorage.setItem(
      TOKEN_KEY,
      data.token
    );

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(data.user)
    );
  };

  const logout = () => {
    token.value = "";
    user.value = null;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const getAuthHeaders = () => {
    if (!token.value) {
      return {};
    }
    return {
      Authorization: `Bearer ${token.value}`
    };
  };

  return {
    token,
    user,
    isLoggedIn,
    saveAuth,
    logout,
    getAuthHeaders
  };
};