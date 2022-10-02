<script lang="ts">
  import { onMount } from "svelte";
  import { getQuizData } from "./util/api";

  onMount(async () => {
    const data = await getQuizData();
  });
</script>

<main>Yoo</main>
