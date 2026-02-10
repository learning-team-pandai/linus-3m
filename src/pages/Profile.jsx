function Profile() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Profile</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Progress dashboard will live here in Phase 6.
        </p>
        <button
          type="button"
          onClick={() => {
            window.location.hash = '#/'
          }}
          className="mt-4 rounded-full p-2 text-emerald-500 dark:text-emerald-300"
          aria-label="Back"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Profile
