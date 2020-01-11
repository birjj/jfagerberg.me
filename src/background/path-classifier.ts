/**
 * Returns details about how the background should show on a path
 */
export default function getPathDetails(path: string) {
    if (path === "/") {
        return { level: 0, show: true };
    }
    return { level: 1, show: true };
}
