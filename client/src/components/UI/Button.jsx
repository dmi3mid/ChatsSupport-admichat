import React from 'react'

export default function Button({children, styles, ...props}) {
    return (
        <button className={styles} {...props}>{children}</button>
    )
}
