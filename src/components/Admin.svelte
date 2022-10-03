<script lang="ts">
    import {
        getUserScores,
        resetUserScores,
        type Score,
        type User,
    } from "../util/api";
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import Button from "./Button.svelte";
    import Error from "../icons/Error.svelte";
    import Close from "../icons/Close.svelte";

    export let users: User[];
    let scores: Score[] = [];
    let testName = "";
    let first: Score;
    let second: Score;
    let third: Score;
    let mol: User;
    let imageUrl: string | null = null;
    let submitting = false;
    let resetting = false;
    let feedback: string[] = [];

    onMount(async () => {
        const newFeedback = [];
        scores = await getUserScores();
        scores.sort((a, b) => {
            if (a.score === b.score) return a.time - b.time;
            return a.score - b.score;
        });

        if (scores.length < 1) newFeedback.push("Geen scores gevonden");

        first = scores[0];
        if (!first) newFeedback.push("Geen eerste positie gevonden");
        second = scores[1];
        if (!second) newFeedback.push("Geen tweede positie gevonden");
        third = scores[2];
        if (!third) newFeedback.push("Geen derde positie gevonden");

        mol = users.find((user) => user.isMol);
        if (!mol) newFeedback.push("Geen mol gevonden");

        feedback = [...newFeedback];
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

<main class="content">
    <img
        class="logo"
        src="logo.png"
        alt="logo"
        on:click={() => (resetting = true)}
    />
    <input
        bind:value={testName}
        class="input"
        type="text"
        on:keydown={handleInput}
        class:submitting
    />

    {#each feedback as line (line)}
        <p
            transition:fade
            class="error"
            on:click={() =>
                (feedback = feedback.filter((item) => item !== line))}
        >
            <Error />{line}<Close />
        </p>
    {/each}

    {#if imageUrl}
        <img transition:fade src={imageUrl} alt="result" class="result" />
    {/if}

    {#if resetting}
        <section class="modal-wrap" transition:fade>
            <div class="modal" transition:fly={{ y: -200 }}>
                <h1>Weet je zeker dat je wilt resetten?</h1>
                <p>Alle spelerscores zijn hierna onherstelbaar verloren!</p>
                <div class="button-row">
                    <Button
                        block
                        on:click={() => {
                            resetting = false;
                            resetUserScores();
                            users = [];
                            scores = [];
                            first = null;
                            second = null;
                            third = null;
                            mol = null;
                        }}
                        color="accent">Bevestigen</Button
                    >
                    <Button block on:click={() => (resetting = false)}
                        >Annuleren</Button
                    >
                </div>
            </div>
        </section>
    {/if}
</main>

<style lang="scss">
    .content {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .error {
        margin: 0.4rem;
        border-radius: var(--radius);
        padding: 0.8rem;
        background: var(--accent);
        font-size: 2rem;
        cursor: pointer;
        transition: transform 0.2s ease-out;
        display: flex;
        align-items: center;
        gap: 1.2rem;
        user-select: none;

        &:hover {
            transform: scale(1.05);
        }
    }

    .modal {
        background: var(--background);
        box-shadow: var(--shadow-soft);
        padding: 2.4rem;
        border-radius: var(--radius);
        display: flex;
        flex-direction: column;
        gap: 2.4rem;

        &-wrap {
            background: rgba(0, 0, 0, 0.8);
            position: absolute;
            inset: 0;
            display: grid;
            place-items: center;
            z-index: 4;
        }
    }

    .button-row {
        display: flex;
        width: 100%;
        gap: 1.2rem;
    }

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
        z-index: 1;

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
