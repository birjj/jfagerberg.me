import yamz from "yet-another-medium-zoom";

function handleImageClick(e: MouseEvent) {
    const shouldOpen = e.ctrlKey || e.shiftKey;
    if (shouldOpen) {
        e.stopPropagation();
    } else {
        e.preventDefault();
    }
}

const $images = Array.from(
    document.querySelectorAll("*:not(picture) > img, picture")
) as HTMLElement[];
$images.forEach(($img) => {
    const $a = $img.closest("a");
    if (!$a) {
        return;
    }

    $a.addEventListener("click", handleImageClick, { capture: true });
});
yamz.bind($images);
