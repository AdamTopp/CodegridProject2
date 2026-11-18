import { useRef } from 'react';
import styles from './projectThree2.module.scss';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Logo from './tempLogo';
gsap.registerPlugin(useGSAP, MotionPathPlugin);

interface MovingContext {
    ySmall: boolean,
    xSmall: boolean,
    xMid: boolean,
    yMid: boolean,
};

const MOVING_CONTEXT = {
    ySmall: false,
    xSmall: false,
    xMid: false,
    yMid: false,
}

const ProjectThree = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const markerWrapperRef = useRef<HTMLDivElement>(null);
    const marker = useRef<HTMLDivElement>(null);
    const marker2 = useRef<HTMLDivElement>(null);
    const firstCardRef = useRef<HTMLDivElement>(null);
    const cardSmall = useRef<HTMLDivElement>(null);
    const isExpanded = useRef(false);
    const trackingRef = useRef<HTMLDivElement>(null);
    const trackingRef2 = useRef<HTMLDivElement>(null);
    const isMoving = useRef<MovingContext>(MOVING_CONTEXT);
    const isReturning = useRef(false);
const resetCall = useRef<gsap.core.Tween | null>(null);
    const followDuration = 3;
    const snapDuration = 2.5;
    const followEasing = "back.out";
    const easing = "power3.out";

    useGSAP(() => {
        const textMove = () => {
            const target = marker.current;
            const middleCard = markerWrapperRef.current;
            const tracking = trackingRef.current;

            if (target && middleCard && tracking) {
                const center = MotionPathPlugin.convertCoordinates(
                    target,
                    middleCard,
                    {
                        x: target.offsetWidth / 2,
                        y: target.offsetHeight / 2,
                    }
                );

                gsap.set(tracking, {
                    left: center.x,
                    top: center.y,
                });
            }

            const middleMarker = marker2.current;
            const firstCard = firstCardRef.current;
            const tracking2 = trackingRef2.current;

            if (middleMarker && firstCard && tracking2) {
                const center = MotionPathPlugin.convertCoordinates(
                    middleMarker,
                    firstCard,
                    {
                        x: middleMarker.offsetWidth / 2,
                        y: middleMarker.offsetHeight / 2,
                    }
                );

                gsap.set(tracking2, {
                    left: center.x,
                    top: center.y,
                });
            }
        };

        const xTo = gsap.quickTo(`.${styles.wrapper}`, "--mask-x", {
            duration: followDuration,
            ease: followEasing,
            onUpdate: textMove,
            onComplete: () => mouseMoveComplete("xSmall")
        });

        const yTo = gsap.quickTo(`.${styles.wrapper}`, "--mask-y", {
            duration: followDuration,
            ease: followEasing,
            onUpdate: textMove,
            onComplete: () => mouseMoveComplete("ySmall")
        });

        const xToMid = gsap.quickTo(`.${styles.wrapper}`, "--mask-mid-x", {
            duration: followDuration,
            ease: followEasing,
            onUpdate: textMove,
            onComplete: () => mouseMoveComplete("xMid")
        });

        const yToMid = gsap.quickTo(`.${styles.wrapper}`, "--mask-mid-y", {
            duration: followDuration,
            ease: followEasing,
            onUpdate: textMove,
            onComplete: () => mouseMoveComplete("yMid")
        });

        const tl = gsap.timeline({
            paused: true,
            defaults: {
                ease: "power3.inOut"
            }
        });

        tl.to(`.${styles.wrapper}`, {
            "--mask-middle-expand": 1,
            "--mask-middle-brightness": 1,
            width: '100%',
            duration: 1
        })
        .to(`.${styles.wrapper}`, {
            "--mask-small-expand": 1,
            "--mask-small-brightness": 1,
            duration: 1
        }, "-=0.9")

       const radiusMid = 1 / 6; // 0 = no movement, 1 = full movement
       const radiusSmall = 1 / 5; // 0 = no movement, 1 = full movement

        const mapCursorToMask = (position: number, radius: number) => {
            const normalized = position * 2 - 1;
            return 50 + normalized * radius * 50;
        };

        const handleMouseMove = (event: MouseEvent) => {
            const ref = wrapperRef?.current;

            if (ref) {
                resetCall.current?.kill();
                isReturning.current = false;

                const rect = ref.getBoundingClientRect();

                const w = (event.clientX - rect.left) / rect.width;
                const h = (event.clientY - rect.top) / rect.height;

                isMoving.current = {
                    xSmall: true,
                    ySmall: true,
                    xMid: true,
                    yMid: true,
                };

                xTo(mapCursorToMask(w, radiusSmall));
                yTo(mapCursorToMask(h, radiusSmall));

                xToMid(mapCursorToMask(w, radiusMid));
                yToMid(mapCursorToMask(h, radiusMid));
            }
        };

        const handleMouseDown = (event: MouseEvent) => {
            if (isExpanded?.current === true) {
                tl.reverse();
                isExpanded.current = false;
            } else {
                tl.play()

                isExpanded.current = true;
            }
        };

        const mouseMoveComplete = (key: keyof MovingContext) => {
            if (isReturning.current) return;

            isMoving.current[key] = false;

            const allComplete = Object.values(isMoving.current).every(
                (value) => !value
            );

            if (allComplete) {
                resetCall.current?.kill();

                resetCall.current = gsap.delayedCall(1, () => {
                    isReturning.current = true;

                    xTo(50);
                    yTo(50);
                    xToMid(50);
                    yToMid(50);
                });
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(() => {
                textMove();
            });
        });

        const ref = wrapperRef?.current;
        if (ref) {
            ref.addEventListener("mousemove", handleMouseMove);
            ref.addEventListener("mousedown", handleMouseDown);
            resizeObserver.observe(ref);
        }
        gsap.ticker.add(textMove);
        return () => {
            const ref = wrapperRef?.current;
            gsap.ticker.remove(textMove);
            if (ref) {
                resizeObserver.disconnect();
                ref.removeEventListener("mousemove", handleMouseMove);
                ref.removeEventListener("mousedown", handleMouseDown);
            }
        };

    });


    return (
        <section className={styles.section}>
            <div className={styles.content}>
                <div className={styles.logo}><Logo /></div>
                <div className={styles.headline}>
                    <div className={styles.headlineHeader}>
                        <div>Selected</div>
                        <div className={styles.headlineHeaderCursive}>Adam Mickiewicz</div>
                    </div>
                </div>
                <div className={styles.buttons}>
                    <div className={styles.button}>
                        <span className={styles.buttonContent}>
                            <span className={styles.buttonSubtext}>01.</span>
                            <span className={styles.buttonName}>Stanisław Wyspiański</span>
                        </span>
                        <span className={styles.buttonSubtext}>REACT, WEBFLOW, FIGMA</span>
                    </div>
                    <div className={styles.button}>
                        <span className={styles.buttonContent}>
                            <span className={styles.buttonSubtext}>02.</span>
                            <span className={styles.buttonName}>Jan Kochanowski</span>
                        </span>
                        <span className={styles.buttonSubtext}>REACT, WEBFLOW, FIGMA</span>
                    </div>
                    <div className={styles.button}>
                        <span className={styles.buttonContent}>
                            <span className={styles.buttonSubtext}>03.</span>
                            <span className={styles.buttonName}>Adam Mickiewicz</span>
                        </span>
                        <span className={styles.buttonSubtext}>REACT, WEBFLOW, FIGMA</span>
                    </div>
                </div>
            </div>
            <div className={styles.wrapper} ref={wrapperRef}>
                <div className={`${styles.card}`} ref={firstCardRef}>
                    <div className={`${styles.trackingOuter}`} ref={trackingRef2}>
                        <span>Open</span>
                        <span>Studio</span>
                        <span>Night</span>
                    </div>
                </div>
                <div className={`${styles.card} ${styles.cardMiddle}`} ref={markerWrapperRef}>
                    <div id="cardContent2" className={`${styles.tracking} trackingContent`} ref={trackingRef}>
                        <span>Open</span>
                        <span>Studio</span>
                        <span>Night</span>
                    </div>
                    <div id='contentMiddle' className={`${styles.cardContent} ${styles.cardContentMiddle}`}>
                        <div className={`${styles.card} ${styles.cardSmall}`} ref={cardSmall}>
                            <div id='contentSmall' className={`${styles.cardContent} ${styles.cardContentSmall}`}>
                                <span>Open</span>
                                <span>Studio</span>
                                <span>Night</span>
                            </div>
                            <div id='marker' className={`${styles.marker}`} ref={marker}></div>
                        </div>
                    </div>
                    <div id='marker2' className={`${styles.markerMiddle}`} ref={marker2}></div>
                </div>
            </div>
        </section>
    )
}

export default ProjectThree