<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { savePlayerProfile } from '@/lib/storage'

const router = useRouter()
const name = ref('')
//const dateOfBirth = ref('')
const touched = ref(false)

/* const today = new Date().toISOString().slice(0, 10) */
const isValid = computed(() => name.value.trim().length >= 3)
//const isValid = computed(() => name.value.trim().length >= 3 && Boolean(dateOfBirth.value))

const submitProfile = () => {
  touched.value = true
  if (!isValid.value) return

  savePlayerProfile({
    name: name.value.trim(),
    /* dateOfBirth: dateOfBirth.value, */
  })
  router.push('/games')
  window.location.reload();
}
</script>

<template>
  <section class="onboarding-view">
    <form class="profile-panel" @submit.prevent="submitProfile">
      <div class="panel-copy">
        <h2>Vamos jogar?</h2>
        <p>As pontuações ficam neste dispositivo e seguem o nome que inseriu.</p>
      </div>

      <label class="field">
        <span>Nome</span>
        <input v-model="name" type="text" autocomplete="name" placeholder="Nome do jogador" />
      </label>

      <!-- <label class="field">
        <span>Date of birth</span>
        <input v-model="dateOfBirth" type="date" :max="today" />
      </label> -->

      <p v-if="touched && !isValid" class="form-error">
        O nome tem de ser válido, pelo menos 3 caracteres.
      </p>

      <button class="primary-button" type="submit">Começa a jogar</button>
    </form>
  </section>
</template>

<style scoped>
.onboarding-view {
  display: grid;
  min-height: 62vh;
  place-items: center;
  padding: 12px;
}

.profile-panel {
  display: grid;
  width: min(100%, 560px);
  gap: 18px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background:
    radial-gradient(circle at top right, rgba(255, 201, 60, 0.16), transparent 28%),
    linear-gradient(135deg, rgba(255, 71, 71, 0.24), rgba(14, 14, 14, 0.96));
}

.panel-copy {
  display: grid;
  gap: 8px;
}

.eyebrow {
  color: #ffb0b0;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
}

h2 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
}

p {
  color: rgba(255, 255, 255, 0.72);
}

.field {
  display: grid;
  gap: 8px;
}

.field span {
  color: rgba(255, 255, 255, 0.72);
  font-weight: 700;
}

.field input {
  min-height: 50px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 0 14px;
  background: rgba(0, 0, 0, 0.42);
  color: #fff;
  outline: none;
}

.field input:focus {
  border-color: #ff4747;
  box-shadow: 0 0 0 3px rgba(255, 71, 71, 0.18);
}

.form-error {
  color: #ffb0b0;
}
</style>
