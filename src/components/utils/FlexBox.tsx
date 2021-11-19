import { Box } from '@mui/material'
import { PropsWithChildren } from 'react'

export default function FlexBox({ direction, children }: PropsWithChildren<{ direction?: 'row' | 'column' }>) {
    return (
        <Box sx={{ display: 'flex', flexDirection: direction }}>{children}</Box>
    )
}
