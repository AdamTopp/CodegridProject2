
import { useEffect, useRef, useState } from 'react';
import styles from './projectOne.module.scss';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";

interface Data {
    city: string;
    image: string;
    title: string;
    museum: string;
    years: string[];
}

interface ParalaxInfo {
    imgOffset: number;
    miniImgOffset: number;
    descriptionOffset: number;
}


export interface Project extends Data {
    index: number;
    lerp: number;
    projectIndex: number;
}

export interface ScrollInfo {
    targetY: number;
    lastTouchY: number;
    lastScrollTime: number;
    isSnapping: boolean;
    isDragging: boolean;
}

const projectData: Data[] = [
    {
        city: "Paris",
        image: "img1.jpg",
        title: "Water Lillies",
        museum: "National Gallery",
        years: ['1891', '1893']
    },
    {
        city: "Tokyo",
        image: "img2.jpg",
        title: "Water Lillies",
        museum: "National Gallery",
        years: ['1893']
    },
    {
        city: "New York",
        image: "img3.jpg",
        title: "Water Lillies",
        museum: "2023",
        years: ['1895', '1896']
    },
    {
        city: "Paris",
        image: "img4.jpg",
        title: "Category 4",
        museum: "2024",
        years: ['1896', '1898']
    }
];

const config = {
    SCROLL_SPEED: 10,
    LERP_FACTOR: 0.05,
    BUFFER_SIZE: 4,
    MAX_VELOCITY: 350,
    SNAP_DURATION: 500,
};

gsap.registerPlugin(useGSAP);

const ProjectOne = () => {
    const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
        targetY: 0,
        lastTouchY: 0,
        isSnapping: false,
        isDragging: false,
        lastScrollTime: Date.now(),
    });   
    const [projects, setProjects] = useState<Project[]>([]);
    const [animationComplete, setAnimationComplete] = useState(false);
    const [animationComplete2, setAnimationComplete2] = useState(false);
    const animationRef = useRef(0);
    const targetYRef = useRef(0);
    const currentYRef = useRef(0);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const paralaxMapRef = useRef<Map<number, ParalaxInfo>>(new Map());
    const projectListRef = useRef<HTMLUListElement>(null);
    const minimapListRef = useRef<HTMLUListElement>(null);
    const descriptionListRef = useRef<HTMLUListElement>(null);

    const middleSectionGrow = () => {
        const tl = gsap.timeline()
        tl.to(`.${styles.minimapBackground}`, { width: '40%', duration: 0.8, delay: 0.3, ease: 'back.inOut' });
        return tl;
    }

    const middleSectionExand = () => {
        const tl = gsap.timeline()
        tl.to(`.${styles.minimapBackground}`, { width: '100%', height: '100%', duration: 1, delay: 0, ease: 'expo.inOut' });
        return tl;
    }

    const minimapExpand = () => {
        const tl = gsap.timeline()
        tl.to(`.${styles['minimap-img-preview']}`, { height: '100%', duration: 1.1, delay: 0, clearProps: 'transform', ease: 'back.inOut' })
        .fromTo(`.${styles['minimap-img-item']} > img`, { transform: 'translateY(var(--currentY)) scale(3)' }, { transform: 'translateY(var(--currentY)) scale(1.5)', clearProps: 'transform', duration: 1.3, delay: 0, ease: 'back.inOut' }, "<")
        
        return tl;
    }

    const textAppear = () => {
        const tl = gsap.timeline()
        tl.to(`.${styles.letterLeft} > div`, { transform: 'translateY(0)', duration: 0.35, ease: 'power2.out' })
        .to(`.${styles.text1} > div`, { transform: 'translateY(0)', duration: 0.35, ease: 'power2.out' }, "-=0.2")
        .to(`.${styles.text2} > div`, { transform: 'translateY(0)', duration: 0.35, ease: 'power2.out' }, "-=0.2")
        .to(`.${styles.text3} > div`, { transform: 'translateY(0)', duration: 0.35, ease: 'power2.out' }, "-=0.2")
        .to(`.${styles.letterRight} > div`, { transform: 'translateY(0)', duration: 0.35, ease: 'power2.out' }, "-=0.2")
        return tl;
    }

    const backdropOpacity = () => {
        const tl = gsap.timeline()
        tl.to(`.${styles['backdrop']}`, { background: 'rgba( 0, 0, 0, 0.6 )', duration: 1.5, ease: 'power3.inOut'});
        return tl;
    }

    const backdropHide = () => {
        const tl = gsap.timeline()
        tl.to(`.${styles['backdrop']}`, { background: 'rgba( 0, 0, 0, 0.0 )', filter: 'none', duration: 1.5, ease: 'power3.inOut'});
        return tl;
    }

    const rowsAppear = () => {
        const tl = gsap.timeline()
        tl.fromTo(`.test .${styles['minimap-info-item-row']}:nth-child(1) .${styles['minimap-info-item-row-data']}`, { transform: 'translateY(-150%)', opacity: '0' }, { transform: 'translateY(0)', opacity: '100%', duration: 1.2, ease: 'power3.inOut', clearProps: 'transform' })
        .fromTo(`.test .${styles['minimap-info-item-row']}:nth-child(2) .${styles['minimap-info-item-row-data']}`, { transform: 'translateY(150%)', opacity: '0' }, { transform: 'translateY(0)', opacity: '100%', duration: 1.2, ease: 'power3.inOut', clearProps: 'transform' }, "<");
        return tl;
    }

    const textHide = () => {
        const tl = gsap.timeline()
        tl.to(`.${styles.letterRight} > div`, { transform: 'translateY(100%)', duration: 0.2, delay: 0.8, ease: 'power1.inOut' })
        .to(`.${styles.text3} > div`, { transform: 'translateY(100%)', duration: 0.2, ease: 'power1.inOut' }, "-=0.17")
        .to(`.${styles.text2} > div`, { transform: 'translateY(100%)', duration: 0.2, ease: 'power1.inOut' }, "-=0.17")
        .to(`.${styles.text1} > div`, { transform: 'translateY(100%)', duration: 0.2, ease: 'power1.inOut' }, "-=0.17")
        .to(`.${styles.letterLeft} > div`, { transform: 'translateY(100%)', duration: 0.2, ease: 'power1.inOut' }, "-=0.17");
        return tl;
    }

    const onCompleteBase = () => {
        setAnimationComplete(true);
    }

    const onCompleteContent = () => {
        setAnimationComplete2(true);
    }

    useGSAP(() => {
        const main = gsap.timeline({ onComplete: onCompleteBase });
        main
            .add(middleSectionGrow())
            .add(backdropOpacity(), "<")
            .add(textAppear(), "-=0.2")
        main.play();
        
    });

    useGSAP(() => {
        if (animationComplete && projects.length > 0 && !animationComplete2) {
            const main = gsap.timeline({ onComplete: onCompleteContent });
            main
                .add(textHide())
                .add(backdropHide(), "-=0.3")
                .add(middleSectionExand(), "<")
                .add(minimapExpand(), "-=1")
                .add(rowsAppear(), "-=1")
            main.play();
        }
    }, [projects, animationComplete]);
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const getProjectIndex = (index: number) => {
        return ((index % projectData.length) + projectData.length) % projectData.length
    };

    const createProjects = (prev: Project[], min: number, max: number) => {
        let temp: Project[] = [];
        for(let i = min; i <= max; i++) {
            const paralaxExists = paralaxMapRef.current.has(i)
            if (!paralaxExists) {
                paralaxMapRef.current.set(i, { imgOffset: 0, miniImgOffset: 0, descriptionOffset: 0 })
            }
            const existing = prev.find((o) => o.index === i);
            if (existing) {
                temp.push(existing);
            } else {
                const indx = getProjectIndex(i);
                const data = projectData[indx];
                temp.push({
                    city: data.city,
                    image: data.image,
                    title: data.title,
                    museum: data.museum,
                    years: data.years,
                    projectIndex: indx,
                    index: i,
                    lerp: 0,
                })
            }
        }
        for (const key of paralaxMapRef.current.keys()) {
            if (key < min || key > max) {
                paralaxMapRef.current.delete(key);
            }
        }
        return temp;
    };

    const updateElements = (wrapper: HTMLUListElement | null, height: number, elementY: number, paralaxKey: keyof ParalaxInfo, currentY?: number) => {
        if (wrapper) {
            for (let el of wrapper.children) {
                const htmlEl = el as HTMLElement;
                const ind = Number(
                    htmlEl.dataset.projectIndex
                );
                const paralaxCurrent = paralaxMapRef.current.get(ind);
                const divTargetY = (ind * height + elementY);
                const imgTargetY = (-elementY - ind * height) * 0.2;
                let imgCurrentY = imgTargetY;
                if (paralaxCurrent) {
                    imgCurrentY = lerp(paralaxCurrent[paralaxKey], imgTargetY, 0.08);
                    paralaxMapRef.current.set(ind, { ...paralaxCurrent, [paralaxKey]: imgCurrentY });
                }
                console.log(currentY);
                if (currentY !== undefined) {
                    const isCurrentIndex = Math.abs((-1 * Math.round(currentY) / window.innerHeight) - ind) < 0.5;
                    htmlEl.style.setProperty('--isVisible', isCurrentIndex ? '1' : '0');
                }
                htmlEl.style.setProperty('--currentY', `${divTargetY.toFixed(3)}px`);
                if (paralaxKey !== 'descriptionOffset') {
                    if (Math.abs(imgCurrentY - imgTargetY) > 0.01) {
                        for (let ch of htmlEl.children) {
                            const childElement = ch as HTMLElement;
                            childElement.style.setProperty('--currentY', `${imgCurrentY.toFixed(3)}px`);
                        }
                    }
                }
            } 
        }
    }

    const animate = () => {
        const cY = currentYRef.current;
        const tY = targetYRef.current;
        currentYRef.current = cY + (tY - cY) * config.LERP_FACTOR;

        const projectWrapper = projectListRef?.current;
        const minimapWrapper = minimapListRef?.current;
        const descriptionWrapper = descriptionListRef?.current;
        const mH = minimapWrapper?.clientHeight ? minimapWrapper.clientHeight : 250;
        const dH = descriptionWrapper?.clientHeight ? descriptionWrapper.clientHeight : 250;

        updateElements(projectWrapper, window.innerHeight, cY, "imgOffset");
        updateElements(minimapWrapper, mH, cY * mH / window.innerHeight, 'miniImgOffset');
        updateElements(descriptionWrapper, dH, cY * dH / window.innerHeight, 'descriptionOffset', cY);
        
        animationRef.current = requestAnimationFrame(animate);
    };

    const snapTimeout = () => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
            setScrollInfo((p) => {
                const snapPoint = -Math.round(-p.targetY / window.innerHeight) * window.innerHeight;
                return ({
                    ...p,
                    targetY: snapPoint
                })
            });
        }, 700);
    }

    const createContainers = (tY: number) => {
        const currentIndex = Math.round(-tY / window.innerHeight);
        const min = currentIndex - config.BUFFER_SIZE;
        const max = currentIndex + config.BUFFER_SIZE;
        setProjects((p) => createProjects(p, min, max))
    };

    useEffect(() => {
        animationRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationRef.current);
    }, []);

    useEffect(() => {
        createContainers(scrollInfo.targetY)
    }, [scrollInfo.targetY]);

    useEffect(() => {
        setProjects((p) => createProjects(p, -config.BUFFER_SIZE, config.BUFFER_SIZE))
    }, [projectData]);

    useEffect(() => {
        targetYRef.current = scrollInfo.targetY;
    }, [scrollInfo.targetY]);

    useEffect(() => {
        const onScroll = (e: WheelEvent) => {
            const delta = Math.max(
                Math.min(e.deltaY * config.SCROLL_SPEED, config.MAX_VELOCITY),
                -config.MAX_VELOCITY
            );
            setScrollInfo((p) => ({
                ...p,
                lastScrollTime: Date.now(),
                targetY: p.targetY - delta,
                isSnapping: false,
                isDragging: false,
            }));

            snapTimeout();
        }

        const onTouchStart = (e: TouchEvent) => {
            setScrollInfo((p) => {
                return ({
                    ...p,
                    lastTouchY: e.touches[0].clientY
                })
            })
        }

        const onTouchMove = (e: TouchEvent) => {
            setScrollInfo((p) => {
                const drag = e.touches[0].clientY - p.lastTouchY; 
                return ({
                    ...p,
                    lastTouchY: e.touches[0].clientY,
                    targetY: p.targetY + drag * 2.5
                })
            })

            snapTimeout();
        }

        const onTouchEnd = (e: TouchEvent) => {
            setScrollInfo((p) => ({
                ...p,
                lastTouchY: 0,
            }))
        }

        if (animationComplete2) {
            window.addEventListener("wheel", onScroll);
            window.addEventListener("touchstart", onTouchStart);
            window.addEventListener("touchmove", onTouchMove);
            window.addEventListener("touchend", onTouchEnd);
        }

        return () => {
            if (animationComplete2) {
                window.removeEventListener("wheel", onScroll);
                window.removeEventListener("touchstart", onTouchStart);
                window.removeEventListener("touchmove", onTouchMove);
                window.removeEventListener("touchend", onTouchEnd);
            }
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        }
    }, [animationComplete2]);

    useEffect(() => {
        const onResize = (e: any) => {
            snapTimeout();
            createContainers(scrollInfo.targetY);
        }

        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener("resize", onResize);
        }
    }, [scrollInfo.targetY]);

    return (
        <div className={styles.wrapper}>
            <ul className={styles['project-list']} ref={projectListRef}>
                {projects.map((project) => {
                    
                    return (
                        <div key={`${project.city}-ind${project.index}`} className={styles.project} data-project-index={project.index}>
                            <img src={project.image} alt={project.city}></img>
                        </div>
                    )
                })}
            </ul>
            <div className={styles.backdrop} />
            <div className={styles.minimapContainer}>
                <div className={styles.minimap}>
                    <div className={styles.minimapBackground}>
                        <div className={`${styles.letter} ${styles.letterLeft}`}>
                            <div>C</div>
                        </div>
                        <div className={`${styles.letter} ${styles.letterRight}`}>
                            <div>M</div>
                        </div>
                        <div className={`${styles.text} ${styles.text1}`}>
                            <div>Claude</div>
                        </div>
                        <div className={`${styles.text} ${styles.text2}`}>
                            <div>Lillies</div>
                        </div>
                        <div className={`${styles.text} ${styles.text3}`}>
                            <div>Monet</div>
                        </div>
                    </div>
                    <div className={styles['minimap-wrapper']}>
                        <ul className={styles['minimap-info-list']} ref={descriptionListRef} style={{ opacity: !animationComplete ? '0' : '100%' }}>
                            {projects.map((project, ind) => {
                                return (
                                    <div key={`minimap-${project.city}-ind${project.index}`} className={`${styles['minimap-info-item']} ${project.index === 0 ? 'test' : ''}`} data-project-index={project.index}>
                                        <div className={`${styles['minimap-info-item-row']}`}>
                                            <p className={`${styles['minimap-info-item-row-data']}`}>{(project.projectIndex + 1).toString().padStart(2, '0')}</p>
                                            <p className={`${styles['minimap-info-item-row-data']}`}>{project.city}</p>
                                        </div>
                                        <div className={`${styles['minimap-info-item-row']}`}>
                                            <div className={`${styles['minimap-info-item-row-data']}`}>
                                                <div className={`${styles['minimap-info-item-row-date']}`}>
                                                    ({project.years.join(' – ')})
                                                </div>
                                                <div className={`${styles['minimap-info-item-row-title']}`}>
                                                    {project.title}
                                                </div>
                                            </div>
                                            <p className={`${styles['minimap-info-item-row-data']}`}>{project.museum}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </ul>
                        <ul className={styles['minimap-img-preview']} ref={minimapListRef}>
                            {projects.map((project) => {
                                return (
                                    <div key={`minimap-${project.city}-ind${project.index}`} className={styles['minimap-img-item']} data-project-index={project.index}>
                                        <img src={project.image} alt={project.city}></img>
                                    </div>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectOne