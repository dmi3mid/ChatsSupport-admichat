import React from 'react'

export default function Button({children, styles}) {
    return (
        <button className={styles}>{children}</button>
    )
}
