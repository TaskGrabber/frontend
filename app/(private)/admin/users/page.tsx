import { UserTable } from "@/components/custom/admin/user-table"
import { createAdminClient } from "@/utils/supabase/server"
import { Suspense } from "react"

function Fallback() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  )
}

export default async function Users() {
  const supabase = createAdminClient()
  const { data } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 10
  })

  return (
    <Suspense fallback={<Fallback />}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] px-4 py-2 flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <UserTable users={data?.users} />
        </div>
      </div>
    </Suspense>
  )
}