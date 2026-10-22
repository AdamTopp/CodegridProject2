
import { useEffect, useRef, useState, type ReactElement } from 'react';
import styles from './Header.module.scss';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";
import Button from '../Button/Button';
import Icon from './MuzeumLogo.svg';

gsap.registerPlugin(useGSAP);

interface PathButton {
    id: string,
    isVisible: boolean,
    label: string,
    isHeader?: boolean,
}

const Header = () => {
    const INIT_PATHS: PathButton[] = [{
        id: 'idName',
        isVisible: false,
        label: 'Muzeum Rogalin',
        isHeader: true
    }, {
        id: 'idHome',
        isVisible: false,
        label: 'Home'
    }, {
        id: 'idAbout',
        isVisible: false,
        label: 'About'
    }, {
        id: 'idExpositions',
        isVisible: false,
        label: 'Expositions'
    }, {
        id: 'idContact',
        isVisible: false,
        label: 'Contact'
    }, ];

    const [isOpen, setIsOpen] = useState(false);
    const [visibleItems, setVisibleItems] = useState<PathButton[]>(INIT_PATHS);
    const menuListRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (!menuListRef?.current) {
            return
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                setVisibleItems((items) => {
                    
                    const newItems = items.map((i) => i.id !== e.target.id ? i : ({
                        ...i,
                        isVisible: e.isIntersecting,
                    }));
                    return newItems;
                })
            })
        }, {
            root: menuListRef.current,
            threshold: 1,
            rootMargin: '0px 0px -12px 0px',
        });

        for (const target of menuListRef.current.children) {
            observer.observe(target);
        }
        return () => {
            observer.disconnect()
        }
    }, [isOpen])

    useEffect(() => {
        console.log(visibleItems);
    }, [visibleItems])

    return (
        <nav className={`${styles.nav}`}>
            <div className={styles.navHeader}>
                <button className={styles.navButton} onClick={() => setIsOpen(p => !p)}>
                    <div className={styles.lines}>
                        <span className={`${styles.line} ${styles.lineTop} ${isOpen ? styles.rotateTop : ''}`} />
                        <span className={`${styles.line} ${styles.lineBottom} ${isOpen ? styles.rotateBottom : ''}`} />
                    </div>
                    <div>Menu</div>
                </button>
                <div>
                    <img src={Icon} style={{ height: '32px' }}/>
                </div>
                <Button label='Inquire' outline />
            </div>
            <ul ref={menuListRef} className={`${styles.navContent} ${!isOpen ? styles.navContentClosed : ''}`}>
                {visibleItems.map(el => (
                    <li key={el.id} id={el.id} className={el.isVisible ? styles.show : ''}>
                        {el.isHeader ? (<h2><button>{el.label}</button></h2>) : (<Button label={el.label} customClassItem1={styles.buttonItem1} customClassItem2={`${styles.buttonHover} ${styles.buttonItem2}`}/>)}
                    </li>
                ))}
                <span className={styles.spacer}></span>
            </ul>
        </nav>                
    )
}

export default Header;