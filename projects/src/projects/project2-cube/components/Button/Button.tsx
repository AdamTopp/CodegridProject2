import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";
import styles from './Button.module.scss';

gsap.registerPlugin(useGSAP);

interface Props {
    label: string;
    icon?: any;
    outline?: boolean;
    customClassButton?: string;
    customClassContent?: string;
    customClassItem1?: string;
    customClassItem2?: string;
}

const Button = (props: Props) => {
    return (
        <button className={`${styles.button} ${props.outline ? styles.outline : ''} ${props.customClassButton || ''}`}>
            <div className={`${styles.buttonContent} ${props.customClassContent || ''}`}>
                <div className={`${styles.buttonContentItem1} ${props.customClassItem1 || ''}`}>
                    {props.label}
                </div>
                <div className={`${styles.buttonContentItem2} ${props.customClassItem2 || ''}`}>
                    {props.label}
                </div>
            </div>
        </button>     
    )
}

export default Button;