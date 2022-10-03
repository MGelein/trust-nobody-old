<script lang="ts">
    import { getUserScores, type Score, type User } from "../util/api";
    import { onMount } from "svelte";
    import { scale } from "svelte/transition";

    export let users: User[];
    let scores: Score[] = [];
    let testName = "";
    let first: Score;
    let second: Score;
    let third: Score;
    let mol: User;
    let imageUrl: string | null = null;
    let submitting = false;

    onMount(async () => {
        scores = await getUserScores();
        scores.sort((a, b) => {
            if (a.score === b.score) return a.time - b.time;
            return a.score - b.score;
        });

        first = scores[0];
        second = scores[1];
        third = scores[2];

        mol = users.find((user) => user.isMol);
    });

    function nameCompare(name: string, score: Score | undefined) {
        if (!score || !name) return false;
        return name.toLowerCase() === score.name.toLowerCase();
    }

    function submit() {
        if (nameCompare(testName, first)) imageUrl = "gold.svg";
        if (nameCompare(testName, second)) imageUrl = "silver.svg";
        if (nameCompare(testName, third)) imageUrl = "bronze.svg";

        submitting = true;
        setTimeout(() => (submitting = false), 1000);

        testName = "";
    }

    function handleInput(e: KeyboardEvent) {
        if (e.key === "Enter") submit();
        else imageUrl = null;
    }
</script>

<img class="logo" src="logo.png" alt="logo" />
<input
    bind:value={testName}
    class="input"
    type="text"
    on:keydown={handleInput}
    class:submitting
/>
{#if imageUrl}
    <img transition:scale src={imageUrl} alt="result" class="result" />
{/if}

<style lang="scss">
    .logo {
        max-width: 80vw;
        max-height: 40vh;
    }

    .result {
        max-width: 80vw;
        max-height: 40vh;
    }

    .input {
        font-size: 4rem;
        background: var(--background);
        border: 0.2rem solid var(--background-light);
        padding: 0.8rem;
        border-radius: var(--radius);
        color: var(--foreground);
        text-align: center;
        box-shadow: var(--shadow-soft);

        &:focus {
            outline: 0.2rem solid var(--accent);
        }

        &.submitting {
            animation: bulge 0.5s ease-in-out forwards;
        }
    }

    @keyframes bulge {
        0% {
            transform: scale(1);
        }

        50% {
            transform: scale(1.1);
        }

        100% {
            transform: scale(1);
        }
    }
</style>
