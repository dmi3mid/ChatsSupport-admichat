import React from 'react'

export default function Input({placeholder, styles, ...props}) {
    return (
        <input type="text" autoFocus placeholder={placeholder} className={styles} {...props}/>
    )
}
