<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import MenuComponent from './components/MenuComponent.vue'
import { readPlayerProfile } from './lib/storage'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const route = useRoute()
const installPrompt = ref<BeforeInstallPromptEvent | null>(null)
const isStandalone = ref(false)
const profile = computed(() => readPlayerProfile())

const canInstall = computed(() => Boolean(installPrompt.value) && !isStandalone.value)

const updateStandaloneState = () => {
  isStandalone.value =
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
}

const handleBeforeInstallPrompt = (event: Event) => {
  event.preventDefault()
  installPrompt.value = event as BeforeInstallPromptEvent
}

const installApp = async () => {
  if (!installPrompt.value) return

  const promptEvent = installPrompt.value
  await promptEvent.prompt()
  await promptEvent.userChoice
  installPrompt.value = null
  updateStandaloneState()
}

onMounted(() => {
  updateStandaloneState()
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', updateStandaloneState)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', updateStandaloneState)
})
</script>

<template>
  <div class="app-wrapper">
    <header class="page-header">
      <div class="profile-line">
        <span v-if="profile">Jogador: {{ profile.name }}</span>
        <button v-if="canInstall" class="install-button" type="button" @click="installApp">
          Instalar
        </button>
      </div>

      <h1 class="main-title">
        {{ route.meta.title }}
      </h1>
      <p v-if="route.meta.description" class="section-description">
        {{ route.meta.description }}
      </p>
    </header>

    <MenuComponent v-if="profile" />

    <main class="content-area" :class="{ 'content-area--solo': !profile }">
      <router-view />
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  background:
    radial-gradient(circle at top, rgba(255, 71, 71, 0.14), transparent 32%),
    linear-gradient(180deg, #0b0b0b 0%, #000 100%);
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 100vh;
  margin-left: 200px;
  transition: margin-left 0.3s ease;
}

.content-area {
  width: min(1600px, 100%);
  margin: 0 auto;
  padding: 0 10px 32px;
}

.content-area--solo {
  width: min(760px, 100%);
}

.page-header {
  display: grid;
  gap: 6px;
  text-align: center;
  padding: 10px 10px 8px;
}

.profile-line {
  min-height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.92rem;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0;
  color: #ff4747;
  text-shadow: 1px 1px 5px rgba(255, 255, 255, 0.5);
}

.section-description {
  color: rgba(255, 255, 255, 0.68);
}

.install-button,
.primary-button,
.secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  border: 0;
  border-radius: 999px;
  padding: 0 18px;
  color: #fff;
  font-weight: 800;
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
}

.install-button,
.primary-button {
  background: #ff4747;
}

.secondary-button {
  background: #1a1a1a;
  border: 1px solid #333;
}

.install-button:hover,
.primary-button:hover,
.secondary-button:hover {
  transform: translateY(-1px);
}

.install-button:hover,
.primary-button:hover {
  background: #ff5a5a;
}

.secondary-button:hover {
  border-color: rgba(255, 255, 255, 0.22);
}

@media (max-width: 1024px) {
  .app-wrapper {
    margin-left: 0;
  }

  .main-title {
    font-size: 2.5rem;
  }

  .content-area {
    padding-bottom: 28px;
  }
}

@media (max-width: 560px) {
  .page-header {
    padding-top: 12px;
  }

  .content-area--solo + .page-header,
  .content-area--solo {
    padding-top: 0;
  }

  .main-title {
    font-size: 2.1rem;
  }

  .profile-line {
    justify-content: flex-end;
    padding-right: 8px;
  }
}
</style>
