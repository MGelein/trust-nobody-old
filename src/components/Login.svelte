<script lang="ts">
    import Button from "./Button.svelte";
    import { createEventDispatcher, onMount } from "svelte";
    import { getUserData, type User } from "../util/api";

    const dispatch = createEventDispatcher();

    let username = "";
    let password = "";
    let feedback = "";
    let users: User[] = [];

    onMount(async () => {
        users = await getUserData();
    });

    function login() {
        const user = users.find((user) => user.name === username.trim());
        if (user?.pass === password.trim()) {
            dispatch("login", { user: user.name });
        } else {
            feedback = "Gebruikersnaam of wachtwoord incorrect";
        }
    }
</script>

<section class="login">
    <h1>Login</h1>

    {#if feedback}
        <p class="feedback"><em>{feedback}</em></p>
    {/if}

    <div class="form">
        <span class="label">Gebruiker:</span>
        <input class="text" type="text" bind:value={username} />
        <span class="label">Wachtwoord:</span>
        <input
            class="password"
            type="password"
            bind:value={password}
            on:keydown={(e) => e.key === "Enter" && login()}
        />
    </div>

    <Button color="accent" block on:click={login}>Login</Button>
</section>
<img class="logo" src="logo.png" alt="logo" />

<style lang="scss">
    .logo {
        max-width: 80vw;
        max-height: 40vh;
    }

    .feedback {
        color: var(--accent);
        margin-top: 2.4rem;
    }

    .login {
        padding: 2.4rem;
        background: var(--background);
        border-radius: var(--radius);
        box-shadow: var(--shadow-soft);
        min-width: min(calc(100% - 4.8rem), 60ch);
    }

    .form {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 1.2rem;
        margin: 2.4rem 0;
        font-size: 2rem;
    }

    .label {
        margin-top: 0.8rem;
    }

    .text,
    .password {
        font-size: 1.8rem;
        padding: 0.8rem 0.4rem;
        width: 100%;
        background: var(--background-light);
        border: none;
        border-radius: var(--radius);
        color: var(--foreground);

        &:focus {
            outline: 0.2rem solid var(--accent);
        }
    }
</style>
