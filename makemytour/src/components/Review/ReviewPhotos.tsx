"use client";

import { useEffect, useState } from "react";

import {
  uploadReviewPhoto,
  getReviewPhotos,
  deleteReviewPhoto,
} from "@/api/Reviewapi";

interface ReviewPhoto {
  id: number;
  reviewId: number;
  userId: number;
  imageUrl: string;
  createdAt: string;
}

interface ReviewPhotosProps {
  reviewId: number;
  currentUserId?: number;
}

const ReviewPhotos = ({ reviewId, currentUserId }: ReviewPhotosProps) => {
  const [photos, setPhotos] = useState<ReviewPhoto[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadPhotos = async () => {
    try {
      const response = await getReviewPhotos(reviewId);
      setPhotos(response.data);
    } catch (error) {
      console.error("Failed to load photos:", error);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, [reviewId]);

  // Select File
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5 MB.");
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  // Upload Photo
  const handleUpload = async () => {
    if (!currentUserId) {
      setMessage("Please login to upload photos.");
      return;
    }

    if (!file) {
      setMessage("Please select an image.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      await uploadReviewPhoto(reviewId, currentUserId, file);
      setFile(null);
      setMessage("Photo uploaded successfully.");
      await loadPhotos();
    } catch (error) {
      console.error("Photo upload failed:", error);
      setMessage("Failed to upload photo.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Photo
  const handleDelete = async (photoId: number) => {
    if (!currentUserId) return;

    try {
      await deleteReviewPhoto(photoId, currentUserId);
      await loadPhotos();
    } catch (error) {
      console.error("Failed to delete photo:", error);
    }
  };

  return (
    <div className="mt-4">
      {/* Upload */}
      {currentUserId && (
        <div className="rounded-lg border bg-gray-50 p-4">
          <h4 className="mb-3 font-semibold">Add Photos</h4>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={loading || !file}
            className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Photo"}
          </button>
          {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        </div>
      )}

      {/* Photos */}
      {photos.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-3 font-semibold">Traveler Photos</h4>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative overflow-hidden rounded-lg border"
              >
                <img
                  src={`http://localhost:8081${photo.imageUrl}`}
                  alt="Traveler review"
                  className="h-32 w-full object-cover"
                />

                {currentUserId === photo.userId && (
                  <button
                    type="button"
                    onClick={() => handleDelete(photo.id)}
                    className="absolute right-2 top-2 rounded bg-red-600 px-2 py-1 text-xs text-white"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPhotos;
