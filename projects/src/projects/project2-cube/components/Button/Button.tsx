import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";
import styles from './Button.module.scss';

gsap.registerPlugin(useGSAP);

interface Props {
    label: string;
    icon?: any;
}

const Button = (props: Props) => {
    return (
        <button className={styles.button}>
            <div className={styles.buttonContent}>
                <div className={styles.buttonContentItem1}>
                    {props.label}
                </div>
                <div className={styles.buttonContentItem2}>
                    {props.label}
                </div>
            </div>
        </button>     
    )
}

export default Button;