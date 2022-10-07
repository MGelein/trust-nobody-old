<script lang="ts">
  import { getUserScores, updateUserScore, type Score } from "../util/api";
  import { onMount } from "svelte";

  let scores: Score[] = [];

  onMount(async () => {
    const responseScores = await getUserScores();
    scores = responseScores.sort((a, b) => {
      if (a.score === b.score) return a.time - b.time;
      return b.score - a.score;
    });
  });

  function updateScore(score: Score) {
    updateUserScore(score.name, score.score, score.time, score.molCorrect);
  }
</script>

<main class="content">
  <h1>Scores</h1>
  <div class="wrap">
    {#each scores as score}
      <section class="score">
        <span class="name">
          {score.name}
        </span>
        <input
          class="number"
          type="number"
          bind:value={score.score}
          on:change={() => updateScore(score)}
        />
      </section>
    {/each}
  </div>
</main>

<style lang="scss">
  .content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    padding: 2.4rem;
    max-width: 60ch;
    gap: 2.4rem;
  }

  .wrap {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    width: 100%;
  }

  .number {
    text-align: center;
    font-size: 2rem;
    width: 6ch;
    background: var(--background-light);
    border-radius: var(--radius);
    border: none;
    box-shadow: var(--shadow-medium);

    &:hover,
    &:focus {
      outline: 0.2rem solid var(--accent);
    }
  }

  .score {
    background: var(--background);
    box-shadow: var(--shadow-medium);
    border-radius: var(--radius);
    padding: 2.4rem;
    display: flex;
    justify-content: space-between;
  }
</style>
