import css from "./Button.module.css"
import React, { MouseEvent } from 'react';

const Button = ({text, setHighlightedReference}: {text: string, setHighlightedReference: (text: string) => void}) => {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        const buttonText: string = e.currentTarget.innerText;
        setHighlightedReference(buttonText);
      };
    
    return (
        <button className={css.button} onClick={handleClick}>{text}</button>
    )
}

export default Button