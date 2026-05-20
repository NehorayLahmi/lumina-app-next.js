import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="text-center px-6">
        <p className="text-6xl font-bold text-indigo-600 mb-4">404</p>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          העמוד לא נמצא
        </h1>
        <p className="text-gray-500 mb-8">
          עמוד הנחיתה שחיפשת אינו קיים במערכת.
        </p>
        <Link
          href="/"
          className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
}
