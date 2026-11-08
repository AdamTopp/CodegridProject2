
import { useRef } from 'react';
import styles from './projectThree2.module.scss';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);

const ProjectThree = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const marker = useRef<HTMLDivElement>(null);
    const cardSmall = useRef<HTMLDivElement>(null);

    const followDuration = 0.4;
    const snapDuration = 2.5;
    const followEasing = "back.out";
    const easing = "power3.out";
    useGSAP(() => {
        let xTo: gsap.QuickToFunc;
        let yTo: gsap.QuickToFunc;
        let rotateTo: gsap.QuickToFunc;
        let rotateTo2: gsap.QuickToFunc;

        let transitionTl: gsap.core.Timeline;
        let isExpanded = false;
        let hoverEnabled = true;
        const textMove = () => {
            const m = marker?.current;
            const w = wrapperRef?.current;
            if (m && w) {
                const markerRect = m.getBoundingClientRect();
                const wrapperRect = w.getBoundingClientRect();

                const trackerX =
                    (((markerRect.left - wrapperRect.left) + (markerRect.width / 2)) / wrapperRect.width) * 100;

                const trackerY =
                    (((markerRect.top - wrapperRect.top) + (markerRect.height / 2)) / wrapperRect.height) * 100;

                gsap.set(`.${styles.tracking}`, {
                    "--custom-x": trackerX,
                    "--custom-y": trackerY
                });
            }
        }
        const negateRotation = () => {
            const rotation = gsap.getProperty(`.${styles.cardMiddle}`, '--rotate-deg')
            gsap.set('#contentMiddle', { rotate: -rotation})
        }

        const negateRotation2 = () => {
            const rotation = gsap.getProperty(`.${styles.cardSmall}`, '--rotate-deg')
            gsap.set('#contentSmall', { rotate: -rotation})
            gsap.set(`.trackingContent`, { rotate: rotation})
        }

        const createQuickTos = () => {
            xTo = gsap.quickTo(`.${styles.card}`, "--mask-x", {
                duration: followDuration,
                ease: followEasing,
                onUpdate: textMove
            });

            yTo = gsap.quickTo(`.${styles.card}`, "--mask-y", {
                duration: followDuration,
                ease: followEasing,
                onUpdate: textMove
            });

            rotateTo = gsap.quickTo(`.${styles.cardMiddle}`, "--rotate-deg", {
                duration: followDuration,
                ease: easing,
                onUpdate: negateRotation
            });

            rotateTo2 = gsap.quickTo(`.${styles.cardSmall}`, "--rotate-deg", {
                duration: followDuration,
                ease: easing,
                onUpdate: negateRotation2
            });
        };

        createQuickTos();
        const stopHoverAnimations = () => {
            xTo?.tween.kill();
            yTo?.tween.kill();
            rotateTo?.tween.kill();
            rotateTo2?.tween.kill();

            hoverEnabled = false;
        };
        const toggleMasks = () => {
            isExpanded = !isExpanded;

            // Stop previous hover animations
            stopHoverAnimations();

            // Interrupt any currently running transition
            transitionTl?.kill();

            transitionTl = gsap.timeline({
                onComplete: () => {
                    // Only resume hover when we have returned to closed state
                    if (!isExpanded) {
                        hoverEnabled = true;
                        createQuickTos();
                        textMove();
                    }
                }
            });

            if (isExpanded) {
                // EXPAND
                transitionTl
                    .to(`.${styles.wrapper}`, {
                        "--mask-expand": 1,
                        duration: 1,
                        ease: "power3.inOut",
                        onUpdate: () => {textMove()}
                    }, 0)
                    .to([`.${styles.cardMiddle}`, `.${styles.cardSmall}`], {
                        "--rotate-deg": 0,
                        "--mask-x": 50,
                        "--mask-y": 50,
                        duration: 4,
                        ease: "power3.out"
                    }, "<")
                    .to([`.${styles.marker}`, `.${styles.cardShadowMiddle}`], {
                        opacity: 0,
                        duration: 2,
                        ease: "power3.out"
                    }, '<');

            } else {
                // COLLAPSE
                transitionTl
                    // .to(`.${styles.card}`, {
                    //     "--mask-x": 50,
                    //     "--mask-y": 50,
                    //     duration: 10,
                    //     ease: "power3.inOut"
                    // }, 0)
                    .to(`.${styles.wrapper}`, {
                        "--mask-expand": 0,
                        "--rotate-deg": 0,
                        duration: 1,
                        ease: "power3.inOut",
                        onUpdate: () => {negateRotation(); textMove()}
                    }, 0)
                    .to([`.${styles.marker}`, `.${styles.cardShadowMiddle}`], {
                        opacity: 1,
                        duration: 2,
                        ease: "power3.out"
                    }, '<');
            }
        };

        const handleMouseMove = (event: MouseEvent) => {
            const ref = wrapperRef?.current;
            if (ref) {
                const w = (event.clientX - ref.offsetLeft) / ref.offsetWidth;
                const h = event.clientY / ref.offsetHeight;
                const xRotation = (1 - w) * 5;
                const yRotation = (h) * 5;
                const rotationSum = xRotation + yRotation;
                xTo.tween.duration(followDuration);
                yTo.tween.duration(followDuration);
                xTo(w * 100);
                yTo(h * 100);
                rotateTo(rotationSum);
                rotateTo2(-rotationSum);
            }
        };

        const handleMouseLeave = (event: MouseEvent) => {
            xTo.tween.duration(snapDuration);
            yTo.tween.duration(snapDuration);
            xTo(50);
            yTo(50);
        };

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(() => {
                textMove();
            });
        });

        const ref = wrapperRef?.current;
        if (ref) {
            ref.addEventListener("mousedown", toggleMasks);
            ref.addEventListener("mousemove", handleMouseMove);
            ref.addEventListener("mouseleave", handleMouseLeave);
            resizeObserver.observe(ref);
        }

        return () => {
            const ref = wrapperRef?.current;
            if (ref) {
                resizeObserver.disconnect();
                ref.removeEventListener("mousedown", toggleMasks);
                ref.removeEventListener("mousemove", handleMouseMove);
                ref.removeEventListener("mouseleave", handleMouseLeave);
            }
        };
    });

    return (
        <section className={styles.section}>
            <div className={styles.wrapper} ref={wrapperRef}>
                    <div className={styles.card}>
                        <span>Part</span>
                        <span>One</span>
                        <span>Session</span> 
                    </div>
                    <div className={`${styles.card} ${styles.cardMiddle}`}>
                        <div id='contentMiddle' className={`${styles.cardContent} ${styles.cardContentMiddle}`}>
                            <div className={`${styles.tracking} trackingContent`}>
                                <span>Part</span>
                                <span>One</span>
                                <span>Session</span> 
                            </div>
                            <div className={`${styles.card} ${styles.cardSmall}`} ref={cardSmall}>
                                <div id='contentSmall' className={`${styles.cardContent} ${styles.cardContentSmall}`}>
                                    <span>Part</span>
                                    <span>One</span>
                                    <span>Session</span> 
                                </div>
                                <div id='marker' className={`${styles.marker}`} ref={marker}></div>
                            </div>
                        </div>
                        <div id='marker2' className={`${styles.marker2}`}></div>
                        {/* <div className={`${styles.trackingMiddle} ${styles.cardShadowMiddle}`}></div> */}
                    </div>
            </div>
        </section>
    )
}

export default ProjectThree