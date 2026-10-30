
import { useEffect, useRef, useState } from 'react';
import styles from './projectThree.module.scss';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);

const ProjectThree = () => { 
    const [projects, setProjects] = useState<string[]>([]);
    const interactionWrapperRef = useRef<HTMLDivElement>(null);
    const cardOne = useRef<HTMLDivElement>(null);
    const cardTwo = useRef<HTMLDivElement>(null);
    const textOne = useRef<HTMLDivElement>(null);
    const textTwo = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const parent = interactionWrapperRef.current;
        const card = cardOne.current;
        const card2 = cardTwo.current;

        const text = textOne.current;
        const text2 = textTwo.current;

        if (!parent || !card || !card2 || !text) return;

        // Preserve centering separately from cursor movement.
        gsap.set(card, {
            xPercent: -50,
            yPercent: -50,
            rotate: 30
        });

        gsap.set(card2, {
            xPercent: -50,
            yPercent: -50,
        });

        gsap.set(text2, {
            rotate: -30
        });

        function updateFollower() {
            const x = gsap.getProperty(card, "x");
            const y = gsap.getProperty(card, "y");

            gsap.set(text2, {xPercent: -50, yPercent: -50, x: -x, y: -y });
        }

        const xTo = gsap.quickTo(card, "x", {
            duration: 1.5,
            ease: "power3.out",
            onUpdate: updateFollower
        });

        const yTo = gsap.quickTo(card, "y", {
            duration: 1.5,
            ease: "power3.out",
            onUpdate: updateFollower
        });

        const xTo2 = gsap.quickTo(card2, "x", {
            duration: 2.5,
            ease: "power3.out",
        });

        const yTo2 = gsap.quickTo(card2, "y", {
            duration: 2.5,
            ease: "power3.out",
        });

        const clamp = (value: number, min: number, max: number) =>
            Math.max(min, Math.min(max, value));

        const handleMouseMove = (event: MouseEvent) => {
            xTo.tween.duration(1.5);
            yTo.tween.duration(1.5);
            xTo2.tween.duration(1.5);
            yTo2.tween.duration(1.5);
            const parentRect = parent.getBoundingClientRect();
            const card1Rect = card.getBoundingClientRect();
            console.log(card1Rect);

            // Maximum distance the inner card can travel
            // without crossing the parent's edges.
            const cardWidth = card1Rect.right - card1Rect.left
            const cardHeight = card1Rect.bottom - card1Rect.top
            const maxX = Math.max(
                0,
                (parentRect.width - cardWidth) / 2
            );

            const maxY = Math.max(
                0,
                (parentRect.height - cardHeight) / 2
            );

            const maxX2 = Math.max(
                0,
                (card1Rect.width - card2.offsetWidth) / 2
            );

            const maxY2 = Math.max(
                0,
                (card1Rect.height - card2.offsetHeight) / 2
            );

            // Cursor position relative to the parent's center.
            const targetX =
                event.clientX -
                (parentRect.left + parentRect.width / 2);

            const targetY =
                event.clientY -
                (parentRect.top + parentRect.height / 2);

            xTo(clamp(targetX, -maxX, maxX));
            yTo(clamp(targetY, -maxY, maxY));

            xTo2(clamp(targetX, -maxX2, maxX2));
            yTo2(clamp(targetY, -maxY2, maxY2));
        };

        const handleMouseLeave = (event: MouseEvent) => {
            xTo.tween.duration(2);
            yTo.tween.duration(2);
            xTo2.tween.duration(2);
            yTo2.tween.duration(2);
            xTo(0);
            yTo(0);
            xTo2(0);
            yTo2(0);
        };

        parent.addEventListener("mousemove", handleMouseMove);
        parent.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            parent.removeEventListener("mousemove", handleMouseMove);
            parent.removeEventListener("mouseleave", handleMouseLeave);
        };
    });

    return (
        <div className={styles.wrapper}>
            <div className={styles.interactionWrapper} ref={interactionWrapperRef}>
                <div className={`${styles.interactionWrapperText} ${styles.interactionWrapperTextOne}`} ref={textOne}>
                    Abecadło
                    <br />
                    Hasło
                </div>
                <div className={styles.interactionWrapperCard} ref={cardOne}>
                    <div className={`${styles.interactionWrapperText} ${styles.interactionWrapperTextTwo}`} ref={textTwo}>
                        Abecadło
                        <br />
                        Hasło
                    </div>
                    <div className={`${styles.interactionWrapperCard} ${styles.interactionWrapperCardTwo}`} ref={cardTwo}></div>
                </div>
            </div>
        </div>
    )
}

export default ProjectThree