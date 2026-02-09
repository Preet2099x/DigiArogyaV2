// FileTypeIcon.jsx
// Modern file type icon component using SVG (Heroicons style)

export default function FileTypeIcon({ type }) {
  switch (type) {
    case 'pdf':
      return (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <rect width="24" height="24" rx="6" fill="#F3E8E8" />
          <path d="M7 7h10v10H7V7z" fill="#E53935" />
          <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#fff">PDF</text>
        </svg>
      );
    case 'image':
      return (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <rect width="24" height="24" rx="6" fill="#E8F5E9" />
          <circle cx="8" cy="10" r="2" fill="#43A047" />
          <rect x="10" y="14" width="8" height="4" fill="#43A047" />
        </svg>
      );
    case 'doc':
      return (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <rect width="24" height="24" rx="6" fill="#E3F2FD" />
          <rect x="7" y="7" width="10" height="10" fill="#1E88E5" />
          <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#fff">DOC</text>
        </svg>
      );
    default:
      return (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <rect width="24" height="24" rx="6" fill="#F5F5F5" />
          <rect x="7" y="7" width="10" height="10" fill="#757575" />
        </svg>
      );
  }
}
