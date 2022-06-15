const isStatusFailure = (result: any): boolean => {
  const status = result?.response?.status

  return status < 200 || status >= 300
}

export { isStatusFailure }
