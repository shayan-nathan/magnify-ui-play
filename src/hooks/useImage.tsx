import { useEffect, useState } from 'react'

const useImage = (fileName: string) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [image, setImage] = useState(null)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await import(`assets/icons/${fileName}.svg`) // change relative path to suit your needs
        setImage(response.default)
      } catch (err: any) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchImage()
  }, [fileName])

  return {
    loading,
    error,
    image,
  }
}

export default useImage
