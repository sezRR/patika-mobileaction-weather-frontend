<script setup>
import { MaButton } from "@mobileaction/action-kit";
import { ref } from "vue";

const counter = ref(0);

const incrementCounter = () => {
    counter.value++;
};
</script>

<style src="@/styles/main.css" />

<template>
    <div class="h-dvh flex justify-center items-center flex-col gap-4">
        <span class="font-bold text-2xl">Hello World!</span>
        <MaButton :onClick="incrementCounter">Click Me</MaButton>
        <span class="text-gray-500 text-sm">
            {{ counter }}
        </span>
    </div>
</template>
