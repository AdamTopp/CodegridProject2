
import { useEffect, useRef } from 'react';
import styles from './SectionWelcome.module.scss';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";
import Header from '../Header/Header';

gsap.registerPlugin(useGSAP);

const SectionWelcome = () => {
    

    return (
       <Header />               
    )
}

export default SectionWelcome