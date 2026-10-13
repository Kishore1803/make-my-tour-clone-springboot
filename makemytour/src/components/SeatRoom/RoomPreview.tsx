interface RoomPreviewProps {
  imageUrl?: string;
  previewUrl?: string;
  roomType: string;
}

const RoomPreview = ({ imageUrl, previewUrl, roomType }: RoomPreviewProps) => {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="relative aspect-video bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${roomType} room`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No preview available
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800">{roomType} Preview</h3>
        {previewUrl && (
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            Open 3D / Virtual Preview
          </a>
        )}
      </div>
    </div>
  );
};

export default RoomPreview;
