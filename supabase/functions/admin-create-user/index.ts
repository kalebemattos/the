import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    // Admin client (service role — pode criar/deletar auth users)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    // Verificar que o chamador está autenticado e é admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Não autorizado');

    const callerClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) throw new Error('Não autorizado');

    const { data: callerMeta } = await supabaseAdmin
      .from('users_meta')
      .select('role')
      .eq('auth_id', caller.id)
      .single();

    if (callerMeta?.role !== 'admin') {
      throw new Error('Acesso negado — apenas administradores podem criar usuários');
    }

    const { action, email, password, name, role, user_id } = await req.json();

    // ── CREATE ─────────────────────────────────────────────────────────────────
    if (action === 'create') {
      if (!email || !password || !name) {
        throw new Error('email, password e name são obrigatórios');
      }

      const validRoles = ['admin', 'operator', 'staff'];
      const finalRole = validRoles.includes(role) ? role : 'operator';

      // Cria auth user (email já confirmado — sem necessidade de verificação)
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (createError) throw new Error(createError.message);

      // Cria entry em users_meta
      const { error: metaError } = await supabaseAdmin.from('users_meta').insert({
        auth_id: newUser.user.id,
        email,
        name,
        role: finalRole,
      });
      if (metaError) {
        // Reverter: deletar auth user se users_meta falhou
        await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
        throw new Error('Erro ao salvar dados do usuário: ' + metaError.message);
      }

      return new Response(
        JSON.stringify({ success: true, user_id: newUser.user.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ── DELETE ─────────────────────────────────────────────────────────────────
    if (action === 'delete') {
      if (!user_id) throw new Error('user_id é obrigatório');
      if (user_id === caller.id) throw new Error('Você não pode excluir sua própria conta');

      // Deleta da auth (cascade remove sessions)
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(user_id);
      if (authDeleteError) throw new Error(authDeleteError.message);

      // Deleta de users_meta (pode já ter sido removido via cascade)
      await supabaseAdmin.from('users_meta').delete().eq('auth_id', user_id);

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    throw new Error('action inválida. Use "create" ou "delete"');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('admin-create-user error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
