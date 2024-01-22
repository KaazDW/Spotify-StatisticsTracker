<template>
  <div>
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
    </section>
    <section class="nav">
      <button @click="displaySection('long')">Long Term</button>
      <button @click="displaySection('medium')">Medium Term</button>
      <button @click="displaySection('short')">Short Term</button>
    </section>

    <section :style="{ display: displayLong ? 'block' : 'none' }" id="long" class="listing">
    </section>

    <section :style="{ display: displayMedium ? 'block' : 'none' }" id="medium" class="listing">
    </section>

    <section :style="{ display: displayShort ? 'block' : 'none' }" id="short" class="listing">
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { initializeApp} from '@/script.ts';

initializeApp();

const displayLong = ref(true);
const displayMedium = ref(false);
const displayShort = ref(false);

const displaySection = (section) => {
  displayLong.value = false;
  displayMedium.value = false;
  displayShort.value = false;

  if (section === 'long') {
    displayLong.value = true;
  } else if (section === 'medium') {
    displayMedium.value = true;
  } else if (section === 'short') {
    displayShort.value = true;
  }
};
</script>

<style scoped>
</style>
