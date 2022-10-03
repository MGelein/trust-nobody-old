<script lang="ts">
  import { onMount } from "svelte";
  import { getQuizData, getUserData } from "./util/api";
  import {
    getActiveScore,
    getActiveTime,
    getActiveUser,
    getCompletedQuizzes,
    setActiveScore,
    setActiveTime,
    setActiveUser,
    setCompletedQuizzes,
  } from "./util/storage";
  import type { Quiz, Question as QuestionType, User } from "./util/api";
  import Login from "./components/Login.svelte";
  import QuizCard from "./components/QuizCard.svelte";
  import Back from "./icons/Back.svelte";
  import QuestionHeader from "./components/QuestionHeader.svelte";
  import Question from "./components/Question.svelte";

  let activeUser: string;
  let activeQuiz: Quiz | null = null;
  let activeQuestion: QuestionType | null = null;
  let quizzes: Quiz[];
  let users: User[] = [];
  let quizStart: number = 0;

  onMount(async () => {
    activeUser = getActiveUser();
    quizzes = await getQuizData();
    users = await getUserData();
  });

  function answerQuestion(correct: boolean) {
    if (correct) {
      setActiveScore(getActiveScore() + 1);
    }

    const nextIndex = activeQuiz.questions.indexOf(activeQuestion) + 1;
    if (nextIndex < activeQuiz.questions.length) {
      activeQuestion = activeQuiz.questions[nextIndex];
    } else {
      const completedQuizzes = getCompletedQuizzes();
      setCompletedQuizzes([...completedQuizzes, activeQuiz.name]);
      activeQuiz = null;
      activeQuestion = null;

      const elapsed = Date.now() - quizStart;
      setActiveTime(elapsed + getActiveTime());

      if (getCompletedQuizzes().length === quizzes.length) {
        console.log("done");
      }
    }
  }
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
    <QuestionHeader
      questions={activeQuiz.questions}
      numCompleted={activeQuiz.questions.indexOf(activeQuestion) + 1}
      {activeQuestion}
    />
    {#if activeQuestion}
      <Question
        {users}
        question={activeQuestion}
        on:answer={({ detail: { correct } }) => answerQuestion(correct)}
      />
    {/if}
  {:else if quizzes?.length > 0}
    <h1 class="header">
      <span />
      <span>
        Welkom {activeUser}
      </span>
      <span />
    </h1>
    <section class="quiz-wrap">
      {#each quizzes as quiz}
        <QuizCard
          {quiz}
          {quizzes}
          on:open={({ detail: { quiz } }) => {
            activeQuiz = quiz;
            activeQuestion = quiz.questions[0];
            quizStart = Date.now();
          }}
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
    margin: 2.4rem auto;
    gap: 2.4rem;
    padding: 0 2.4rem;
    max-width: 60ch;
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
    grid-template-columns: 1em 1fr 1em;
    align-content: center;
    justify-content: center;
    align-items: center;
    justify-items: center;
    width: 100%;
  }

  .quiz-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.4rem;
    width: min(100%, 60ch);
  }
</style>
