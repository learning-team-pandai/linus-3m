function Profile() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-2 text-sm text-slate-600">
          Progress dashboard will live here in Phase 6.
        </p>
        <button
          type="button"
          onClick={() => {
            window.location.hash = '#/'
          }}
          className="mt-4 text-sm font-semibold text-blue-500"
        >
          Back to path
        </button>
      </div>
    </div>
  )
}

export default Profile
