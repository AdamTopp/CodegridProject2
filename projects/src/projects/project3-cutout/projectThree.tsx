
import { useEffect, useRef, useState } from 'react';
import styles from './projectThree.module.scss';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);

const ProjectThree = () => { 
    const [projects, setProjects] = useState<string[]>([]);
    const interactionWrapperRef = useRef<HTMLDivElement>(null);
    const cardOne = useRef<HTMLDivElement>(null);
    const textOne = useRef<HTMLDivElement>(null);
    const textTwo = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const parent = interactionWrapperRef.current;
        const card = cardOne.current;
        const text = textOne.current;

        if (!parent || !card || !text) return;

        // Preserve centering separately from cursor movement.
        gsap.set(card, {
            xPercent: -50,
            yPercent: -50,
        });

        gsap.set(text, {
            xPercent: -50,
            yPercent: -50,
        });

        function updateFollower() {
            const x = gsap.getProperty(card, "x");
            const y = gsap.getProperty(card, "y");

            gsap.set(textTwo.current, { x: -x, y: -y });
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

        const clamp = (value: number, min: number, max: number) =>
            Math.max(min, Math.min(max, value));

        const handleMouseMove = (event: MouseEvent) => {
            xTo.tween.duration(1.5);
            yTo.tween.duration(1.5);
            const parentRect = parent.getBoundingClientRect();

            // Maximum distance the inner card can travel
            // without crossing the parent's edges.
            const maxX = Math.max(
                0,
                (parentRect.width - card.offsetWidth) / 2
            );

            const maxY = Math.max(
                0,
                (parentRect.height - card.offsetHeight) / 2
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
        };

        const handleMouseLeave = (event: MouseEvent) => {
            xTo.tween.duration(7);
            yTo.tween.duration(7);
            xTo(0);
            yTo(0);
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
                </div>
            </div>
        </div>
    )
}

export default ProjectThree