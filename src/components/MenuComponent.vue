<script setup lang="ts">
import packageInfo from '../../package.json'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const appVersion = packageInfo.version
const isOpen = ref(false)
const route = useRoute()

const navItems = [
  {
    to: '/',
    label: 'Jogos',
    icon: 'M4 7h16M4 12h16M4 17h16',
  },
  {
    to: '/games/tic-tac-toe',
    label: 'Jogo do Galo',
    icon: 'M5 5l14 14M19 5 5 19M12 3v18M3 12h18',
  },
  {
    to: '/games/memory',
    label: 'Memória',
    icon: 'M8 4h8a2 2 0 0 1 2 2v12H6V6a2 2 0 0 1 2-2ZM8 8h8M8 12h5',
  },
  {
    to: '/scores',
    label: 'Pontuação',
    icon: 'M6 20V10M12 20V4M18 20v-7',
  },
]

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

watch(
  () => route.path,
  () => {
    closeMenu()
  },
)
</script>

<template>
  <nav class="nav-container">
    <Transition name="fade">
      <div v-if="isOpen" class="overlay" @click="closeMenu"></div>
    </Transition>

    <button
      class="burger-btn"
      :class="{ 'is-active': isOpen }"
      type="button"
      aria-label="Toggle menu"
      @click="toggleMenu"
    >
      <span class="line"></span>
      <span class="line"></span>
      <span class="line"></span>
    </button>

    <div class="nav-drawer" :class="{ open: isOpen }">
      <div class="version-tag">v{{ appVersion }}</div>
      <div class="drawer-content">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          @click="closeMenu"
        >
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              :d="item.icon"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>{{ item.label }}</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 100vh;
  background-color: #0d0d0d;
  border-right: 1px solid #333;
}

.burger-btn {
  display: none;
}

.version-tag {
  padding: 10px 20px;
  color: #444;
  font-size: 12px;
  text-align: center;
}

.nav-drawer {
  width: 100%;
  height: 100%;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 40px 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-radius: 12px;
  color: #888;
  font-size: 1.05rem;
  text-decoration: none;
  transition: 0.3s;
}

.nav-icon {
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
}

.nav-item:hover,
.active {
  background: #1a1a1a;
  color: #ff4747;
}

.overlay {
  display: none;
}

@media (max-width: 1024px) {
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 1999;
    display: block;
    background: rgba(0, 0, 0, 0.5);
    pointer-events: auto;
  }

  .nav-container {
    width: 100%;
    height: auto;
    padding: 20px;
    background: transparent;
    border-right: none;
    pointer-events: none;
  }

  .burger-btn {
    position: relative;
    z-index: 2001;
    display: flex;
    width: fit-content;
    flex-direction: column;
    gap: 6px;
    padding: 12px;
    border: 1px solid #333;
    border-radius: 8px;
    background: #1a1a1a;
    pointer-events: auto;
  }

  .line {
    width: 24px;
    height: 2px;
    background-color: white;
    transition: 0.3s;
  }

  .burger-btn.is-active .line:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .burger-btn.is-active .line:nth-child(2) {
    opacity: 0;
  }

  .burger-btn.is-active .line:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }

  .nav-drawer {
    position: fixed;
    top: 0;
    left: -220px;
    z-index: 2000;
    width: 220px;
    height: 100vh;
    background-color: #0d0d0d;
    border-right: 1px solid #333;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: auto;
  }

  .nav-drawer.open {
    transform: translateX(220px);
  }

  .drawer-content {
    padding-top: 36px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
