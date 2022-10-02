<script lang="ts">
    import type { Quiz } from "src/util/api";
    import { getCompletedQuizzes } from "../util/storage";
    import { onMount, createEventDispatcher } from "svelte";

    export let quiz: Quiz;
    export let quizzes: Quiz[];

    const dispatch = createEventDispatcher();

    let completed = false;
    let next = false;

    onMount(() => {
        const quizNames = getCompletedQuizzes();
        completed = quizNames.some((name) => quiz.name === name);
        const nextQuiz = quizzes.find(
            (q) => !quizNames.some((name) => q.name === name)
        );
        next = nextQuiz.name === quiz.name;
    });

    function openQuiz() {
        if (next) dispatch("open", { quiz });
    }
</script>

<div class="quiz-card" class:completed class:next on:click={openQuiz}>
    <h2>{quiz.name}</h2>
</div>

<style lang="scss">
    .quiz-card {
        background: var(--background);
        border-radius: var(--radius);
        padding: 2.4rem;
        box-shadow: var(--shadow-medium);
        transition: transform 0.2s ease-out;
        display: flex;
        flex-direction: column;
        align-items: center;

        &.completed {
            background: var(--accent);
            cursor: default;
            box-shadow: none;
        }

        &.next {
            border: 0.2rem solid var(--accent);
            cursor: pointer;
            box-shadow: var(--shadow-soft);
        }

        &:hover {
            transform: translateY(-0.2rem);
        }

        &:active {
            transform: scale(0.95);
        }
    }
</style>
