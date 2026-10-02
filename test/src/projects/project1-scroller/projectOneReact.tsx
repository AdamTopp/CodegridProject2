
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './projectOne.module.scss';

interface Data {
    title: string;
    image: string;
    category: string;
    year: string;
}

interface ParalaxInfo {
    imgOffset: number;
    miniImgOffset: number;
    descriptionOffset: number;
}


export interface Project extends Data {
    index: number;
    lerp: number;
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
        title: "Test 1",
        image: "img1.jpg",
        category: "Category 1",
        year: "2021"
    },
    {
        title: "Test 2",
        image: "img2.jpg",
        category: "Category 2",
        year: "2022"
    },
    {
        title: "Test 3",
        image: "img3.jpg",
        category: "Category 3",
        year: "2023"
    },
    {
        title: "Test 4",
        image: "img4.jpg",
        category: "Category 4",
        year: "2024"
    }
];

const config = {
    SCROLL_SPEED: 5,
    LERP_FACTOR: 0.05,
    BUFFER_SIZE: 4,
    MAX_VELOCITY: 250,
    SNAP_DURATION: 500,
};

const ProjectOne = () => {
    const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
        targetY: 0,
        lastTouchY: 0,
        isSnapping: false,
        isDragging: false,
        lastScrollTime: Date.now(),
    });   
    const [projects, setProjects] = useState<Project[]>([]);
    const minimapHeight = 250;
    const animationRef = useRef(0);
    const targetYRef = useRef(0);
    const currentYRef = useRef(0);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const paralaxMapRef = useRef<Map<number, ParalaxInfo>>(new Map());
    const projectListRef = useRef<HTMLUListElement>(null);
    const minimapListRef = useRef<HTMLUListElement>(null);
    const descriptionListRef = useRef<HTMLUListElement>(null);

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
                    title: data.title,
                    image: data.image,
                    category: data.category,
                    year: data.year,
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

    const updateElements = (wrapper: HTMLUListElement | null, height: number, elementY: number, paralaxKey: keyof ParalaxInfo) => {
        if (wrapper) {
            for (let el of wrapper.children) {
                const htmlEl = el as HTMLElement;
                const imgEl = htmlEl.children[0] as HTMLElement;
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
                
                htmlEl.style.setProperty('--currentY', `${divTargetY.toString()}px`);
                if (paralaxKey !== 'descriptionOffset') {
                if (Math.abs(imgCurrentY - imgTargetY) > 0.01) {
                    for (let ch of htmlEl.children) {
                        const childElement = ch as HTMLElement;
                        childElement.style.setProperty('--currentY', `${imgCurrentY.toString()}px`);
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
        updateElements(projectWrapper, window.innerHeight, cY, "imgOffset");
        updateElements(minimapWrapper, minimapHeight, cY * minimapHeight / window.innerHeight, 'miniImgOffset');
        updateElements(descriptionWrapper, minimapHeight, cY * minimapHeight / window.innerHeight, 'descriptionOffset');
        
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

        window.addEventListener("wheel", onScroll);
        window.addEventListener("touchstart", onTouchStart);
        window.addEventListener("touchmove", onTouchMove);
        window.addEventListener("touchend", onTouchEnd);

        return () => {
            window.removeEventListener("wheel", onScroll);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        }
    }, []);

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
                        <div key={`${project.title}-ind${project.index}`} className={styles.project} data-project-index={project.index}>
                            <img src={project.image} alt={project.title}></img>
                        </div>
                    )
                })}
            </ul>
            <div className={styles.minimap}>
                <div className={styles['minimap-wrapper']}>
                    <ul className={styles['minimap-img-preview']} ref={minimapListRef}>
                        {projects.map((project) => {
                            return (
                                <div key={`minimap-${project.title}-ind${project.index}`} className={styles['minimap-img-item']} data-project-index={project.index}>
                                    <img src={project.image} alt={project.title}></img>
                                </div>
                            )
                        })}
                    </ul>
                    <ul className={styles['minimap-info-list']} ref={descriptionListRef}>
                        {projects.map((project) => {
                            return (
                                <div key={`minimap-${project.title}-ind${project.index}`} className={styles['minimap-info-item']} data-project-index={project.index}>
                                    <div className={styles['minimap-info-item-row']}>
                                        <p>01</p>
                                        <p>{project.title}</p>
                                    </div>
                                    <div className={styles['minimap-info-item-row']}>
                                        <p>{project.category}</p>
                                        <p>{project.year}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ProjectOne