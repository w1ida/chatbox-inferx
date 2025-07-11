import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import HistoryIcon from '@mui/icons-material/History'
import Save from '@mui/icons-material/Save'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import * as atoms from '../stores/atoms'
import { useTranslation } from 'react-i18next'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import StyledMenu from './StyledMenu'
import { useState, useEffect } from 'react'
import { MenuItem } from '@mui/material'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices'
import WidthNormalIcon from '@mui/icons-material/WidthNormal'
import WidthWideIcon from '@mui/icons-material/WidthWide'
import { useIsLargeScreen, useIsSmallScreen } from '@/hooks/useScreenChange'
import * as sessionActions from '@/stores/sessionActions'
import { ConfirmDeleteMenuItem } from './ConfirmDeleteButton'
import NiceModal from '@ebay/nice-modal-react'
import { removeSession } from '@/stores/sessionStorageMutations'
import UpdateAvailableButton from './UpdateAvailableButton'
import platform from '@/platform'

/**
 * 顶部标题工具栏（右侧）
 * @returns
 */
export default function Toolbar() {
  const { t } = useTranslation()
  const isSmallScreen = useIsSmallScreen()
  const isLargeScreen = useIsLargeScreen()

  const currentSession = useAtomValue(atoms.currentSessionAtom)
  const [showUpdateNotification, setShowUpdateNotification] = useState(false)

  const setOpenSearchDialog = useSetAtom(atoms.openSearchDialogAtom)
  const setThreadHistoryDrawerOpen = useSetAtom(atoms.showThreadHistoryDrawerAtom)
  const [widthFull, setWidthFull] = useAtom(atoms.widthFullAtom)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  useEffect(() => {
    const offUpdateDownloaded = platform.onUpdateDownloaded(() => {
      setShowUpdateNotification(true)
    })
    return () => {
      offUpdateDownloaded()
    }
  }, [setShowUpdateNotification])

  const handleMoreMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }
  const handleMoreMenuClose = () => {
    setAnchorEl(null)
  }
  const handleExportAndSave = () => {
    NiceModal.show('export-chat')
    handleMoreMenuClose()
  }
  const handleSessionClean = () => {
    if (!currentSession) {
      return
    }
    sessionActions.clear(currentSession.id)
    handleMoreMenuClose()
  }
  const handleSessionDelete = () => {
    if (!currentSession) {
      return
    }
    removeSession(currentSession.id)
    handleMoreMenuClose()
  }

  return (
    <Box className="controls">
      {showUpdateNotification && <UpdateAvailableButton sx={{ mr: 2 }} />}
      {isSmallScreen ? (
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={() => setOpenSearchDialog(true)}
          sx={{
            mr: 0.5
          }}
        >
          <SearchIcon />
        </IconButton>
      ) : (
        <Button
          component="label"
          variant="outlined"
          color="inherit"
          startIcon={<SearchIcon />}
          sx={{ mr: 1 }}
          onClick={() => setOpenSearchDialog(true)}
          size="small"
          className="transform-none opacity-30"
        >
          <span className="justify-between transform-none text-sm" style={{ textTransform: 'none' }}>
            <span className="mr-1">{t('Search')}...</span>
            {/* <span className='text-xs bg-slate-600 opacity-60 text-white border border-solid px-0.5 border-slate-600'>
                                    Ctrl K
                                </span> */}
          </span>
        </Button>
      )}
      {isLargeScreen && (
        <IconButton
          color="inherit"
          aria-label="width-full-button"
          onClick={() => setWidthFull(!widthFull)}
          sx={{
            mr: 0.5
          }}
        >
          {widthFull ? <WidthWideIcon /> : <WidthNormalIcon />}
        </IconButton>
      )}
      <IconButton
        color="inherit"
        aria-label="thread-history-drawer-button"
        sx={{
          mr: 0.5
        }}
        onClick={() => setThreadHistoryDrawerOpen(true)}
      >
        <HistoryIcon />
      </IconButton>
      <IconButton color="inherit" aria-label="more-menu-button" onClick={handleMoreMenuOpen}>
        <MoreHorizIcon />
      </IconButton>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleMoreMenuClose}>
        <MenuItem onClick={handleExportAndSave} disableRipple divider>
          <Save fontSize="small" />
          {t('Export Chat')}
        </MenuItem>
        <ConfirmDeleteMenuItem
          onDelete={handleSessionClean}
          label={t('Clear All Messages')}
          color="warning"
          icon={<CleaningServicesIcon fontSize="small" />}
        />
        <ConfirmDeleteMenuItem onDelete={handleSessionDelete} label={t('Delete Current Session')} />
      </StyledMenu>
    </Box>
  )
}
