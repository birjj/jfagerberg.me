import yamz from "yet-another-medium-zoom";

// attach yet-another-medium-zoom to our images
(() => {
    // if an image is linked, open the link instead of zooming in when ctrl or shift is held
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
})();

// allow us to style loading images using CSS
(() => {
    function isLoaded($img: HTMLImageElement) {
        return $img.complete && $img.naturalWidth !== 0;
    }

    const $images = Array.from(
        document.querySelectorAll(".blurup")
    ) as HTMLImageElement[];
    $images.forEach(($img) => {
        if (isLoaded($img)) {
            $img.classList.add("loaded");
        } else {
            $img.classList.add("not-loaded");
            $img.addEventListener("load", () => {
                $img.classList.add("loaded");
                $img.classList.remove("not-loaded");
            });
        }
    });
})();
