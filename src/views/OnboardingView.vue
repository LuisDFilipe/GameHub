<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { savePlayerProfile } from '@/lib/storage'

const router = useRouter()
const name = ref('')
const dateOfBirth = ref('')
const touched = ref(false)

const today = new Date().toISOString().slice(0, 10)
const isValid = computed(() => name.value.trim().length >= 2 && Boolean(dateOfBirth.value))

const submitProfile = () => {
  touched.value = true
  if (!isValid.value) return

  savePlayerProfile({
    name: name.value.trim(),
    dateOfBirth: dateOfBirth.value,
  })
  router.push('/games')
}
</script>

<template>
  <section class="onboarding-view">
    <form class="profile-panel" @submit.prevent="submitProfile">
      <div class="panel-copy">
        <p class="eyebrow">Arcade profile</p>
        <h2>Ready when you are.</h2>
        <p>Scores stay on this device and follow the name you enter here.</p>
      </div>

      <label class="field">
        <span>Name</span>
        <input v-model="name" type="text" autocomplete="name" placeholder="Player name" />
      </label>

      <label class="field">
        <span>Date of birth</span>
        <input v-model="dateOfBirth" type="date" :max="today" />
      </label>

      <p v-if="touched && !isValid" class="form-error">
        Enter a name and date of birth to continue.
      </p>

      <button class="primary-button" type="submit">Start playing</button>
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
  text-transform: uppercase;
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
