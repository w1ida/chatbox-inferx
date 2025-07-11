import platform from '@/platform'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'

// You can replace this SVG with your preferred icon library (like Heroicons, FontAwesome, etc.)
const RefreshIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.95006 0.823566C4.10229 0.157908 5.44143 -0.110445 6.76118 0.0598457C8.08093 0.230136 9.30808 0.829623 10.2536 1.76596C11.1991 2.7023 11.8106 3.92354 11.9937 5.24156C12.0444 5.60625 11.7899 5.94297 11.4252 5.99365C11.0605 6.04433 10.7238 5.78978 10.6731 5.42509C10.5302 4.39674 10.0531 3.44391 9.31541 2.71336C8.57769 1.98281 7.62024 1.51508 6.59055 1.38222C5.56085 1.24935 4.51603 1.45873 3.61704 1.97809C3.02552 2.31981 2.51873 2.78327 2.12752 3.33333H3.33342C3.7016 3.33333 4.00008 3.63181 4.00008 4C4.00008 4.36819 3.7016 4.66666 3.33342 4.66666H1.01499C1.00489 4.66689 0.994771 4.66689 0.984631 4.66666H0.666748C0.298559 4.66666 8.17196e-05 4.36819 8.17196e-05 4V1.33333C8.17196e-05 0.965139 0.298559 0.666663 0.666748 0.666663C1.03494 0.666663 1.33342 0.965139 1.33342 1.33333V2.1819C1.78579 1.64165 2.33182 1.18073 2.95006 0.823566ZM0.574983 6.00634C0.939668 5.95566 1.27639 6.21021 1.32707 6.5749C1.46998 7.60325 1.94704 8.55609 2.68475 9.28663C3.42247 10.0172 4.37992 10.4849 5.40962 10.6178C6.43931 10.7506 7.48413 10.5413 8.38313 10.0219C8.97464 9.68018 9.48144 9.21672 9.87265 8.66666H8.66675C8.29856 8.66666 8.00008 8.36819 8.00008 8C8.00008 7.63181 8.29856 7.33333 8.66675 7.33333H10.9852C10.9953 7.3331 11.0054 7.3331 11.0155 7.33333H11.3334C11.7016 7.33333 12.0001 7.63181 12.0001 8V10.6667C12.0001 11.0349 11.7016 11.3333 11.3334 11.3333C10.9652 11.3333 10.6667 11.0349 10.6667 10.6667V9.81809C10.2144 10.3583 9.66835 10.8193 9.0501 11.1764C7.89787 11.8421 6.55874 12.1104 5.23899 11.9401C3.91924 11.7699 2.69208 11.1704 1.74656 10.234C0.801035 9.2977 0.189595 8.07646 0.00642763 6.75843C-0.0442532 6.39374 0.210298 6.05702 0.574983 6.00634Z"
      fill="#FAB005"
    />
  </svg>
)

const YellowBorderButton = styled(Button)(({ theme }) => ({
  borderRadius: '9999px',
  border: '1px solid #FAB005',
  color: '#FAB005',
  height: '28px',
  minHeight: '28px',
  padding: '0 16px',
  '&:hover': {
    border: '1px solid #FAB005',
    backgroundColor: 'rgba(250, 176, 5, 0.04)',
  },
}))

const UpdateAvailableButton = (props: any) => {
  const { t } = useTranslation()

  const handleUpdateInstall = () => {
    platform.installUpdate()
  }
  return (
    <YellowBorderButton onClick={handleUpdateInstall} type="button" variant="outlined" {...props}>
      <RefreshIcon />
      <span className="ml-1 min-w-16 whitespace-nowrap">{t('Update Available')}</span>
    </YellowBorderButton>
  )
}

export default UpdateAvailableButton
