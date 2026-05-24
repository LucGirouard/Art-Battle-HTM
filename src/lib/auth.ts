import { supabase } from "./supabase";

export async function registerUser(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { ok: false as const, error: error.message };
  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      username,
    });
  }
  return { ok: true as const };
}

export async function loginUser(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function logoutUser() {
  await supabase.auth.signOut();
}