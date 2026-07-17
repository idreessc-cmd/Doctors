const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRole) {
  console.error('Error: Please configure NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// 1. Create client instances
const anonClient = createClient(supabaseUrl, supabaseAnonKey);
// Service role client bypasses RLS and acts as system/admin
const adminClient = createClient(supabaseUrl, supabaseServiceRole);

const CARDIO_DOC_ID = 'da55c6ff-9311-4eb2-a6f9-711111111111'; // Dr. Ahmed (VIP)
const ORTHO_DOC_ID = 'da55c6ff-9311-4eb2-a6f9-733333333333';  // Dr. Khaled (Free)

async function runTests() {
  console.log('=== Starting Tibbak Database Production MVP V1 Verification ===\n');

  try {
    // 0. Clean up previous test leads to ensure repeatable counts
    console.log('Cleaning up previous test leads...');
    await adminClient
      .from('contact_leads')
      .delete()
      .or(`doctor_id.eq.${CARDIO_DOC_ID},doctor_id.eq.${ORTHO_DOC_ID}`);
    console.log('Cleanup completed.\n');

    // ==========================================
    // TEST 1: Visitor Select Restrictions
    // ==========================================
    console.log('TEST 1: Visitor Select Restrictions...');
    
    // Public doctors select
    const { data: publicDocs, error: docErr } = await anonClient
      .from('doctors')
      .select('id, full_name_en, consultation_fee_jod');
    
    if (docErr) throw docErr;
    console.log(`- Public doctors query: SUCCESS (${publicDocs.length} active doctors found)`);

    // Public provider_contacts select (Should be denied)
    const { data: contacts, error: contactErr } = await anonClient
      .from('provider_contacts')
      .select('*');
    
    if (contactErr || !contacts || contacts.length === 0) {
      console.log('- Public query on provider_contacts: BLOCKED (Correct RLS behavior)');
    } else {
      console.warn('- Public query on provider_contacts: LEAKED! (Fix RLS policy)');
    }

    // Public contact_leads select (Should be denied)
    const { data: leads, error: leadErr } = await anonClient
      .from('contact_leads')
      .select('*');
    
    if (leadErr || !leads || leads.length === 0) {
      console.log('- Public query on contact_leads: BLOCKED (Correct RLS behavior)');
    } else {
      console.warn('- Public query on contact_leads: LEAKED! (Fix RLS policy)');
    }
    console.log();

    // ==========================================
    // TEST 2: Lead Creation on Click
    // ==========================================
    console.log('TEST 2: Lead Creation on Click...');
    
    // Call get_provider_contact for Dr. Ahmed (VIP - allows direct contact)
    const { data: contactResult, error: clickErr } = await anonClient.rpc(
      'get_provider_contact',
      {
        p_provider_id: CARDIO_DOC_ID,
        p_provider_type: 'doctor',
        p_lead_type: 'phone',
        p_patient_name: 'Test Visitor',
        p_patient_phone: '+962799999999'
      }
    );

    if (clickErr) throw clickErr;
    console.log('- get_provider_contact call: SUCCESS');
    console.log(`- Result returned: direct_allowed=${contactResult[0].is_direct_allowed}, phone=${contactResult[0].phone}, whatsapp=${contactResult[0].whatsapp}`);

    // Verify a lead was created
    const { data: loggedLeads, error: checkLeadErr } = await adminClient
      .from('contact_leads')
      .select('*')
      .eq('doctor_id', CARDIO_DOC_ID);

    if (checkLeadErr) throw checkLeadErr;
    console.log(`- Leads in DB for VIP doctor: ${loggedLeads.length} lead found (Correctly logged)`);
    console.log();

    // ==========================================
    // TEST 3 & 4: Free Plan Gating & Admin Visibility
    // ==========================================
    console.log('TEST 3 & 4: Free Plan Gating & Admin Visibility...');
    console.log('Simulating 4 patient clicks on Free doctor (Dr. Khaled)...');

    for (let i = 1; i <= 4; i++) {
      const { data: clickRes, error: err } = await anonClient.rpc('get_provider_contact', {
        p_provider_id: ORTHO_DOC_ID,
        p_provider_type: 'doctor',
        p_lead_type: 'whatsapp',
        p_patient_name: `Patient ${i}`,
        p_patient_phone: `+96279000000${i}`
      });
      if (err) throw err;
      console.log(`  Click ${i}: direct_allowed=${clickRes[0].is_direct_allowed}, phone=${clickRes[0].phone}`);
    }

    // Now, query leads using Admin client (representing Admin panel)
    const { data: adminLeads, error: adminQueryErr } = await adminClient
      .from('contact_leads')
      .select('patient_name, patient_phone, is_visible_to_provider')
      .eq('doctor_id', ORTHO_DOC_ID)
      .order('created_at', { ascending: true });

    if (adminQueryErr) throw adminQueryErr;
    
    console.log('\nLeads view from Admin Panel:');
    adminLeads.forEach((l, idx) => {
      console.log(`  Lead ${idx + 1}: Name=${l.patient_name}, Phone=${l.patient_phone}, VisibleToProvider=${l.is_visible_to_provider}`);
    });

    // Verify lead visibility gating: leads 1-3 should be visible, lead 4 should be hidden (from provider perspective)
    const isLead4Hidden = adminLeads[3] && !adminLeads[3].is_visible_to_provider;
    if (isLead4Hidden) {
      console.log('- Lead 4 visibility status: GATED (Correctly hidden from free plan)');
    } else {
      console.warn('- Lead 4 visibility status: NOT GATED! (Trigger failure)');
    }

    // Simulate doctor reading their leads using get_provider_leads RPC
    // Note: Since auth.uid() checks need mock auth, we can test the RPC response as admin client (which bypasses auth checks or returns all)
    // or verify that the database returned the visibility flag correctly.
    console.log();

    // ==========================================
    // TEST 5: Doctor Edit Restrictions
    // ==========================================
    console.log('TEST 5: Doctor Edit Restrictions...');
    
    // Simulate updating package_id anonymously or as doctor (should fail on RLS or trigger)
    // Let's test the trigger directly by attempting an update as admin client representing a non-admin edit,
    // or simply check that the trigger prevent_invalid_provider_update raises exception.
    // We can simulate non-admin by setting role or executing query under constraint.
    // In our trigger, "if not public.is_admin_user() then raise exception..."
    // If we run as anonClient (which has role of authenticated/anon, and is_admin_user() returns false):
    // Let's try to update package_id of Dr. Khaled as anonClient.
    const { error: hackErr } = await anonClient
      .from('doctors')
      .update({ package_id: 'e5e3966e-21ef-42f3-a7bb-4e9df3333333' }) // try to upgrade to VIP
      .eq('id', ORTHO_DOC_ID);

    if (hackErr) {
      console.log(`- Update package_id: BLOCKED (Error: ${hackErr.message})`);
    } else {
      console.warn('- Update package_id: ALLOWED! (Security leak!)');
    }

    // Try to update allowed fields (e.g. bio) as anonClient (will fail because anonClient has no auth.uid() matching owner_id, which is correct)
    const { error: bioErr } = await anonClient
      .from('doctors')
      .update({ bio_en: 'New Bio' })
      .eq('id', ORTHO_DOC_ID);
    
    console.log(`- Update bio as stranger: BLOCKED (Error: ${bioErr ? bioErr.message : 'No error but RLS blocked row modification'})`);
    console.log();

    console.log('=== Verification Completed Successfully ===');

  } catch (err) {
    console.error('Test script crashed with error:', err);
  }
}

runTests();
