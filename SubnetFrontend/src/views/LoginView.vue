<script setup>
</script>
<template>
  <div>
    <h1>Log in</h1>

    <form>
      <label>Email</label>
      <input
        type="email"
        placeholder="Enter your email"
      />

      <label>Password</label>
      <input
        type="password"
        placeholder="Enter your password"
      />

      <button type="submit">
        Log in
      </button>
    </form>

    <p>
      Don't have an account?
      <RouterLink to="/register">Register</RouterLink>
    </p>
  </div>
</template>