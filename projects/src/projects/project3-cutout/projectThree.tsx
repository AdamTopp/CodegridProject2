
import { useEffect, useRef, useState } from 'react';
import styles from './projectThree.module.scss';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);

const ProjectThree = () => { 
    const [projects, setProjects] = useState<string[]>([]);
    const cardOneRef = useRef<HTMLDivElement>(null);
    const contentOneRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const element = contentOneRef.current;
        const wrapper = cardOneRef.current;

        if (!element || !wrapper) return;

        const radius = 250;

        const xTo = gsap.quickTo(element, "x", {
            duration: 0.5,
            ease: "power3.out",
        });

        const yTo = gsap.quickTo(element, "y", {
            duration: 0.5,
            ease: "power3.out",
        });

        // const handleMouseMove = (e: MouseEvent) => {
        //     const rect = wrapper.getBoundingClientRect();

        //     const centerX = rect.left + rect.width / 2;
        //     const centerY = rect.top + rect.height / 2;

        //     const dx = e.clientX - centerX;
        //     const dy = e.clientY - centerY;

        //     const distance = Math.hypot(dx, dy);

        //     if (distance < radius) {
        //         xTo(dx);
        //         yTo(dy);
        //     } else {
        //         xTo(centerX);
        //         yTo(centerY);
        //     }
        // };

        // window.addEventListener("mousemove", handleMouseMove);

        return () => {
            // window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div className={styles.wrapper}>
            <div>
                
            </div>
            <div className={`${styles.content} ${styles.testContent}`}>HHHHMMHM <br /> HHHHMMHM</div>
            <div className={`${styles.card} ${styles.cardOne}`}>
                <div className={`${styles.content} ${styles.testContent}`}>Abecadło <br /> Testing</div>

                {/* <div ref={contentOneRef} className={`${styles.cardTwo}`}>
                    <div ref={contentOneRef} className={`${styles.content} ${styles.testContent}`}>HHHHMMHM <br /> HHHHMMHM</div>
                </div> */}
            </div>
        </div>
    )
}

export default ProjectThree