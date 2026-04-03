function VotesButtonSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-8 w-24 rounded-lg bg-white/10 animate-pulse" />
      <div className="h-8 w-28 rounded-lg bg-white/10 animate-pulse" />
    </div>
  );
}

export default VotesButtonSkeleton;
