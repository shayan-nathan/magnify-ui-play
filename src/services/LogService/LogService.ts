const info = ({ message, data }: { message: string; data: any }) => {
  console.log('--------------------------------------------------')
  console.log(`${message} : `, data)
  console.log('--------------------------------------------------')
}

const error = ({ message, error }: { message: string; error: any }) => {
  console.log('--------------------------------------------------')
  console.error(`${message} : `, error)
  console.log('--------------------------------------------------')
}

export const LoggerService = {
  info,
  error,
}
