export default function AdminPage() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <p className="text-lg">ברוך הבא ללוח הניהול.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="p-4 shadow rounded-2xl border">
          <h2 className="text-xl font-semibold mb-2">ניהול משתמשים</h2>
          <p className="mb-3">צפייה, מחיקה ועדכון משתמשים.</p>
          <button className="px-4 py-2 rounded-xl shadow bg-gray-100 hover:bg-gray-200">
            כניסה
          </button>
        </div>

        <div className="p-4 shadow rounded-2xl border">
          <h2 className="text-xl font-semibold mb-2">ניהול פוסטים</h2>
          <p className="mb-3">עריכת פוסטים, מחיקתם או יצירת חדשים.</p>
          <button className="px-4 py-2 rounded-xl shadow bg-gray-100 hover:bg-gray-200">
            כניסה
          </button>
        </div>

        <div className="p-4 shadow rounded-2xl border">
          <h2 className="text-xl font-semibold mb-2">לוגים וסטטיסטיקות</h2>
          <p className="mb-3">צפייה בלוגים של מערכת ובפעילות משתמשים.</p>
          <button className="px-4 py-2 rounded-xl shadow bg-gray-100 hover:bg-gray-200">
            כניסה
          </button>
        </div>
      </div>
    </div>
  );
}
