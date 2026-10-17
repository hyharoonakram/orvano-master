import { verifyPin } from './actions'

export default async function AdminVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Verification</h1>
        <p className="text-muted-foreground mt-2">Please enter your secondary Admin PIN to proceed.</p>
      </div>

      <form className="flex-1 flex flex-col w-full justify-center gap-4 text-foreground" action={verifyPin}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="pin">
            Admin PIN
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border focus:outline-none focus:ring-2 focus:ring-primary text-center tracking-[0.5em] text-lg font-bold"
            type="password"
            name="pin"
            placeholder="••••••"
            maxLength={10}
            required
            autoFocus
          />
        </div>

        <button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-md px-4 py-2 transition-colors mt-4">
          Verify Access
        </button>

        {resolvedSearchParams?.error && (
          <p className="mt-4 p-4 bg-red-100 text-red-700 text-center rounded-md font-medium text-sm">
            {resolvedSearchParams.error}
          </p>
        )}
      </form>
    </div>
  )
}
