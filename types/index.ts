export type Branch = {
    id: string
    name: string
    code: string
    label_color: string | null
    address: string | null
    phone: string | null
    working_hours: string | null
    google_maps_url: string | null
    google_review_url: string | null
    whatsapp_number: string | null
    instagram_url: string | null
    website_url: string | null
    feedback_form_url: string | null
    logo_url: string | null
    is_active: boolean
    sort_order: number
    created_at: string
    updated_at: string
}

export type Table = {
    id: string
    branch_id: string
    table_number: number
    label: string | null
    is_active: boolean
}

export type Scan = {
    id: string
    scanned_at: string
    branch_id: string
    table_id: string | null
    device: string | null
    os: string | null
    browser: string | null
    ua: string | null
}

export type LinkClick = {
    id: string
    clicked_at: string
    scan_id: string | null
    branch_id: string
    table_id: string | null
    link_type: 'whatsapp' | 'google_review' | 'instagram' | 'website' | 'feedback'
}

export type Feedback = {
    id: string
    created_at: string
    branch_id: string
    table_id: string | null
    scan_id: string | null
    name: string | null
    phone: string | null
    rating: number | null
    message: string
    is_read: boolean
}
