
import { useEffect, useState } from 'react';
import styles from './projectOne.module.scss';

interface Test {
    title: string;
    int: number;
}

const ProjectOne = () => { 
    const [a, setA] = useState(false);
    const [projects, setProjects] = useState<Test[]>([]);

    const animate = () => {
        if(a) {
            setProjects((projects) => projects.map((p) => ({
                ...p,
                int: Math.random(),
            })))
        }
        
        requestAnimationFrame(animate);
    };

    useEffect(() => {
        const raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, []);

    useEffect(() => {
        setProjects([{ title: 'Adam 1', int:0 }, { title: 'Adam 2', int:0 }, { title: 'Adam 3', int:0 }])
    }, []);

    console.log('Redraw');

    return (
        <div>
            <button onClick={() => setA(true)}>Aaa</button>
                {projects.map((project) => {
                    return (
                        <div key={`${project.title}`}>
                            {project.title}: {project.int}
                        </div>
                    )
                })}
        </div>
    )
}

export default ProjectOne