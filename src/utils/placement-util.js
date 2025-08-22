export const createPlacementClass = (placement) => {
    if (placement === "top-left") {
        return "top-0 left-0";
    } else if (placement === "top-right") {
        return "top-0 right-0";
    } else if (placement === "bottom-left") {
        return "bottom-0 left-0";
    } else if (placement === "bottom-right") {
        return "bottom-0 right-0";
    }
    return "";
};
