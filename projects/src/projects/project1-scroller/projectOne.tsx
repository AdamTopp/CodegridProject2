
import { useState } from 'react';
import styles from './projectOne.module.scss';
import projectData from './data.json';

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

const ProjectOne = () => {
    const [state, setState] = useState(INIT_STATE);    
    const config = {
        SCROLL_SPEED: 0.75,
        LERP_FACTOR: 0.05,
        BUFFER_SIZE: 4,
        MAX_VELOCITY: 150,
        SNAP_DURATION: 500,
    };

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const createParalax = (img: any, height: number) => {
        let current = 0;
        const upadate = (scroll: number, index: number) => {
            const target = (-scroll - index * height) * 0.2;
            current = lerp(current, target, 0.1);
            if (Math.abs(current - target) > 0.01) {
                img.style.transform = `translateY(${current}px) scale(1.5)`
            }
        }
        return upadate;
    }

    const getProjectData = (index: number) => {
        const i = ((Math.abs(index) % projectData.length) + projectData.length);
        return projectData[i]
    }

    const createElement = (index: number, type: any) => {
        const maps = {
            main: state.projects,
            minimap: state.minimap,
            info: state.minimapInfo,
        }
        if (maps[type].has(index)) return;

        const data = getProjectData(index);
        const num = (
            (((Math.abs(index) % projectData.length) + projectData.length) % projectData.length) + 1
        ).toString().padStart(2, '0');

        if(type === 'main') {
            const el = document.createElement('div');
            el.className = styles.project;
            el.innerHTML = `<img src="${data.image}" alt="${data.title}" />`;
            document.querySelector(styles['project-list'])?.appendChild(el);
            setState(p => ({
                ...p,
                projects: p.projects.set(index, {
                    el,
                    paralax: createParalax(el.querySelector('img'), window.innerHeight),
                }),
            }))
        } else if (type === 'minimap') {
            const el = document.createElement('div');
            el.className = styles['minimap-img-item'];
            el.innerHTML = `<img src="${data.image}" alt="${data.title}" />`;
            document.querySelector(styles['minimap-img-preview'])?.appendChild(el);
            setState(p => ({
                ...p,
                minimap: p.minimap.set(index, {
                    el,
                    paralax: createParalax(el.querySelector('img'), 250),
                }),
            }))
        } else {
            const el = document.createElement('div');
            el.className = styles['minimap-info-item'];
            el.innerHTML = `
                <div class="${styles['minimap-info-item-row']}">
                    <p>${num}</p>
                    <p>${data.title}</p>
                </div>
                <div class="${styles['minimap-info-item-row']}">
                    <p>${data.category}</p>
                    <p>${data.year}</p>
                </div>
            `;
            document.querySelector(styles['minimap-info-list'])?.appendChild(el);
            setState(p => ({
                ...p,
                minimapInfo: p.minimapInfo.set(index, {
                    el,
                }),
            }))
        }
    }

    for(let i = -config.BUFFER_SIZE; i <= config.BUFFER_SIZE; i++) {
        createElement(i, 'main');
        createElement(i, 'minimap');
        createElement(i, 'info');
    }

    return (
        <div className={styles.wrapper}>
            <ul className={styles['project-list']}></ul>
            <div className={styles.minimap}>
                <div className={styles['minimap-wrapper']}>
                    <div className={styles['minimap-img-preview']}></div>
                    <div className={styles['minimap-info-list']}></div>
                </div>
            </div>
        </div>
    )
}

export default ProjectOne