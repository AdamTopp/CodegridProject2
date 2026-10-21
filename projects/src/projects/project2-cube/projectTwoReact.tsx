
import { useRef } from 'react';
import styles from './projectTwo.module.scss';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import Card from './components/Card/Card';
import SectionWelcome from './components/SectionWelcome/SectionWelcome';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

const ProjectTwo = () => {
    const detailsSectionRef = useRef(null);
    const imagesRef = useRef<HTMLDivElement>(null);

    // useGSAP(() => {
    //     ScrollSmoother.create({
    //         smooth: 0.75,
    //         ease: 'power2.out',
    //         effects: true,
            
    //     });
    //     const tl = gsap.timeline()
    //         .from(detailsSectionRef.current, {
    //             scale: 0.95,
    //             opacity: 0.25,
    //             transform: 'translateY(100%)',
    //             borderRadius: '36px' });
    //     ScrollTrigger.create({
    //         animation: tl,
    //         trigger: '.welcomeSection',
    //         start: 'top top',
    //         scrub: 1.5,
    //         pin: true,
    //         anticipatePin: 1,
    //     })
    // });

    return (
        <div id='smooth-content' className={styles.wrapper}>
            {/* <section className={`${styles.section} welcomeSection`}>
                <div ref={detailsSectionRef} className={styles.details}>
                    <div className={styles.detailsContent}>
                        <div className={styles.detailsText}>
                            <p>
                                Née de l'envie de 5 designers, The Design Society organise des évènements pour rassembler les designers de Lyon. Entre les talks pour partager le savoir et les apéros pour l'oublier, on poursuit un but qu'on garde presque secret : créer les occasions qui manquaient de se voir, et fédérer la profession
                            </p>
                        </div>
                        <div ref={imagesRef} className={styles.detailsPictures}>
                            <Card />
                            <Card />
                        </div>
                    </div>
                    <div className={styles.detailsFooter}>
                        <div className={styles.detailsFooterText}>@Caedrel</div>
                        <div className={styles.detailsFooterRight}>
                            <div className={styles.detailsFooterText}>Adam Topp</div>
                            <div className={styles.detailsFooterText}>2023</div>
                            <div className={styles.detailsFooterText}>Madrid</div>
                        </div>
                    </div>
                </div>
            </section> */}
            {/* <section className={`${styles.section}`}>
            </section> */}
            <SectionWelcome />
        </div>
    )
}

export default ProjectTwo