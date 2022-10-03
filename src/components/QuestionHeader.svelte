<script lang="ts">
    import type { Question } from "src/util/api";
    export let questions: Question[];
    export let numCompleted: number;
    export let activeQuestion: Question | null;
</script>

<section class="question-header">
    {#each questions as q, i}
        <span
            class="ball"
            class:active={activeQuestion === q}
            class:completed={i < numCompleted}
        />
    {/each}
</section>

<style lang="scss">
    .question-header {
        display: flex;
        justify-content: space-between;
        width: 100%;
        position: relative;
        z-index: 1;

        &::after {
            content: "";
            position: absolute;
            top: 50%;
            height: 0.2rem;
            width: 100%;
            transform: translateY(-50%);
            background: var(--accent);
            z-index: -1;
        }
    }

    .ball {
        display: flex;
        padding: 0.8rem;
        border-radius: 100vw;
        background: var(--background-dark);
        border: 0.2rem solid var(--accent);
        transition: transform 0.5s ease-out;

        &.completed {
            background: var(--accent);
        }

        &.active {
            transform: scale(1.5);
        }
    }
</style>
