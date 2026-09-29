
import { useEffect, useState } from 'react';
import styles from './projectOne.module.scss';

interface Data {
    title: string;
    image: string;
    category: string;
    year: string;
}

interface Project extends Data {
    index: number;
}

interface SnapInfo {
    y: number;
    target: number;
}

interface ScrollInfo {
    targetY: number;
    currentY: number;
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

const INIT_STATE = {
    currentY: 0,
    targetY: 0,
    isDragging: false,
    projects: new Map(),
    minimap: new Map(),
    minimapInfo: new Map(),
    isSnapping: false,
    snapStart: { time: 0, y: 0, target: 0 },
    lastScrollTime: Date.now(),
};

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
        currentY: 0,
        isSnapping: false,
        isDragging: false,
        lastScrollTime: Date.now(),
    });   
    const [projects, setProjects] = useState<Project[]>([]);
    const minimapHeight = 250;
    const projectHeight = window.innerHeight;

    // const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const getProjectIndex = (index: number) => {
        return ((index % projectData.length) + projectData.length) % projectData.length
    };

    useEffect(() => {
        const onScroll = (e: WheelEvent) => {
            const delta = Math.max(
                Math.min(e.deltaY * config.SCROLL_SPEED, config.MAX_VELOCITY),
                -config.MAX_VELOCITY
            );
            setScrollInfo((p) => ({
                lastScrollTime: Date.now(),
                targetY: p.targetY -= delta,
                currentY: p.currentY,
                isSnapping: false,
                isDragging: false,
            }));
        }
        window.addEventListener("wheel", onScroll)

        return () => {
            window.removeEventListener("wheel", onScroll)
        }
    }, []);

    const createProjects = (min: number, max: number) => {
        let temp: Project[] = []
        for(let i = min; i <= max; i++) {
            const indx = getProjectIndex(i);
            const data = projectData[indx];
            temp.push({
                title: data.title,
                image: data.image,
                category: data.category,
                year: data.year,
                index: i,
            })
        }
        return temp;
    };

    useEffect(() => {
        const r = createProjects(-config.BUFFER_SIZE, config.BUFFER_SIZE);
        setProjects(r)
    }, [projectData]);

    useEffect(() => {
        console.log('TargrtY: ', scrollInfo.targetY);
        const currentIndex = Math.round(-scrollInfo.targetY / projectHeight);
        const min = currentIndex - config.BUFFER_SIZE;
        const max = currentIndex + config.BUFFER_SIZE;
        const r = createProjects(min, max)
        setProjects(r)
    }, [scrollInfo.targetY]);

    const animate = () => {
        setScrollInfo((p) => ({
            ...p,
            currentY: Math.round(p.currentY + (p.targetY - p.currentY) * config.LERP_FACTOR),
        }));
        requestAnimationFrame(animate);
    };

    useEffect(() => {
        const raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, []);

    const snap = () => {
        setScrollInfo((p) => ({
            ...p,
            isSnapping: true,
            
        }))
    }

    return (
        <div className={styles.wrapper}>
            <ul className={styles['project-list']}>
                {projects.map((project, ind) => {
                    const y = project.index * projectHeight + scrollInfo.currentY;
                    const imgY = (-scrollInfo.currentY - project.index * projectHeight) * 0.2;
                    return (
                        <div key={`${project.title}-ind${project.index}`} className={styles.project} style={{ transform: `translateY(${y}px)`}}>
                            <img src={project.image} alt={project.title} style={{ transform: `translateY(${imgY}px)`}}></img>
                        </div>
                    )
                })}
            </ul>
            <div className={styles.minimap}>
                <div className={styles['minimap-wrapper']}>
                    <div className={styles['minimap-img-preview']}>
                        {projects.map((project, ind) => {
                            const minimapY = (scrollInfo.currentY * minimapHeight) / projectHeight;
                            const y = project.index * minimapHeight + minimapY;
                            const imgY = (-minimapY - project.index * minimapHeight) * 0.2;
                            return (
                                <div key={`minimap-${project.title}-ind${project.index}`} className={styles['minimap-img-item']} style={{ transform: `translateY(${y}px)`}}>
                                    <img src={project.image} alt={project.title} style={{ transform: `translateY(${imgY}px)`}}></img>
                                </div>
                            )
                        })}
                    </div>
                    <div className={styles['minimap-info-list']}></div>
                </div>
            </div>
        </div>
    )
}

export default ProjectOne