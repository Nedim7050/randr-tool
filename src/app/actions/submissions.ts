'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { appendToSheet, resyncEntireSheet } from '@/lib/google-sheets'
import { revalidatePath } from 'next/cache'

export async function acceptSubmission(id: string, note?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // 1. Get full submission data and metric name to sync to sheets
    const { data: submission, error: fetchError } = await supabase
        .from('submissions')
        .select(`
      *,
      metric_types ( name )
    `)
        .eq('id', id)
        .single()

    if (fetchError || !submission) {
        return { error: 'Submission not found' }
    }

    // 2. Update status in Database
    const { error: updateError } = await supabase
        .from('submissions')
        .update({
            status: 'accepted',
            reviewed_by: user.id,
            reviewed_at: new Date().toISOString(),
            admin_note: note || submission.admin_note
        } as any)
        .eq('id', id)

    if (updateError) {
        return { error: 'Failed to accept submission' }
    }

    // 3. Sync to Google Sheets
    // @ts-ignore
    const metricName = submission.metric_types?.name || 'Unknown'
    const imagePreview = submission.proof_type === 'image'
        ? `=IMAGE("${submission.proof_url}")`
        : 'Video'

    const row = [
        submission.id,
        submission.created_at,
        submission.first_name,
        submission.last_name,
        submission.email,
        submission.department,
        submission.position,
        metricName,
        submission.awarded_points,
        submission.proof_type,
        submission.proof_url,
        imagePreview,
        'accepted',
        new Date().toISOString(),
        note || submission.admin_note || ''
    ]

    const syncResult = await appendToSheet(row)

    if (syncResult.success) {
        await supabase.from('submissions').update({ sheet_sync_status: true } as any).eq('id', id)
    }

    revalidatePath('/admin/submissions')
    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/history')
    revalidatePath('/leaderboard')

    return { success: true, sheetSynced: syncResult.success }
}

export async function rejectSubmission(id: string, note?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('submissions')
        .update({
            status: 'rejected',
            reviewed_by: user.id,
            reviewed_at: new Date().toISOString(),
            admin_note: note
        } as any)
        .eq('id', id)

    if (error) {
        return { error: 'Failed to reject submission' }
    }

    revalidatePath('/admin/submissions')
    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/history')

    return { success: true }
}

export async function deleteSubmission(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Bypass RLS for deletion since the table has no DELETE policy 
    const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabaseAdmin
        .from('submissions')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: 'Failed to delete submission' }
    }

    revalidatePath('/admin/submissions')
    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/history')
    revalidatePath('/leaderboard')

    return { success: true }
}

export async function deleteMember(email: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Using ilike or just lower(email) matches
    const { error } = await supabaseAdmin
        .from('submissions')
        .delete()
        .ilike('email', email)

    if (error) {
        return { error: 'Failed to delete member' }
    }

    revalidatePath('/admin/submissions')
    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/history')
    revalidatePath('/leaderboard')

    return { success: true }
}

export async function actionResyncSheet() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { data: submissions, error } = await supabase
        .from('submissions')
        .select('*, metric_types(name)')
        .eq('status', 'accepted')
        .order('created_at', { ascending: true })

    if (error) return { error: 'Failed to fetch accepted submissions' }

    const rows = submissions.map(sub => {
        // @ts-ignore
        const metricName = sub.metric_types?.name || 'Unknown'
        const imagePreview = sub.proof_type === 'image' ? `=IMAGE("${sub.proof_url}")` : 'Video'
        return [
            sub.id,
            sub.created_at,
            sub.first_name,
            sub.last_name,
            sub.email,
            sub.department,
            sub.position,
            metricName,
            sub.awarded_points,
            sub.proof_type,
            sub.proof_url,
            imagePreview,
            'accepted',
            sub.reviewed_at || '',
            sub.admin_note || ''
        ]
    })

    const resyncResult = await resyncEntireSheet(rows)
    if (resyncResult.success) {
        // Update all sync statuses
        await supabase.from('submissions').update({ sheet_sync_status: true } as any).eq('status', 'accepted')
        revalidatePath('/admin/dashboard')
        return { success: true }
    } else {
        return { error: resyncResult.error }
    }
}
