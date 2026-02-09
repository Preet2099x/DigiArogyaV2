// FileTypeIcon.jsx
// Simple, clean SVG icons for file types

export default function FileTypeIcon({ type }) {
  if (type === 'pdf') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500 bg-red-50 p-1.5 rounded-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }

  if (type === 'image') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-500 bg-emerald-50 p-1.5 rounded-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  }

  // Default doc
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-500 bg-gray-50 p-1.5 rounded-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 2H7a2 2 0 00-2 2v15a2 2 0 002 2z" />
    </svg>
  );
}
