<script setup lang="ts">
const games = [
  {
    title: 'Jogo do Galo',
    copy: 'Joga contra um Computador que gosta de ganhar, bloqueiar ameaças e atacar o centro.',
    to: '/games/tic-tac-toe',
    stat: 'CPU',
  },
  {
    title: 'Memória',
    copy: 'Encontrar todos os pares de cartas iguais, quanto menos jogadas, mais pontos recebes.',
    to: '/games/memory',
    stat: '12 cartas',
  },
]
</script>

<template>
  <section class="games-view">
    <div class="hero">
      <p class="eyebrow">Jogos</p>
      <h2>Escolhe o próximo jogo.</h2>
      <!-- <p class="hero-copy">Two games are ready now, with the layout built to grow cleanly as more arrive.</p> -->
    </div>

    <div class="game-grid">
      <router-link v-for="game in games" :key="game.to" :to="game.to" class="game-card">
        <span class="game-card-heading">
          <strong>{{ game.title }}</strong>
          <span>{{ game.stat }}</span>
        </span>
        <p>{{ game.copy }}</p>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.games-view {
  display: grid;
  gap: 20px;
  padding: 12px;
}

.hero {
  padding: 28px 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background:
    radial-gradient(circle at top right, rgba(122, 199, 76, 0.18), transparent 28%),
    linear-gradient(135deg, rgba(99, 144, 240, 0.22), rgba(16, 16, 16, 0.96));
}

.eyebrow {
  color: #c7f0b2;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero h2 {
  margin-top: 10px;
  max-width: 14ch;
  font-size: clamp(2rem, 4vw, 3.1rem);
  font-weight: 800;
}

.hero-copy {
  max-width: 62ch;
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.74);
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.game-card {
  display: grid;
  gap: 12px;
  min-height: 180px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  color: #f4f4f4;
}

.game-card-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.game-card strong {
  font-size: 1.35rem;
  font-weight: 800;
}

.game-card span span,
.game-card p {
  color: rgba(255, 255, 255, 0.68);
}

.game-card:hover {
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);
}

@media (max-width: 720px) {
  .game-grid {
    grid-template-columns: 1fr;
  }

  .hero,
  .game-card {
    padding: 18px;
  }
}
</style>
