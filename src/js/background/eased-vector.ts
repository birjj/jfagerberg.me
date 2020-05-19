/**
 * Vec2 which can't change abruptly. When new values are set, they are eased.
 * Supports changing the duration temporarily
 */
export default class EasedVec2 {
    vec: [number, number];
    duration: number;
    animation?: {
        from: [number, number];
        to: [number, number];
        startT: number;
        duration: number;
    };
    _animTimeout?: number;

    constructor(x: number, y: number, t: number = 200) {
        this.vec = [x, y];
        this.duration = t;

        this.animate = this.animate.bind(this);
    }

    get x() {
        return this.vec[0];
    }
    get y() {
        return this.vec[1];
    }

    set(x: number, y: number, duration = this.duration) {
        this.animation = {
            from: [this.vec[0], this.vec[1]],
            to: [x, y],
            startT: Date.now(),
            duration: duration,
        };

        this.animate();
    }
    setX(x: number, duration = this.duration) {
        this.set(
            x,
            this.animation ? this.animation.to[1] : this.vec[1],
            duration
        );
    }
    setY(y: number, duration = this.duration) {
        this.set(
            this.animation ? this.animation.to[0] : this.vec[0],
            y,
            duration
        );
    }

    animate() {
        if (!this.animation) {
            return console.warn(
                "Attempting to animate EasedVector without defined animation",
                this
            );
        }
        clearTimeout(this._animTimeout);

        const animation = this.animation;
        // update the time keeping variables
        const t = Date.now();
        const progress = Math.min(
            (t - animation.startT) / animation.duration,
            1
        );

        // update our value
        this.vec = [
            this.ease(animation.from[0], animation.to[0], progress),
            this.ease(animation.from[1], animation.to[1], progress),
        ];

        // and keep updating
        if (progress < 1) {
            this._animTimeout = setTimeout(this.animate, 0);
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
