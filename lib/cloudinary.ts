const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

/**
 * Upload direct navigateur -> Cloudinary via un upload preset unsigned.
 * Le fichier ne transite pas par le serveur ; le preset "cvbuilder" définit
 * déjà l'asset folder de destination côté Cloudinary.
 */
export async function uploadImageToCloudinary(file: Blob, fileName = "photo.jpg"): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Configuration Cloudinary manquante (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)")
  }

  const body = new FormData()
  body.append("file", file, fileName)
  body.append("upload_preset", UPLOAD_PRESET)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body,
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.error?.message || "Échec de l'upload de la photo")
  }

  return data.secure_url as string
}
