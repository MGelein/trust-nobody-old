<script lang="ts">
  import { onMount } from "svelte";
  import { getQuizData } from "./util/api";
  import { getActiveUser, setActiveScore, setActiveUser } from "./util/storage";
  import type { Quiz } from "./util/api";
  import Login from "./components/Login.svelte";
  import QuizCard from "./components/QuizCard.svelte";
  import Back from "./icons/Back.svelte";

  let activeUser: string;
  let activeQuiz: Quiz | null = null;
  let quizzes: Quiz[];

  onMount(async () => {
    activeUser = getActiveUser();
    quizzes = await getQuizData();
  });
</script>

<main class="content">
  {#if !activeUser || activeUser.length < 1}
    <Login
      on:login={({ detail: { user } }) => {
        activeUser = user;
        setActiveUser(activeUser);
        setActiveScore(0);
      }}
    />
  {:else if activeQuiz}
    <h1 class="header">
      <div on:click={() => (activeQuiz = null)} class="back"><Back /></div>
      <span>{activeQuiz.name}</span>
      <span />
    </h1>
  {:else if quizzes?.length > 0}
    <h1 class="header"><span />Testen<span /></h1>
    <section class="quiz-wrap">
      {#each quizzes as quiz}
        <QuizCard
          {quiz}
          {quizzes}
          on:open={({ detail: { quiz } }) => (activeQuiz = quiz)}
        />
      {/each}
    </section>
  {/if}
</main>

<style lang="scss">
  .content {
    display: flex;
    align-items: center;
    flex-direction: column;
    position: absolute;
    inset: 0;
    margin: 2.4rem;
    gap: 2.4rem;
  }

  .back {
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: transform 0.2s ease-out;

    &:hover {
      color: var(--accent);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-content: center;
    justify-content: center;
    align-items: center;
    justify-items: center;
  }

  .quiz-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.4rem;
    width: min(100%, 60ch);
  }
</style>
