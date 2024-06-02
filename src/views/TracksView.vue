<template>
  <div>
    <header>
      <h1><i class="bi bi-card-list"></i>Stats-Tracks</h1>
      <h3 class="dnone">See your Spotify Listening Statistics</h3>
    </header>
    <section class="profile">
      <div class="user">
        <img id="profilePicture" src="#" />
        <div class="infos">
          <h3 id="displayName">.</h3>
          <p id="email"></p>
        </div>
      </div>
      <div class="links">
        <a href="https://github.com/KaazDW/Spotify-Stats-Tracks" target="_blank" class="btn dnone">See the project on Github <i class="bi bi-box-arrow-in-up-right"></i></a>
        <RouterLink class="btn" to="/">Log Out</RouterLink>
      </div>
    </section>

    <section class="nav">
      <p>Select your data period :</p>
      <div>
        <button @click="setActiveButton('long')" class="btn" :class="{ active: activeButton === 'long' }">Last Year</button>
        <button @click="setActiveButton('medium')" class="btn" :class="{ active: activeButton === 'medium' }">Last 6 months</button>
        <button @click="setActiveButton('short')" class="btn" :class="{ active: activeButton === 'short' }">Last month</button>
      </div>
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
  <small>© 2024 - Stat-Tracks. <br/>We are not related to Spotify AB or any of it´s partners in any way</small>

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

