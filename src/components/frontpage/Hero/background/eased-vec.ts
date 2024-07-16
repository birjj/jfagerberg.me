/** Type definition of N-length tuple with elements of type T */
type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

export default class EasedVec<N extends number = 2> {
  /** The current (animated) value of this vector */
  vec: Tuple<number, N>;
  /** The default duration for easings of this vector */
  duration: number;
  /** The easing function used by this vector, defaulting to easeOutQuint */
  easing: (t: number) => number = (t) => 1 + --t * t * t * t * t;

  private animation?: {
    from: Tuple<number, N>;
    to: Tuple<number, N>;
    startT: number;
    duration: number;
  };
  private animationTimeout?: number;

  constructor(
    initialValue: Tuple<number, N>,
    duration = 200,
    easing?: (t: number) => number
  ) {
    this.vec = initialValue;
    this.duration = duration;
    this.easing = easing || this.easing;
  }

  get() {
    return this.vec;
  }
  set(value: Tuple<number, N>, duration = this.duration) {
    this.animation = {
      from: this.vec,
      to: value,
      startT: Date.now(),
      duration: duration,
    };
    this.animate();
  }

  private animate = () => {
    if (!this.animation) {
      return console.warn(
        "Attempting to animate EasedVector without defined animation",
        this
      );
    }
    cancelAnimationFrame(this.animationTimeout!);

    // update our .vec based on the animation
    const animation = this.animation;
    const progress = Math.min(
      (Date.now() - animation.startT) / animation.duration,
      1
    );
    this.vec = animation.from.map((v, i) =>
      this.ease(v, animation.to[i], progress)
    ) as Tuple<number, N>;

    // and keep updating
    if (progress < 1) {
      this.animationTimeout = requestAnimationFrame(this.animate);
    }
  };

  private ease(from: number, to: number, progress: number) {
    return from + (to - from) * this.easing(progress);
  }
}
