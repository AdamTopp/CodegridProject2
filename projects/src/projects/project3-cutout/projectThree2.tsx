
import { useEffect, useRef, useState } from 'react';
import styles from './projectThree2.module.scss';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);

const ProjectThree = () => { 

    useGSAP(() => {
        const negateRotation = () => {
            const rotation = gsap.getProperty(`.${styles.cardTop}`, '--rotate-deg')
            gsap.set('#test1', { rotate: -rotation})
        }

        // const negateRotation2 = () => {
        //     const rotation = gsap.getProperty(`.${styles.cardTwo}`, '--rotate-deg')
        //     gsap.set('#test2', { rotate: -rotation})
        // }

        const xTo = gsap.quickTo(`.${styles.cardTop}`, "--mask-x", {
            duration: 0.4,
            ease: "power3.out",
        });

        const yTo = gsap.quickTo(`.${styles.cardTop}`, "--mask-y", {
            duration: 0.4,
            ease: "power3.out",
        });

        const xTo2 = gsap.quickTo(`.${styles.cardTwo}`, "left", {
            duration: 0.4,
            ease: "power3.out",
        });

        const yTo2 = gsap.quickTo(`.${styles.cardTwo}`, "top", {
            duration: 0.4,
            ease: "power3.out",
        });

        const rotateTo2 = gsap.quickTo(`.${styles.cardTwo}`, "--rotate-deg", {
            duration: 0.4,
            ease: "power3.out",
            // onUpdate: negateRotation2
        });

        const rotateTo = gsap.quickTo(`.${styles.cardTop}`, "--rotate-deg", {
            duration: 0.4,
            ease: "power3.out",
            onUpdate: negateRotation
        });

        const handleMouseMove = (event) => {
            const xRotation = (1 - (event.clientX / window.innerWidth)) * 5;
            const yRotation = ((event.clientY / window.innerHeight)) * 5;
            const rotationSum = xRotation + yRotation;
            xTo((event.clientX / window.innerWidth) * 100);
            yTo((event.clientY / window.innerHeight) * 100);
            xTo2(event.clientX);
            yTo2(event.clientY);
            rotateTo(rotationSum);
            rotateTo2(-rotationSum);
        };

        const handleMouseLeave = (event) => {
            xTo(0);
            yTo(0);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
        };
    });

    return (
        <div className={styles.wrapper}>
            <div className={styles.interactionWrapper}>
                <div className={styles.card}>Bartolomeo</div>
                <div className={`${styles.card} ${styles.cardTop}`}>
                    <div id='test1' className={styles.cardOneContent}>
                        <div id='middletext'>Caedrel</div>
                        <div className={`${styles.cardTwo}`}>
                            <div id='test2' className={styles.cardOneContent}>
                                K'santeusz
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectThree