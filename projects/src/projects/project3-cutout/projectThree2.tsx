
import { useEffect, useRef, useState } from 'react';
import styles from './projectThree2.module.scss';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);

const ProjectThree = () => {
    const marker = useRef<HTMLDivElement>(null);
    const cardMiddle = useRef<HTMLDivElement>(null);
    const cardSmall = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const textMoveX = () => {
            const m = marker?.current;
            if (m) {
                const { x } = m.getBoundingClientRect();
                const trackerX = x / window.innerWidth * 100;
                gsap.set(`.${styles.tracking}`, { "--custom-x": trackerX });
            }
        }

        const textMoveY = () => {
            const m = marker?.current;
            if (m) {
                const { y } = m.getBoundingClientRect()
                const trackerY = y / window.innerHeight * 100;
                gsap.set(`.${styles.tracking}`, { "--custom-y": trackerY });
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

        const xTo = gsap.quickTo([`.${styles.card}`], "--mask-x", {
            duration: 0.4,
            ease: "power3.out",
            onUpdate: textMoveX
        });

        const yTo = gsap.quickTo([`.${styles.card}`], "--mask-y", {
            duration: 0.4,
            ease: "power3.out",
            onUpdate: textMoveY
        });

        const rotateTo2 = gsap.quickTo(`.${styles.cardSmall}`, "--rotate-deg", {
            duration: 0.4,
            ease: "power3.out",
            onUpdate: negateRotation2
        });

        const rotateTo = gsap.quickTo(`.${styles.cardMiddle}`, "--rotate-deg", {
            duration: 0.4,
            ease: "power3.out",
            onUpdate: negateRotation
        });

        const handleResize = () => {
            textMoveX();
            textMoveY();
        };

        const handleMouseMove = (event: MouseEvent) => {
            const xRotation = (1 - (event.clientX / window.innerWidth)) * 5;
            const yRotation = ((event.clientY / window.innerHeight)) * 5;
            const rotationSum = xRotation + yRotation;
            xTo((event.clientX / window.innerWidth) * 100);
            yTo((event.clientY / window.innerHeight) * 100);
            rotateTo(rotationSum);
            rotateTo2(-rotationSum);
        };

        const handleMouseLeave = (event: MouseEvent) => {
            xTo(0);
            yTo(0);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);
        window.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mouseleave", handleMouseLeave);
        };
    });

    return (
        <div className={styles.wrapper}>
                <div className={styles.card}>
                    <span>Part</span>
                    <span>One</span>
                    <span>Session</span> 
                </div>
                <div className={`${styles.card} ${styles.cardMiddle}`}>
                    <div id='contentMiddle' className={`${styles.cardContent} ${styles.cardContentMiddle}`} ref={cardMiddle}>
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
                        <div className={`${styles.tracking} ${styles.cardShadow} trackingContent`}></div>
                    </div>
                    <div className={`${styles.trackingMiddle} ${styles.cardShadowMiddle}`}></div>
                </div>
        </div>
    )
}

export default ProjectThree