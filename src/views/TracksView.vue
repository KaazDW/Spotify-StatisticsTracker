<script setup lang="ts">
import { initializeApp} from '@/script.ts';

initializeApp();

</script>

<template>
  <div class="about">
    <section id="profile">
      <RouterLink class="btn" to="/">Home<i class="bi bi-arrow-up-right-square-fill" style="color: var(--color-black);"></i></RouterLink>
      <RouterLink class="btn" to="/login">Login<i class="bi bi-arrow-up-right-square-fill" style="color: var(--color-black);"></i></RouterLink>
      <img id="avatar" width="200" src="#" />
      <ul>
        <li>Logged in as <span id="displayName"></span></li>
        <li>User ID: <span id="id"></span></li>
        <li>Email: <span id="email"></span></li>
        <li>Profile Image: <span id="imgUrl"></span></li>
      </ul>
      <section id="long">

      </section>
    </section>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
