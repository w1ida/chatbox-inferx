import { useAtom } from 'jotai'
import { FC } from 'react'
import * as atoms from '@/stores/atoms'
import { cn } from '@/lib/utils'
import { useIsSmallScreen } from '@/hooks/useScreenChange'
import { Box, IconButton, Typography, useTheme } from '@mui/material'
import { PanelRightClose } from 'lucide-react'
import useNeedRoomForWinControls from '@/hooks/useNeedRoomForWinControls'

export type PageProps = {
  children?: React.ReactNode
  title: string | React.ReactNode
  left?: React.ReactNode
}

export const Page: FC<PageProps> = ({ children, title, left }) => {
  const [showSidebar, setShowSidebar] = useAtom(atoms.showSidebarAtom)
  const isSmallScreen = useIsSmallScreen()
  const theme = useTheme()
  const { needRoomForMacWindowControls } = useNeedRoomForWinControls()
  return (
    <div className="flex flex-col h-full">
      <div
        className={cn(
          'flex flex-row items-center pt-1',
          isSmallScreen ? '' : showSidebar ? 'sm:pl-3 sm:pr-2' : 'pr-2',
          (!showSidebar || isSmallScreen) && needRoomForMacWindowControls ? 'pl-20' : 'pl-3'
        )}
        style={{
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: theme.palette.divider,
        }}
      >
        {left ||
          ((!showSidebar || isSmallScreen) && (
            <Box onClick={() => setShowSidebar(!showSidebar)}>
              <IconButton
                sx={
                  isSmallScreen
                    ? {
                        borderColor: theme.palette.action.hover,
                        borderStyle: 'solid',
                        borderWidth: 1,
                      }
                    : {}
                }
              >
                <PanelRightClose size="20" strokeWidth={1.5} />
              </IconButton>
            </Box>
          ))}
        {/* 固定高度，和 Windows 的 win controls bar 高度一致 */}
        <div className={cn('title-bar w-full mx-auto flex flex-row', 'py-2 h-12')}>
          {typeof title === 'string' ? (
            <Typography
              variant="h6"
              color="inherit"
              component="div"
              noWrap
              sx={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: isSmallScreen ? '12rem' : '18rem',
              }}
              className={cn('flex items-center', showSidebar ? 'ml-3' : 'ml-1')}
            >
              {title}
            </Typography>
          ) : (
            title
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}

export default Page
