import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Breakpoint } from '@mui/material'

const useBreakpoint = (breakpoint: Breakpoint) => {
    const theme = useTheme()
    return useMediaQuery(theme.breakpoints.down(breakpoint))
}

export default useBreakpoint
