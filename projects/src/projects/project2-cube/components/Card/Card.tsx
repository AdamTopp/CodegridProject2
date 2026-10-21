
import { useEffect, useRef } from 'react';
import styles from './Card.module.scss';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);
const PARALAX = 25;

const Card = () => {
    const cardRef = useRef<HTMLDivElement>(null);
    const cubeRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP();
    const rotationXTo = useRef<gsap.QuickToFunc>(null);
    const rotationYTo = useRef<gsap.QuickToFunc>(null);

    const onMouseMove = contextSafe((event: MouseEvent) => {
        const container = cubeRef.current;
        const xTo = rotationXTo.current;
        const yTo = rotationYTo.current;
        if (!container || !xTo || !yTo) return;

        const bounds = container.getBoundingClientRect();
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;

        const offsetX = (event.clientX - centerX) / bounds.width;
        const offsetY = (event.clientY - centerY) / bounds.height;

        xTo(offsetY * -PARALAX)
        yTo(offsetX * PARALAX)
    });

    const onMouseLeave = contextSafe((event: MouseEvent) => {
        const xTo = rotationXTo.current;
        const yTo = rotationYTo.current;
        if (!xTo || !yTo) return;

        xTo(0)
        yTo(0)
    });

    useEffect(() => {
        const container = cardRef.current;
        if (!container) return;

        const updateCardHeight = (entries: ResizeObserverEntry[]) => {
            const c = entries[0].target as HTMLDivElement;
            const height = c.getBoundingClientRect().height;
            const width = c.getBoundingClientRect().width;
            c.style.setProperty(
                "--card-height",
                `${height.toFixed(3)}px`
            );
            c.style.setProperty(
                "--card-width",
                `${width.toFixed(3)}px`
            );
        };

        const resizeObserver = new ResizeObserver(updateCardHeight);
        resizeObserver.observe(container);

        const height = container.getBoundingClientRect().height;
        const width = container.getBoundingClientRect().width;
        container.style.setProperty(
            "--card-height",
            `${height.toFixed(3)}px`
        );
        container.style.setProperty(
            "--card-width",
            `${width.toFixed(3)}px`
        );

        container.addEventListener('mousemove', onMouseMove)
        container.addEventListener('mouseleave', onMouseLeave)

        return () => {
            resizeObserver.disconnect();
            container.removeEventListener('mousemove', onMouseMove);
            container.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    useGSAP(() => {
        rotationXTo.current = gsap.quickTo(cubeRef.current, "rotationX", {
            duration: 0.6,
            ease: "power2.out",
        });

        rotationYTo.current = gsap.quickTo(cubeRef.current, "rotationY", {
            duration: 0.6,
            ease: "power2.out",
        });
    }, { scope: cubeRef });

    return (
        <div ref={cardRef} className={styles.card}>
            <div ref={cubeRef} className={styles.cube}>
                <div className={`${styles.face} ${styles.faceFront}`} />
                <div className={`${styles.face} ${styles.faceBack}`} />
                <div className={`${styles.face} ${styles.faceRight}`} />
                <div className={`${styles.face} ${styles.faceLeft}`} />
                <div className={`${styles.face} ${styles.faceTop}`} />
                <div className={`${styles.face} ${styles.faceBottom}`} />
            </div>
        </div>
                            
    )
}

export default Card