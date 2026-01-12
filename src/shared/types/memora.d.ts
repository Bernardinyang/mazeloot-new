export interface MemoraCollection {
  id: string
  uuid: string
  name: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface MemoraProofing {
  id: string
  uuid: string
  name: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface MemoraSelection {
  id: string
  uuid: string
  name: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface MemoraRawFiles {
  id: string
  uuid: string
  name: string
  description?: string
  status: string
  created_at: string
  updated_at: string
  downloadPinEnabled?: boolean
  downloadPin?: string
}

export interface MemoraMedia {
  id: string
  uuid: string
  media_set_uuid: string
  user_file_uuid: string
  order: number
  is_selected: boolean
  is_completed: boolean
  is_rejected: boolean
  is_revised: boolean
  is_private: boolean
}

export interface MemoraMediaSet {
  id: string
  uuid: string
  proof_uuid?: string
  collection_uuid?: string
  selection_uuid?: string
  raw_files_uuid?: string
  name: string
  order: number
}
