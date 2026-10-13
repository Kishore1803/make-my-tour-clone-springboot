"use client";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
}: StarRatingProps) => {
  const sizeClass = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const handleRatingChange = (value: number) => {
    if (readonly) return;

    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div
      className="flex items-center gap-1"
      role="radiogroup"
      aria-label="Rating"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isSelected = star <= rating;

        return (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(star)}
            disabled={readonly}
            className={`
              ${sizeClass[size]}
              transition-transform
              duration-150
              ${isSelected ? "text-yellow-400" : "text-gray-300"}
              ${!readonly ? "hover:scale-110 cursor-pointer" : "cursor-default"}
            `}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            aria-pressed={isSelected}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
