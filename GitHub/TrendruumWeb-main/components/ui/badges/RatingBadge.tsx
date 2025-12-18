const RatingBadge = ({ rating }: { rating: string }) => {
  return (
    <span className="bg-[#00C853] text-white text-xs px-2 py-0.5 rounded">
      {rating}
    </span>
  );
};

export default RatingBadge; 