export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            admin_profiles: {
                Row: {
                    id: string
                    email: string
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    created_at?: string
                }
            }
            metric_types: {
                Row: {
                    id: string
                    name: string
                    points: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    points: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    points?: number
                    created_at?: string
                }
            }
            submissions: {
                Row: {
                    id: string
                    first_name: string
                    last_name: string
                    email: string
                    department: string
                    position: string
                    metric_type_id: string
                    awarded_points: number
                    proof_path: string
                    proof_url: string
                    proof_type: string
                    status: 'pending' | 'accepted' | 'rejected'
                    reviewed_by: string | null
                    reviewed_at: string | null
                    admin_note: string | null
                    sheet_sync_status: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    first_name: string
                    last_name: string
                    email: string
                    department: string
                    position: string
                    metric_type_id: string
                    awarded_points: number
                    proof_path: string
                    proof_url: string
                    proof_type: string
                    status?: 'pending' | 'accepted' | 'rejected'
                    reviewed_by?: string | null
                    reviewed_at?: string | null
                    admin_note?: string | null
                    sheet_sync_status?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    first_name?: string
                    last_name?: string
                    email?: string
                    department?: string
                    position?: string
                    metric_type_id?: string
                    awarded_points?: number
                    proof_path?: string
                    proof_url?: string
                    proof_type?: string
                    status?: 'pending' | 'accepted' | 'rejected'
                    reviewed_by?: string | null
                    reviewed_at?: string | null
                    admin_note?: string | null
                    sheet_sync_status?: boolean
                    created_at?: string
                }
            }
        }
        Views: {
            leaderboard: {
                Row: {
                    email: string
                    first_name: string
                    last_name: string
                    department: string
                    position: string
                    total_accepted_points: number
                }
            }
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            submission_status: 'pending' | 'accepted' | 'rejected'
        }
    }
}
