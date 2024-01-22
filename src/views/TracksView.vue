<template>
  <div>
<!--    <section id="profile">-->
<!--      <RouterLink class="btn" to="/">Home<i class="bi bi-arrow-up-right-square-fill" style="color: var(&#45;&#45;color-black);"></i></RouterLink>-->
<!--      <RouterLink class="btn" to="/login">Login<i class="bi bi-arrow-up-right-square-fill" style="color: var(&#45;&#45;color-black);"></i></RouterLink>-->
<!--      <ul>-->
<!--        <li>Logged in as <span id="displayName"></span></li>-->
<!--        <li>Email: <span id="email"></span></li>-->
<!--      </ul>-->
<!--    </section>-->

    <header>
      <div class="user">
        <img id="profilePicture" src="#" />
        <div class="infos">
          <h3 id="displayName">.</h3>
          <p id="email"></p>
        </div>
      </div>
      <div class="links">
        <RouterLink class="btn" to="/">Home</RouterLink>
        <RouterLink class="btn" to="/login">Refresh</RouterLink>
      </div>
    </header>
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
