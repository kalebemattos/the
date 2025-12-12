import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, role } = req.body;

  if (!userId || !role) return res.status(400).json({ error: 'userId e role são obrigatórios' });

  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ data });
}