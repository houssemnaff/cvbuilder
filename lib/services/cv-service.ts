import { createClient } from "@/lib/supabase/client"

export interface Cv {
  id: string
  name: string
  templateId: string
  createdAt: string
  updatedAt: string
}

interface CvRow {
  id: string
  name: string
  template_id: string
  created_at: string
  updated_at: string
}

function toCv(row: CvRow): Cv {
  return {
    id: row.id,
    name: row.name,
    templateId: row.template_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

async function requireUserId() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  return { supabase, userId: user.id }
}

export const cvService = {
  async listCvs(): Promise<Cv[]> {
    const { supabase, userId } = await requireUserId()
    const { data, error } = await supabase
      .from("cvs")
      .select("id, name, template_id, created_at, updated_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    if (error) throw error
    return (data as CvRow[]).map(toCv)
  },

  async getCv(id: string): Promise<Cv | null> {
    const { supabase, userId } = await requireUserId()
    const { data, error } = await supabase
      .from("cvs")
      .select("id, name, template_id, created_at, updated_at")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle()
    if (error) throw error
    return data ? toCv(data as CvRow) : null
  },

  async createCv(name: string, templateId: string): Promise<Cv> {
    const { supabase, userId } = await requireUserId()
    const { data, error } = await supabase
      .from("cvs")
      .insert({ user_id: userId, name, template_id: templateId })
      .select("id, name, template_id, created_at, updated_at")
      .single()
    if (error) throw error
    return toCv(data as CvRow)
  },

  async renameCv(id: string, name: string) {
    const { supabase, userId } = await requireUserId()
    const { error } = await supabase.from("cvs").update({ name }).eq("id", id).eq("user_id", userId)
    if (error) throw error
  },

  async duplicateCv(id: string): Promise<Cv> {
    const { supabase, userId } = await requireUserId()
    const { data: original, error: fetchError } = await supabase
      .from("cvs")
      .select("name, template_id, content")
      .eq("id", id)
      .eq("user_id", userId)
      .single()
    if (fetchError) throw fetchError

    const { data, error } = await supabase
      .from("cvs")
      .insert({
        user_id: userId,
        name: `${original.name} (Copie)`,
        template_id: original.template_id,
        content: original.content,
      })
      .select("id, name, template_id, created_at, updated_at")
      .single()
    if (error) throw error
    return toCv(data as CvRow)
  },

  async deleteCv(id: string) {
    const { supabase, userId } = await requireUserId()
    const { error } = await supabase.from("cvs").delete().eq("id", id).eq("user_id", userId)
    if (error) throw error
  },
}
