<script setup>
import {
    useSlots,
    computed,
    ref,
    onMounted,
    onBeforeUnmount,
    watch,
} from "vue";
import MaLabel from "../MaLabel.vue";
import MaFilterQuickActions from "./MaFilterQuickActions.vue";

const emit = defineEmits(["selection-change"]);

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
function goToFirst() {
    currentPage.value = 0;
}
function goToLast() {
    currentPage.value = totalPages.value - 1;
}
function onKey(e) {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
    if (e.ctrlKey && e.key === "ArrowRight") goToLast();
    if (e.ctrlKey && e.key === "ArrowLeft") goToFirst();
}
onMounted(() => document.addEventListener("keydown", onKey));
onBeforeUnmount(() => document.removeEventListener("keydown", onKey));

/* ---------- selection logic -------------------------------------------- */
const selected = ref(new Set()); // stores global indices
const lastClickedIdx = ref(null); // last clicked index

// Auto-select up to 30 items when the range changes or on initial load
watch(
    () => allChildren.value.length,
    (newLength) => {
        if (newLength > 0) {
            // Reset to page 0 when date range changes
            currentPage.value = 0;
            // Select all items in the new range
            const selectionCount = Math.min(newLength, MAX_SELECTION_DAYS);
            selected.value = new Set(
                Array.from({ length: selectionCount }, (_, i) => i)
            );
        }
    },
    { immediate: true } // Run immediately on mount
);

const selectedDates = computed(() =>
    [...selected.value].map((idx) => allChildren.value[idx].props.date)
);

watch(
    selectedDates,
    (newDates) => {
        emit("selection-change", newDates);
    },
    { deep: true }
);

const MAX_SELECTION_DAYS = 30;

function toggleSingle(idx, event) {
    /* decide action based on *previous* item’s current state */
    if (event.shiftKey && lastClickedIdx.value !== null) {
        const [start, end] = [idx, lastClickedIdx.value].sort((a, b) => a - b);
        const baseIsSelected = selected.value.has(lastClickedIdx.value);

        for (let i = start; i <= end; ++i) {
            if (baseIsSelected) {
                if (selected.value.size < MAX_SELECTION_DAYS) {
                    selected.value.add(i);
                }
            } else {
                selected.value.delete(i);
            }
        }
    } else {
        if (selected.value.has(idx)) {
            selected.value.delete(idx);
        } else if (selected.value.size < MAX_SELECTION_DAYS) {
            selected.value.add(idx);
        }
    }
    lastClickedIdx.value = idx;
}

/* ---------- bulk toolbar ----------------------------------------------- */
const selectAll = () => {
    const newSelected = new Set();
    const allIndices = allChildren.value.map((_, i) => i);
    for (const index of allIndices) {
        if (newSelected.size >= MAX_SELECTION_DAYS) break;
        newSelected.add(index);
    }
    selected.value = newSelected;
};

const selectCurrentPage = () => {
    const currentPageStart = currentPage.value * ITEMS_PER_PAGE;
    const currentPageIndices = paginatedChildren.value.map(
        (_, localIdx) => currentPageStart + localIdx
    );
    // Merge with existing selections instead of replacing
    currentPageIndices.forEach((idx) => {
        if (selected.value.size < MAX_SELECTION_DAYS) {
            selected.value.add(idx);
        }
    });
};

const removeAll = () => selected.value.clear();

const removeCurrentPage = () => {
    const currentPageStart = currentPage.value * ITEMS_PER_PAGE;
    const currentPageIndices = paginatedChildren.value.map(
        (_, localIdx) => currentPageStart + localIdx
    );
    // Remove current page items from selections
    currentPageIndices.forEach((idx) => selected.value.delete(idx));
};

/* ---------- computed disable states ------------------------------------ */
const isAllSelected = computed(
    () =>
        selected.value.size === allChildren.value.length &&
        allChildren.value.length > 0
);

const isAllDeselected = computed(() => selected.value.size === 0);

const isCurrentPageAllSelected = computed(() => {
    if (paginatedChildren.value.length === 0) return false;
    const currentPageStart = currentPage.value * ITEMS_PER_PAGE;
    const currentPageIndices = paginatedChildren.value.map(
        (_, localIdx) => currentPageStart + localIdx
    );
    return currentPageIndices.every((idx) => selected.value.has(idx));
});

const isCurrentPageAllDeselected = computed(() => {
    if (paginatedChildren.value.length === 0) return true;
    const currentPageStart = currentPage.value * ITEMS_PER_PAGE;
    const currentPageIndices = paginatedChildren.value.map(
        (_, localIdx) => currentPageStart + localIdx
    );
    return currentPageIndices.every((idx) => !selected.value.has(idx));
});

const selectOneWeek = () => {
    const currentPageStart = currentPage.value * ITEMS_PER_PAGE;
    const weekIndices = Array.from(
        { length: Math.min(7, allChildren.value.length - currentPageStart) },
        (_, i) => currentPageStart + i
    );
    // Merge with existing selections instead of replacing
    weekIndices.forEach((idx) => {
        if (selected.value.size < MAX_SELECTION_DAYS) {
            selected.value.add(idx);
        }
    });
};

const selectOneMonth = () => {
    const currentPageStart = currentPage.value * ITEMS_PER_PAGE;
    const monthIndices = Array.from(
        { length: Math.min(30, allChildren.value.length - currentPageStart) },
        (_, i) => currentPageStart + i
    );
    // Merge with existing selections instead of replacing
    monthIndices.forEach((idx) => {
        if (selected.value.size < MAX_SELECTION_DAYS) {
            selected.value.add(idx);
        }
    });
};

/* ---------- placeholders keep layout fixed ----------------------------- */
const placeholderCount = computed(
    () => ITEMS_PER_PAGE - paginatedChildren.value.length
);
</script>

<template>
    <div class="flex flex-col gap-2">
        <!-- header aligned with filter items --------------------------------- -->
        <div class="flex items-center gap-2 w-96 min-w-96">
            <!-- spacer for pagination buttons to align header with filter items -->
            <div class="flex gap-2">
                <!-- invisible spacers matching pagination button widths -->
                <div class="px-2 opacity-0 pointer-events-none select-none">
                    ‹‹
                </div>
                <div class="px-2 opacity-0 pointer-events-none select-none">
                    ‹
                </div>
            </div>
            <MaLabel>Filter dates</MaLabel>
        </div>

        <!-- filter strip ----------------------------------------------------- -->
        <div class="flex flex-wrap items-center gap-2">
            <!-- ‹‹ (go to first) - always visible -->
            <button
                class="px-2 text-stone-400 disabled:opacity-40 hover:text-stone-600 disabled:hover:text-stone-400"
                :disabled="currentPage === 0 || totalPages <= 1"
                @click="goToFirst"
                title="Go to first page (Ctrl + ←)"
            >
                ‹‹
            </button>

            <!-- ‹ (previous) - always visible -->
            <button
                class="px-2 text-stone-400 disabled:opacity-40 hover:text-stone-600 disabled:hover:text-stone-400"
                :disabled="currentPage === 0 || totalPages <= 1"
                @click="prev"
                title="Previous page (←)"
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
                class="opacity-0 pointer-events-none select-none w-28"
            ></div>

            <!-- › (next) - always visible -->
            <button
                class="px-2 text-stone-400 disabled:opacity-40 hover:text-stone-600 disabled:hover:text-stone-400"
                :disabled="currentPage === totalPages - 1 || totalPages <= 1"
                @click="next"
                title="Next page (→)"
            >
                ›
            </button>

            <!-- ›› (go to last) - always visible -->
            <button
                class="px-2 text-stone-400 disabled:opacity-40 hover:text-stone-600 disabled:hover:text-stone-400"
                :disabled="currentPage === totalPages - 1 || totalPages <= 1"
                @click="goToLast"
                title="Go to last page (Ctrl + →)"
            >
                ››
            </button>
        </div>

        <!-- footer bar aligned with filter items ---------------------------- -->
        <div class="flex items-center gap-2">
            <!-- spacer for pagination buttons to align footer with filter items -->
            <div class="flex gap-2">
                <!-- invisible spacers matching pagination button widths -->
                <div class="px-2 opacity-0 pointer-events-none select-none">
                    ‹‹
                </div>
                <div class="px-2 opacity-0 pointer-events-none select-none">
                    ‹
                </div>
            </div>
            <div class="flex-1">
                <MaFilterQuickActions
                    :selectedCount="selected.size"
                    :currentPage="currentPage"
                    :totalPages="totalPages"
                    :totalItems="allChildren.length"
                    :isAllSelected="isAllSelected"
                    :isAllDeselected="isAllDeselected"
                    :isCurrentPageAllSelected="isCurrentPageAllSelected"
                    :isCurrentPageAllDeselected="isCurrentPageAllDeselected"
                    @select-all="selectAll"
                    @select-current-page="selectCurrentPage"
                    @remove-all="removeAll"
                    @remove-current-page="removeCurrentPage"
                    @select-one-week="selectOneWeek"
                    @select-one-month="selectOneMonth"
                    @selection-change="$emit('selection-change', $event)"
                />
            </div>
        </div>
    </div>
</template>
