
import { useEffect, useRef, useState } from 'react';
import styles from './projectThree.module.scss';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);

const ProjectThree = () => { 
    const [projects, setProjects] = useState<string[]>([]);
    const interactionWrapperRef = useRef<HTMLDivElement>(null);
    const cardOne = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const parent = interactionWrapperRef.current;
        const card = cardOne.current;

        if (!parent || !card) return;

        // Preserve centering separately from cursor movement.
        gsap.set(card, {
            xPercent: -50,
            yPercent: -50,
        });

        const xTo = gsap.quickTo(card, "x", {
            duration: 0.35,
            ease: "power3.out",
        });

        const yTo = gsap.quickTo(card, "y", {
            duration: 0.35,
            ease: "power3.out",
        });

        const clamp = (value: number, min: number, max: number) =>
            Math.max(min, Math.min(max, value));

        const handleMouseMove = (event: MouseEvent) => {
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

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    });

    return (
        <div className={styles.wrapper}>
            <div className={styles.interactionWrapper} ref={interactionWrapperRef}>
                <div className={styles.interactionWrapperCard} ref={cardOne}></div>
            </div>
        </div>
    )
}

export default ProjectThree