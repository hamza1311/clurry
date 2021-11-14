import { LinearProgress } from '@mui/material'
import React from 'react'

interface LoadingIndicatorProps {
    color?: 'primary' | 'secondary',
    isVisible: boolean

}

export default function LoadingIndicator({ color, isVisible }: LoadingIndicatorProps) {
    if (!isVisible) {
        return <></>
    }
    return <LinearProgress color={color} />
}


LoadingIndicator.defaultProps = {
    color: 'secondary',
    isVisible: true
}
