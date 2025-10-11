"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X, Video, ImageIcon } from "lucide-react"

interface BannerUploadProps {
  file: File | null
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
}

interface PhotosUploadProps {
  files: File[]
  onFilesChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: (index: number) => void
}

interface VideoUploadProps {
  file: File | null
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
}

const BannerUpload = ({ file, onFileChange, onRemove }: BannerUploadProps) => {
  const handleButtonClick = () => {
    const input = document.getElementById("banner-upload") as HTMLInputElement
    input?.click()
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
      {file ? (
        <div className="relative">
          <img
            src={URL.createObjectURL(file) || "/placeholder.svg"}
            alt="Banner preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
            aria-label="Remove banner"
          >
            <X size={16} />
          </button>
          <Badge className="absolute top-2 left-2 bg-blue-500">Banner Rasm</Badge>
        </div>
      ) : (
        <div>
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900">Banner rasmini yuklang</p>
            <p className="text-sm text-gray-500">Faqat 1 ta rasm, banner uchun moʻljallangan</p>
          </div>
          <Input type="file" accept="image/*" onChange={onFileChange} className="hidden" id="banner-upload" />
          <Button type="button" variant="outline" className="mt-2 bg-transparent" onClick={handleButtonClick}>
            Rasm Tanlash
          </Button>
        </div>
      )}
    </div>
  )
}

const PhotosUpload = ({ files, onFilesChange, onRemove }: PhotosUploadProps) => {
  const handleButtonClick = () => {
    const input = document.getElementById("photos-upload") as HTMLInputElement
    input?.click()
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
      <div className="text-center mb-4">
        <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
        <p className="text-sm font-medium text-gray-900">Rasmlar</p>
        <p className="text-sm text-gray-500">Maksimum 5 ta rasm</p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file) || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label={`Remove image ${index + 1}`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length < 5 && (
        <>
          <Input type="file" accept="image/*" multiple onChange={onFilesChange} className="hidden" id="photos-upload" />
          <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleButtonClick}>
            Rasmlar Qoʻshish ({files.length}/5)
          </Button>
        </>
      )}
    </div>
  )
}

const VideoUpload = ({ file, onFileChange, onRemove }: VideoUploadProps) => {
  const handleButtonClick = () => {
    const input = document.getElementById("video-upload") as HTMLInputElement
    input?.click()
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      {file ? (
        <div className="relative">
          <video src={URL.createObjectURL(file)} className="w-full h-32 object-cover rounded-lg" controls />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
            aria-label="Remove video"
          >
            <X size={16} />
          </button>
          <Badge className="absolute top-2 left-2 bg-green-500">Video</Badge>
        </div>
      ) : (
        <div>
          <Video className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900">Video yuklang</p>
            <p className="text-sm text-gray-500">Faqat 1 ta video fayl</p>
          </div>
          <Input type="file" accept="video/*" onChange={onFileChange} className="hidden" id="video-upload" />
          <Button type="button" variant="outline" className="mt-2 bg-transparent" onClick={handleButtonClick}>
            Video Tanlash
          </Button>
        </div>
      )}
    </div>
  )
}

interface MediaTabProps {
  bannerFile: File | null
  setBannerFile: (file: File | null) => void
  photoFiles: File[]
  setPhotoFiles: React.Dispatch<React.SetStateAction<File[]>>
  videoFile: File | null
  setVideoFile: (file: File | null) => void
}

export default function MediaTab({
  bannerFile,
  setBannerFile,
  photoFiles,
  setPhotoFiles,
  videoFile,
  setVideoFile,
}: MediaTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Media Fayllar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3 text-sm text-gray-700">Banner Rasm</h4>
          <BannerUpload
            file={bannerFile}
            onFileChange={(e) => {
              const file = e.target.files?.[0]
              if (file) setBannerFile(file)
            }}
            onRemove={() => setBannerFile(null)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-3 text-sm text-gray-700">Rasmlar (maksimum 5 ta)</h4>
            <PhotosUpload
              files={photoFiles}
              onFilesChange={(e) => {
                const newFiles = Array.from(e.target.files || [])
                setPhotoFiles((prev) => [...prev, ...newFiles].slice(0, 5))
              }}
              onRemove={(index) => setPhotoFiles((prev) => prev.filter((_, i) => i !== index))}
            />
          </div>
          <div>
            <h4 className="font-medium mb-3 text-sm text-gray-700">Video</h4>
            <VideoUpload
              file={videoFile}
              onFileChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setVideoFile(file)
              }}
              onRemove={() => setVideoFile(null)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
