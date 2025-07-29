import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          client_name: string
          client_link: string | null
          description: string | null
          status: string
          created_date: string
          completes: number
          terminates: number
          quota_full: number
          total_quota: number
          quotas: any
          vendors: string[]
          estimated_duration: number
          incentive: string
          updated_at: string
        }
        Insert: {
          name: string
          client_name: string
          client_link?: string
          description?: string
          status?: string
          total_quota?: number
          quotas?: any
          vendors?: string[]
          estimated_duration?: number
          incentive?: string
        }
        Update: {
          name?: string
          client_name?: string
          client_link?: string
          description?: string
          status?: string
          completes?: number
          terminates?: number
          quota_full?: number
          total_quota?: number
          quotas?: any
          vendors?: string[]
          estimated_duration?: number
          incentive?: string
        }
      }
      vendors: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          status: string
          created_date: string
          completion_rate: number
          terminate_rate: number
          fraud_score: number
          total_sent: number
          total_completes: number
          redirect_urls: any
          redirect_settings: any
          updated_at: string
        }
        Insert: {
          name: string
          email: string
          phone?: string
          company?: string
          status?: string
          completion_rate?: number
          terminate_rate?: number
          fraud_score?: number
          total_sent?: number
          total_completes?: number
          redirect_urls?: any
          redirect_settings?: any
        }
        Update: {
          name?: string
          email?: string
          phone?: string
          company?: string
          status?: string
          completion_rate?: number
          terminate_rate?: number
          fraud_score?: number
          total_sent?: number
          total_completes?: number
          redirect_urls?: any
          redirect_settings?: any
        }
      }
      responses: {
        Row: {
          id: string
          project_id: string | null
          vendor_id: string | null
          vendor_uid: string | null
          status: string
          ip_address: string | null
          country: string | null
          city: string | null
          browser: string | null
          device: string | null
          completion_time: number | null
          fraud_indicators: any
          timestamp: string
          updated_at: string
        }
        Insert: {
          project_id?: string
          vendor_id?: string
          vendor_uid?: string
          status: string
          ip_address?: string
          country?: string
          city?: string
          browser?: string
          device?: string
          completion_time?: number
          fraud_indicators?: any
        }
        Update: {
          project_id?: string
          vendor_id?: string
          vendor_uid?: string
          status?: string
          ip_address?: string
          country?: string
          city?: string
          browser?: string
          device?: string
          completion_time?: number
          fraud_indicators?: any
        }
      }
      fraud_alerts: {
        Row: {
          id: string
          type: string
          severity: string
          vendor_id: string | null
          vendor_name: string | null
          project_id: string | null
          details: string | null
          affected_responses: string[]
          status: string
          investigated_by: string | null
          resolution: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          type: string
          severity: string
          vendor_id?: string
          vendor_name?: string
          project_id?: string
          details?: string
          affected_responses?: string[]
          status?: string
          investigated_by?: string
          resolution?: string
        }
        Update: {
          type?: string
          severity?: string
          vendor_id?: string
          vendor_name?: string
          project_id?: string
          details?: string
          affected_responses?: string[]
          status?: string
          investigated_by?: string
          resolution?: string
        }
      }
      panel_settings: {
        Row: {
          id: string
          panel_name: string
          panel_url: string
          admin_email: string | null
          timezone: string
          session_timeout: number
          email_notifications: boolean
          fraud_alerts: boolean
          quota_alerts: boolean
          response_retention: number
          auto_backup: boolean
          backup_frequency: string
          updated_at: string
        }
        Insert: {
          panel_name?: string
          panel_url?: string
          admin_email?: string
          timezone?: string
          session_timeout?: number
          email_notifications?: boolean
          fraud_alerts?: boolean
          quota_alerts?: boolean
          response_retention?: number
          auto_backup?: boolean
          backup_frequency?: string
        }
        Update: {
          panel_name?: string
          panel_url?: string
          admin_email?: string
          timezone?: string
          session_timeout?: number
          email_notifications?: boolean
          fraud_alerts?: boolean
          quota_alerts?: boolean
          response_retention?: number
          auto_backup?: boolean
          backup_frequency?: string
        }
      }
    }
  }
}
