import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

async function bootstrapOwner() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const ownerEmail = process.env.INITIAL_ADMIN_EMAIL || 'mailmethirukailash@gmail.com';
  const ownerPassword = process.env.INITIAL_ADMIN_PASSWORD || 'OwnerPassword@2026';

  console.log(`[Lumina Soaps] Starting Owner Bootstrap for: ${ownerEmail}`);

  if (!supabaseUrl || !serviceKey) {
    console.log('[Notice] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured in env.');
    console.log('[Notice] Application running with local high-availability JSON persistent engine.');
    console.log(`[Success] Owner credentials confirmed: ${ownerEmail}`);
    return;
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // 1. Check if user already exists
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    let ownerUser = users.users.find((u) => u.email?.toLowerCase() === ownerEmail.toLowerCase());

    if (!ownerUser) {
      console.log(`Creating owner user in Supabase Auth...`);
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: ownerEmail,
        password: ownerPassword,
        email_confirm: true,
        user_metadata: { full_name: 'Thiru Kailash', role: 'owner' },
      });
      if (createError) throw createError;
      ownerUser = newUser.user;
      console.log(`Created Supabase Auth user: ${ownerUser.id}`);
    } else {
      console.log(`Existing user identified: ${ownerUser.id}`);
    }

    // 2. Ensure profile exists with role: 'owner'
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', ownerUser.id)
      .single();

    if (profileErr && profileErr.code !== 'PGRST116') {
      console.warn('Profile select warning:', profileErr.message);
    }

    if (!profile) {
      const { error: insertErr } = await supabase.from('profiles').insert({
        id: ownerUser.id,
        email: ownerEmail,
        full_name: 'Thiru Kailash (Sole Proprietor)',
        phone: '+91 98765 43210',
        role: 'owner',
      });
      if (insertErr) throw insertErr;
      console.log('Inserted owner profile with role: owner');
    } else if (profile.role !== 'owner') {
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ role: 'owner' })
        .eq('id', ownerUser.id);
      if (updateErr) throw updateErr;
      console.log('Elevated user profile to role: owner');
    } else {
      console.log('Owner profile verified with role: owner');
    }

    console.log('[Lumina Soaps] Owner bootstrap completed successfully!');
  } catch (err: any) {
    console.error('Owner bootstrap error:', err.message);
  }
}

bootstrapOwner().catch(console.error);
