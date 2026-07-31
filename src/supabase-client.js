const SUPABASE_URL = 'https://wqrmwhiyzcvioqobsqem.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_NTGn-7e-LRlPHHmVtXKNuw_Dc1NVHCS';

export const allowedEmail = 'mariahernandezvega@gmail.com';
export const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
}) || null;

export async function getInitialSession() {
  if (!supabase) return { session: null, error: new Error('No se cargó el cliente de Supabase.') };
  const { data, error } = await supabase.auth.getSession();
  return { session: data?.session || null, error };
}

export function onAuthStateChange(callback) {
  if (!supabase) return { data: { subscription: { unsubscribe() {} } } };
  return supabase.auth.onAuthStateChange(callback);
}

export async function sendMagicLink(email) {
  if (!supabase) throw new Error('No se cargó el cliente de Supabase.');
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin }
  });
  if (error) throw error;
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
}

export async function loadCloudProgress(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('m3_progress')
    .select('progress')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data?.progress || null;
}

export async function saveCloudProgress(userId, progress) {
  if (!supabase) return;
  const { error } = await supabase.from('m3_progress').upsert({
    user_id: userId,
    progress,
    updated_at: new Date().toISOString()
  });
  if (error) throw error;
}
