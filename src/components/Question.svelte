<script lang="ts">
    import type { Question, User } from "../util/api";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let question: Question;
    export let users: User[];
</script>

<section class="question">
    <h2 class="question-text">{question.text}</h2>
    <div class="answers">
        {#if question.answers.length > 0}
            {#each question.answers as { correct, text }}
                <div
                    class="answer"
                    on:click={() => dispatch("answer", { correct })}
                >
                    {text}
                </div>
            {/each}
        {:else}
            {#each users as { name, isMol }}
                <div
                    class="answer"
                    on:click={() => dispatch("answer", { correct: isMol })}
                >
                    {name}
                </div>
            {/each}
        {/if}
    </div>
</section>

<style lang="scss">
    .question {
        margin-top: 2.4rem;
        width: 100%;

        &-text {
            text-align: center;
        }
    }

    .answers {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.2rem;
        margin-top: 2.4rem;
        width: 100%;
    }

    .answer {
        background: var(--background);
        box-shadow: var(--shadow-medium);
        border-radius: var(--radius);
        padding: 2.4rem;
        transition: transform 0.2s ease-out;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-content: center;
        font-weight: bold;

        &:hover {
            transform: scale(1.05);
        }

        &:active {
            transform: scale(0.95);
        }
    }
</style>
