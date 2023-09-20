//AUTH
export async function signUp(
  supabaseClient: any,
  email: string,
  password: string,
) {
  return await supabaseClient.auth.signUp({ email, password });
}

export async function signInWithPassword(
  supabaseClient: any,
  email: string,
  password: string,
) {
  return await supabaseClient.auth.signInWithPassword({ email, password });
}

export async function getUser(
  supabaseClient: any,
  supaCreds: string,
): Promise<{ error: any; data: { user: any } }> {
  return await supabaseClient.auth.getUser(supaCreds);
}
