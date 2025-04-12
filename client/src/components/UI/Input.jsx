import React from 'react'

export default function Input({placeholder, styles, ...props}) {
    return (
        <input type="text" placeholder={placeholder} className={styles} {...props}/>
    )
}
