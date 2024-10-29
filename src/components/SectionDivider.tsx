export default function SectionDivider() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <svg className="w-full h-px" viewBox="0 0 1000 2" preserveAspectRatio="none">
        <path
          d="M0,1 Q250,0.5 500,1 T1000,1"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-gray-200"
        />
      </svg>
    </div>
  );
}
