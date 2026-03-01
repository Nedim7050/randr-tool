import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const formData = await req.formData()

        // 1. Extract form fields
        const firstName = formData.get('firstName') as string
        const lastName = formData.get('lastName') as string
        const email = formData.get('email') as string
        const department = formData.get('department') as string
        const position = formData.get('position') as string
        const metricTypeId = formData.get('metricTypeId') as string
        const file = formData.get('proofFile') as File

        if (!file || file.size === 0) {
            return NextResponse.json({ error: 'Proof file is required' }, { status: 400 })
        }

        const supabase = await createClient()

        // 2. Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${email}/${fileName}`

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('proofs')
            .upload(filePath, file)

        if (uploadError) {
            console.error('Upload Error:', uploadError)
            return NextResponse.json({ error: `Failed to upload proof file: ${uploadError.message}` }, { status: 500 })
        }

        // 3. Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('proofs')
            .getPublicUrl(filePath)

        // 4. Get points for the selected metric
        const { data: metricData, error: metricError } = await supabase
            .from('metric_types')
            .select('points')
            .eq('id', metricTypeId)
            .single()

        if (metricError || !metricData) {
            return NextResponse.json({ error: `Invalid metric type selected: ${metricError?.message}` }, { status: 400 })
        }

        // 5. Insert into submissions table
        const { error: insertError } = await supabase.from('submissions').insert({
            first_name: firstName,
            last_name: lastName,
            email: email,
            department: department,
            position: position,
            metric_type_id: metricTypeId,
            awarded_points: metricData.points,
            proof_path: filePath,
            proof_url: publicUrlData.publicUrl,
            proof_type: file.type.startsWith('video') ? 'video' : 'image',
            status: 'pending',
        } as any)

        if (insertError) {
            console.error('Insert Error:', insertError)
            return NextResponse.json({ error: `Failed to insert submission: ${insertError.message}` }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('API Error:', err)
        return NextResponse.json({ error: `Server crash: ${err?.message || 'Unknown error'}` }, { status: 500 })
    }
}
