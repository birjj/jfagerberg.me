/**
 * Vec2 which can't change abruptly
 * When new values are set, they are eased
 */
export default class EasedVec2 {
    vec: [number, number];
    originalDuration: number;
    duration: number;
    animating: boolean = false;
    start: [number, number]; // where we animate from
    target: [number, number]; // where we animate to
    progress: number; // how far along we are
    lastT: number = 0;
    _tempSetDurationTimeout?: number;

    constructor(x: number, y: number, t: number = 200) {
        this.vec = [x, y];
        this.originalDuration = this.duration = t;

        this.start = [x, y];
        this.target = [x, y];
        this.progress = 0;

        this.animate = this.animate.bind(this);
    }

    set(x: number, y: number) {
        this.start = [this.vec[0], this.vec[1]];
        this.target = [x, y];
        this.progress = 0;
        if (!this.animating) {
            this.lastT = 0;
        }

        if (!this.animating) {
            this.animate();
        }
    }
    setX(x: number) {
        this.set(x, this.target[1]);
    }
    setY(y: number) {
        this.set(this.target[0], y);
    }

    /** Set ease time until it finishes animating */
    temporarilySetDuration(t: number) {
        this.duration = t;
        clearTimeout(this._tempSetDurationTimeout);
        this._tempSetDurationTimeout = (setTimeout(
            () => (this.duration = this.originalDuration),
            t
        ) as unknown) as number;
    }

    animate() {
        const t = Date.now();
        const delta = t - (this.lastT || t);
        this.lastT = t;
        this.animating = true;
        this.progress += delta / this.duration;
        this.progress = Math.min(1, this.progress);
        this.vec = [
            this.ease(this.start[0], this.target[0], this.progress),
            this.ease(this.start[1], this.target[1], this.progress),
        ];
        if (this.progress < 1) {
            setTimeout(this.animate, 0);
        } else {
            this.animating = false;
            this.progress = 0;
        }
    }

    ease(from: number, to: number, progress: number) {
        return from + (to - from) * this.easing(progress);
    }

    easing(t: number) {
        // easeOutQuint
        return 1 + --t * t * t * t * t;
    }
}
