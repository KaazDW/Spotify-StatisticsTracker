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
      <button @click="setActiveButton('long')" :class="{ active: activeButton === 'long' }">All time</button>
      <button @click="setActiveButton('medium')" :class="{ active: activeButton === 'medium' }">6 months</button>
      <button @click="setActiveButton('short')" :class="{ active: activeButton === 'short' }">Last month</button>
    </section>

    <section :style="{ display: displayLong ? 'block' : 'none' }" class="listing">
      <div id="longArtists"></div>
      <div id="longSongs"></div>
    </section>

    <section :style="{ display: displayMedium ? 'block' : 'none' }" class="listing">
      <div id="mediumArtists"></div>
      <div id="mediumSongs"></div>
    </section>

    <section :style="{ display: displayShort ? 'block' : 'none' }" class="listing">
      <div id="shortArtists"></div>
      <div id="shortSongs"></div>
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
const activeButton = ref('home');

const setActiveButton = (button) => {
  activeButton.value = button;
  displaySection(button);
};
setActiveButton('long');
</script>

<style scoped>
</style>
