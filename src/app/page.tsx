import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }
  return (
    <>
      <div className="font-sans items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 max-w-7xl mx-auto">
        <p>todo: show all photos randomly as featured</p>
      </div>
    </>
  );
}
