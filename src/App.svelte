<script lang="ts">
  import { onMount } from "svelte";
  import { getQuizData, getUserData } from "./util/api";

  onMount(async () => {
    const data = await getQuizData();
    const users = await getUserData();
  });
</script>

<main>Yoo</main>
