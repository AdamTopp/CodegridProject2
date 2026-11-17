import { useRef } from 'react';
import styles from './projectThree2.module.scss';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Logo from './tempLogo';
gsap.registerPlugin(useGSAP, MotionPathPlugin);

const ProjectThree = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const markerWrapperRef = useRef<HTMLDivElement>(null);
    const marker = useRef<HTMLDivElement>(null);
    const cardSmall = useRef<HTMLDivElement>(null);
    const isExpanded = useRef(false);
    const trackingRef = useRef<HTMLDivElement>(null);
    const trackingRef2 = useRef<HTMLDivElement>(null);

    const followDuration = 1;
    const snapDuration = 2.5;
    const followEasing = "back.out";
    const easing = "power3.out";

    useGSAP(() => {
        const textMove = () => {
            const target = marker.current;
            const parent = markerWrapperRef.current;
            const tracking = trackingRef.current;
            const tracking2 = trackingRef2.current;

            if (!target || !parent || !tracking || !tracking2) return;

            const center = MotionPathPlugin.convertCoordinates(target, parent, {
                x: target.offsetWidth / 2,
                y: target.offsetHeight / 2,
            });

            gsap.set(tracking, {
                left: center.x,
                top: center.y,
            });
        };

        const xTo = gsap.quickTo(`.${styles.wrapper}`, "--mask-x", {
            duration: followDuration,
            ease: followEasing,
            onUpdate: textMove
        });

        const yTo = gsap.quickTo(`.${styles.wrapper}`, "--mask-y", {
            duration: followDuration,
            ease: followEasing,
            onUpdate: textMove
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

        const handleMouseMove = (event: MouseEvent) => {
            const ref = wrapperRef?.current;
            if (ref) {
                const w = (event.clientX - ref.offsetLeft) / ref.offsetWidth;
                const h = event.clientY / ref.offsetHeight;
                xTo(w * 100);
                yTo(h * 100);
            }
        };

        const handleMouseDown = (event: MouseEvent) => {
            if (isExpanded?.current === true) {
                console.log('Close')
                tl.reverse();
                isExpanded.current = false;
            } else {
                console.log('Open')
                tl.play()

                isExpanded.current = true;
            }
        };

        const handleMouseLeave = (event: MouseEvent) => {
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
        gsap.ticker.add(textMove);
        return () => {
            const ref = wrapperRef?.current;
            gsap.ticker.remove(textMove);
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
            <div className={styles.content}>
                <div className={styles.logo}><Logo /></div>
                <div className={styles.headline}>
                    <div className={styles.headlineHeader}>
                        <div>Selected</div>
                        <div className={styles.headlineHeaderCursive}>Adam Mickiewicz</div>
                    </div>
                </div>
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
            <div className={`${styles.card} ${styles.cardFirst}`} ref={trackingRef2}>
                <span>Part</span>
                <span>One</span>
                <span>Session</span>
            </div>
            <div className={styles.wrapper} ref={wrapperRef}>
                <div className={`${styles.card} ${styles.cardMiddle}`} ref={markerWrapperRef}>
                    <div id="cardContent2" className={`${styles.tracking} trackingContent`} ref={trackingRef}>
                        <span>Part</span>
                        <span>One</span>
                        <span>Session</span>
                    </div>
                    <div id='contentMiddle' className={`${styles.cardContent} ${styles.cardContentMiddle}`}>
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