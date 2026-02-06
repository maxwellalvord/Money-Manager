import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    
    <div className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
        <SignIn />
      </div>
    </div>
    
  );
}
