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

    <section :style="{ display: displayLong ? 'block' : 'none' }" id="long">
      <!-- Contenu de la section long -->
      <p>Contenu de la section long</p>
    </section>

    <section :style="{ display: displayMedium ? 'block' : 'none' }" id="medium">
      <!-- Contenu de la section medium -->
      <p>Contenu de la section medium</p>
    </section>

    <section :style="{ display: displayShort ? 'block' : 'none' }" id="short">
      <!-- Contenu de la section short -->
      <p>Contenu de la section short</p>
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
  // Réinitialise l'affichage de toutes les sections à false
  displayLong.value = false;
  displayMedium.value = false;
  displayShort.value = false;

  // Active l'affichage de la section spécifiée
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
/* Ajoutez du CSS si nécessaire */
</style>
