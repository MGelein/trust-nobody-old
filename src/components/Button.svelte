<script lang="ts">
    export let color: "default" | "accent" = "default";
    export let block: boolean = false;
</script>

<button on:click class="button" class:block class:accent={color === "accent"}>
    <slot />
</button>

<style lang="scss">
    .button {
        background: var(--background-light);
        color: var(--foreground);
        font-size: 2rem;
        border: none;
        padding: 1.2rem 2.4rem;
        border-radius: var(--radius);
        cursor: pointer;
        box-shadow: var(--shadow-medium);
        font-weight: bold;
        transition: transform 0.2s ease-out;

        &:active {
            transform: scale(0.95);
        }

        &.block {
            width: 100%;
        }

        &.accent {
            background-color: var(--accent);
        }
    }
</style>
