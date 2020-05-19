type UrlDetails = {
    level: number;
    show: boolean;
};
const details = {
    HOME: {
        level: 0,
        show: true,
    },
    BLOG: {
        level: 1,
        show: false,
    },
};

// Returns details about how the background should show on a given URL
export default function getUrlDetails(url: string = location.href): UrlDetails {
    try {
        const parsed = new URL(url);
        if (parsed.pathname === "/") {
            return details.HOME;
        }
        return details.BLOG;
    } catch (e) {
        console.warn("Failed to parse URL", url);
        return details.HOME;
    }
}
