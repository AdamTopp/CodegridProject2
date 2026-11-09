
import { useRef } from 'react';
import styles from './projectThree2.module.scss';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);

const ProjectThree = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const marker = useRef<HTMLDivElement>(null);
    const cardSmall = useRef<HTMLDivElement>(null);
    const isExpanded = useRef(false);

    const followDuration = 1;
    const snapDuration = 2.5;
    const followEasing = "back.out";
    const easing = "power3.out";

    useGSAP(() => {
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

        const xTo = gsap.quickTo(`.${styles.card}`, "--mask-x", {
                duration: followDuration,
                ease: followEasing,
                onUpdate: textMove
            });

        const yTo = gsap.quickTo(`.${styles.card}`, "--mask-y", {
            duration: followDuration,
            ease: followEasing,
            onUpdate: textMove
        });
        const rotateTo = gsap.quickTo(`.${styles.cardMiddle}`, "--rotate-deg", {
            duration: followDuration,
            ease: easing,
            onUpdate: negateRotation
        });
        const rotateTo2 = gsap.quickTo(`.${styles.cardSmall}`, "--rotate-deg", {
            duration: followDuration,
            ease: easing,
            onUpdate: negateRotation2
        });

        const openCards = gsap.quickTo(`.${styles.wrapper}`, "--mask-expand", {
            duration: 2,
            ease: 'expo',
        });

        const tl = gsap.timeline({
            paused: true,
            defaults: {
                ease: "power3.inOut"
            }
        });

        tl.to(`.${styles.cardMiddle}`, {
            "--mask-expand": 1,
            onUpdate: negateRotation,
            duration: 1
        })
        .to(`.${styles.cardSmall}`, {
             "--mask-expand": 1,
            onUpdate: negateRotation2,
            duration: 1
        })

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

        const handleMouseDown = (event: MouseEvent) => {
            if (isExpanded?.current === true) {
                console.log('Close')
                // openCards(0)
                tl.reverse();
                isExpanded.current = false;
            } else {
                console.log('Open')
                // openCards(1)
                tl.play()

                isExpanded.current = true;
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
            ref.addEventListener("mousemove", handleMouseMove);
            ref.addEventListener("mousedown", handleMouseDown);
            ref.addEventListener("mouseleave", handleMouseLeave);
            resizeObserver.observe(ref);
        }

        return () => {
            const ref = wrapperRef?.current;
            if (ref) {
                resizeObserver.disconnect();
                ref.removeEventListener("mousemove", handleMouseMove);
                ref.removeEventListener("mousedown", handleMouseDown);
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
                        <div id='marker2' className={`${styles.markerMiddle}`}></div>
                    </div>
            </div>
        </section>
    )
}

export default ProjectThree