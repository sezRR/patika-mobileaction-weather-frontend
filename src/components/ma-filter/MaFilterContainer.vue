<script setup>
import { useSlots, computed, ref, onMounted, onBeforeUnmount } from "vue";
import MaLabel from "../MaLabel.vue";
import MaFilterQuickActions from "./MaFilterQuickActions.vue";

const slots = useSlots();
const ITEMS_PER_PAGE = 7;

/* ---------- flatten default slot --------------------------------------- */
const allChildren = computed(() => {
    const raw = slots.default?.() ?? [];
    return raw.length === 1 && typeof raw[0].type === "symbol"
        ? raw[0].children
        : raw;
});

/* ---------- pagination -------------------------------------------------- */
const currentPage = ref(0);
const totalPages = computed(() =>
    Math.ceil(allChildren.value.length / ITEMS_PER_PAGE)
);
const paginatedChildren = computed(() => {
    const start = currentPage.value * ITEMS_PER_PAGE;
    return allChildren.value.slice(start, start + ITEMS_PER_PAGE);
});

/* ---------- navigation helpers ----------------------------------------- */
function next() {
    if (currentPage.value < totalPages.value - 1) ++currentPage.value;
}
function prev() {
    if (currentPage.value > 0) --currentPage.value;
}
function onKey(e) {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
}
onMounted(() => document.addEventListener("keydown", onKey));
onBeforeUnmount(() => document.removeEventListener("keydown", onKey));

/* ---------- selection logic -------------------------------------------- */
const selected = ref(new Set()); // stores global indices
const lastClickedIdx = ref(null); // last clicked index

function toggleSingle(idx, event) {
    /* decide action based on *previous* item’s current state */
    if (event.shiftKey && lastClickedIdx.value !== null) {
        const [start, end] = [idx, lastClickedIdx.value].sort((a, b) => a - b);
        const baseIsSelected = selected.value.has(lastClickedIdx.value);

        for (let i = start; i <= end; ++i) {
            baseIsSelected ? selected.value.add(i) : selected.value.delete(i);
        }
    } else {
        selected.value.has(idx)
            ? selected.value.delete(idx)
            : selected.value.add(idx);
    }
    lastClickedIdx.value = idx;
}

/* ---------- bulk toolbar ----------------------------------------------- */
const selectAll = () =>
    (selected.value = new Set(allChildren.value.map((_, i) => i)));
const removeAll = () => selected.value.clear();

const selectOneWeek = () => {
    const weekIndices = Array.from(
        { length: Math.min(7, allChildren.value.length) },
        (_, i) => i
    );
    selected.value = new Set(weekIndices);
};

const selectOneMonth = () => {
    const monthIndices = Array.from(
        { length: Math.min(30, allChildren.value.length) },
        (_, i) => i
    );
    selected.value = new Set(monthIndices);
};

const selectOneYear = () => {
    const yearIndices = Array.from(
        { length: Math.min(365, allChildren.value.length) },
        (_, i) => i
    );
    selected.value = new Set(yearIndices);
};

/* ---------- placeholders keep layout fixed ----------------------------- */
const placeholderCount = computed(
    () => ITEMS_PER_PAGE - paginatedChildren.value.length
);
</script>

<template>
    <div class="flex flex-col gap-2">
        <MaLabel>Filter dates</MaLabel>

        <!-- filter strip ----------------------------------------------------- -->
        <div class="flex flex-wrap items-center gap-2">
            <!-- ‹ -->
            <button
                v-if="totalPages > 1"
                class="px-2 text-stone-400 disabled:opacity-40"
                :disabled="currentPage === 0"
                @click="prev"
            >
                ‹
            </button>

            <!-- visible filters -->
            <template
                v-for="(child, localIdx) in paginatedChildren"
                :key="localIdx + currentPage * ITEMS_PER_PAGE"
            >
                <component
                    :is="child"
                    :modelValue="
                        selected.has(localIdx + currentPage * ITEMS_PER_PAGE)
                    "
                    @click="
                        toggleSingle(
                            localIdx + currentPage * ITEMS_PER_PAGE,
                            $event
                        )
                    "
                />
            </template>

            <!-- invisible placeholders keep height identical ------------------ -->
            <div
                v-for="n in placeholderCount"
                :key="'ph' + n"
                class="opacity-0 pointer-events-none select-none"
                style="height: 2.5rem; width: 4rem"
            ></div>

            <!-- › -->
            <button
                v-if="totalPages > 1"
                class="px-2 text-stone-400 disabled:opacity-40"
                :disabled="currentPage === totalPages - 1"
                @click="next"
            >
                ›
            </button>
        </div>

        <!-- footer bar ------------------------------------------------------- -->
        <MaFilterQuickActions
            :selectedCount="selected.size"
            :currentPage="currentPage"
            :totalPages="totalPages"
            :totalItems="allChildren.length"
            @select-all="selectAll"
            @remove-all="removeAll"
            @select-one-week="selectOneWeek"
            @select-one-month="selectOneMonth"
            @select-one-year="selectOneYear"
        />
    </div>
</template>
