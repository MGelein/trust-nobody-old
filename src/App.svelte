<script lang="ts">
  import { onMount } from "svelte";
  import { getQuizData } from "./util/api";
  import { getActiveUser, setActiveScore, setActiveUser } from "./util/storage";
  import type { Quiz } from "./util/api";
  import Login from "./components/Login.svelte";

  let activeUser: string;
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
  {/if}
</main>

<style lang="scss">
  .content {
    display: flex;
    align-items: center;
    flex-direction: column;
    position: absolute;
    inset: 0;
  }
</style>
