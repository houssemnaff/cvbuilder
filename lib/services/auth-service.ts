import { createClient } from "@/lib/supabase/client"

export interface AuthUser {
  id: string
  email: string
  name?: string
}

function toAuthUser(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }): AuthUser {
  return {
    id: user.id,
    email: user.email ?? "",
    name: (user.user_metadata?.name as string) ?? undefined,
  }
}

export const authService = {
  async signUp(name: string, email: string, password: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw error
    return data.user ? toAuthUser(data.user) : null
  },

  async signIn(email: string, password: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return toAuthUser(data.user)
  },

  async signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user ? toAuthUser(user) : null
  },
}
