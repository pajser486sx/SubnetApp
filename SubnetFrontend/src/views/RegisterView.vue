<script setup>
</script>
<template>
  <div>
    <h1>Register</h1>

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

      <label>Confirm password</label>
      <input
        type="password"
        placeholder="Confirm your password"
      />

      <button type="submit">
        Register
      </button>
    </form>

    <p>
      Already have an account?
      <RouterLink to="/login">Log in</RouterLink>
    </p>
  </div>
</template>