
import { useEffect, useRef, useState } from 'react';
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
}


export interface Project extends Data {
    index: number;
    lerp: number;
}

export interface ScrollInfo {
    targetY: number;
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
    SCROLL_SPEED: 0.75,
    LERP_FACTOR: 0.05,
    BUFFER_SIZE: 4,
    MAX_VELOCITY: 150,
    SNAP_DURATION: 500,
};

const ProjectOne = () => {
    const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
        targetY: 0,
        isSnapping: false,
        isDragging: false,
        lastScrollTime: Date.now(),
    });   
    const [projects, setProjects] = useState<Project[]>([]);
    const minimapHeight = 250;
    const projectHeight = window.innerHeight;
    const animationRef = useRef(0);
    const targetYRef = useRef(0);
    const currentYRef = useRef(0);
    const paralaxMapRef = useRef<Map<number, ParalaxInfo>>(new Map());
    const projectListRef = useRef<HTMLUListElement>(null);

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const getProjectIndex = (index: number) => {
        return ((index % projectData.length) + projectData.length) % projectData.length
    };

    const createProjects = (prev: Project[], min: number, max: number) => {
        let temp: Project[] = [];
        for(let i = min; i <= max; i++) {
            const paralaxExists = paralaxMapRef.current.has(i)
            if (!paralaxExists) {
                paralaxMapRef.current.set(i, { imgOffset: 0, miniImgOffset: 0 })
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

    const updateElements = (wrapper: HTMLUListElement | null, height: number) => {
        const cY = currentYRef.current;
        if (wrapper) {
            for (let el of wrapper.children) {
                const htmlEl = el as HTMLElement;
                const imgEl = htmlEl.children[0] as HTMLElement;
                const ind = Number(
                    htmlEl.dataset.projectIndex
                );
                const paralaxCurrent = paralaxMapRef.current.get(ind);
                const divTargetY = ind * height + cY;
                const imgTargetY = (-cY - ind * height) * 0.2;
                let imgCurrentY = imgTargetY;
                if (paralaxCurrent) {
                    imgCurrentY = lerp(paralaxCurrent?.imgOffset, imgTargetY, 0.08);
                    paralaxMapRef.current.set(ind, { ...paralaxCurrent, imgOffset: imgCurrentY });
                }

                htmlEl.style.setProperty('--currentY', `${divTargetY.toString()}px`);
                if (Math.abs(imgCurrentY - imgTargetY) > 0.01) {
                    imgEl.style.setProperty('--currentY', `${imgCurrentY.toString()}px`);
                }
            } 
        }
    }

    const animate = () => {
        const cY = currentYRef.current;
        const tY = targetYRef.current;
        currentYRef.current = cY + (tY - cY) * config.LERP_FACTOR;

        const projectWrapper = projectListRef?.current;
        updateElements(projectWrapper, window.innerHeight)
        
        animationRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        animationRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationRef.current);
    }, []);

    useEffect(() => {
        const currentIndex = Math.round(-scrollInfo.targetY / window.innerHeight);
        const min = currentIndex - config.BUFFER_SIZE;
        const max = currentIndex + config.BUFFER_SIZE;
        setProjects((p) => createProjects(p, min, max))
    }, [scrollInfo.targetY, window.innerHeight]);

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
                lastScrollTime: Date.now(),
                targetY: p.targetY -= delta,
                isSnapping: false,
                isDragging: false,
            }));
        }
        window.addEventListener("wheel", onScroll)

        return () => {
            window.removeEventListener("wheel", onScroll)
        }
    }, []);

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
                    {/* <div className={styles['minimap-img-preview']}>
                        {projects.map((project, ind) => {
                            const minimapY = (scrollInfo.currentY * minimapHeight) / projectHeight;
                            const y = project.index * minimapHeight + minimapY;
                            const imgY = (-minimapY - project.index * minimapHeight) * 0.2;
                            // const currentTest = lerp()
                            return (
                                <div key={`minimap-${project.title}-ind${project.index}`} className={styles['minimap-img-item']} style={{ transform: `translateY(${y}px)`}}>
                                    <img src={project.image} alt={project.title} style={{ transform: `translateY(${imgY}px)`}}></img>
                                </div>
                            )
                        })}
                    </div> */}
                    <div className={styles['minimap-info-list']}></div>
                </div>
            </div>
        </div>
    )
}

export default ProjectOne