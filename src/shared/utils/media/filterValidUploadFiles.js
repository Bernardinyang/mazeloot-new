export const VALID_UPLOAD_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
]

export const VALID_RAW_FILES_MIME_TYPES = [
  // Camera Raw Image Formats
  'image/x-canon-cr2', // Canon CR2
  'image/x-canon-crw', // Canon CRW
  'image/x-nikon-nef', // Nikon NEF
  'image/x-nikon-nrw', // Nikon NRW
  'image/x-sony-arw', // Sony ARW
  'image/x-sony-sr2', // Sony SR2
  'image/x-sony-srf', // Sony SRF
  'image/x-pentax-pef', // Pentax PEF
  'image/x-olympus-orf', // Olympus ORF
  'image/x-fuji-raf', // Fuji RAF
  'image/x-panasonic-rw2', // Panasonic RW2
  'image/x-panasonic-rwl', // Panasonic RWL
  'image/x-adobe-dng', // Adobe DNG
  'image/x-3fr', // Hasselblad 3FR
  'image/x-ari', // ARRIFLEX ARI
  'image/x-cap', // Phase One CAP
  'image/x-cin', // Kodak CIN
  'image/x-crw', // Canon CRW
  'image/x-dcr', // Kodak DCR
  'image/x-dcs', // Kodak DCS
  'image/x-drf', // Sigma DRF
  'image/x-eip', // Phase One EIP
  'image/x-erf', // Epson ERF
  'image/x-fff', // Imacon FFF
  'image/x-iiq', // Phase One IIQ
  'image/x-k25', // Kodak K25
  'image/x-kdc', // Kodak KDC
  'image/x-mef', // Mamiya MEF
  'image/x-mos', // Leaf MOS
  'image/x-mrw', // Minolta MRW
  'image/x-nef', // Nikon NEF
  'image/x-nrw', // Nikon NRW
  'image/x-orf', // Olympus ORF
  'image/x-pef', // Pentax PEF
  'image/x-ptx', // Pentax PTX
  'image/x-pxn', // Logitech PXN
  'image/x-r3d', // Red R3D
  'image/x-raf', // Fuji RAF
  'image/x-raw', // Generic RAW
  'image/x-rw2', // Panasonic RW2
  'image/x-rwl', // Panasonic RWL
  'image/x-rwz', // Rawzor RWZ
  'image/x-sr2', // Sony SR2
  'image/x-srf', // Sony SRF
  'image/x-srw', // Samsung SRW
  'image/x-x3f', // Sigma X3F
  // Standard Image Formats (from cameras)
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/tiff',
  'image/tif',
  'image/bmp',
  'image/x-bmp',
  'image/webp',
  'image/heic', // HEIC/HEIF (iPhone, modern cameras)
  'image/heif',
  'image/x-heic',
  'image/x-heif',
  // Video Formats (from cameras and recording devices)
  'video/mp4',
  'video/x-m4v', // M4V
  'video/quicktime', // MOV (common in cameras)
  'video/x-quicktime', // MOV alternative
  'video/avi', // AVI
  'video/x-msvideo', // AVI
  'video/x-ms-wmv', // WMV
  'video/x-matroska', // MKV
  'video/x-matroska-3d', // MKV 3D
  'video/mp2t', // MPEG-TS (MTS, M2TS from camcorders)
  'video/mpeg', // MPEG
  'video/mpeg-system', // MPEG System
  'video/x-mpeg', // MPEG
  'video/x-mpeg-system', // MPEG System
  'video/x-ms-asf', // ASF
  'video/x-flv', // FLV
  'video/3gpp', // 3GP (mobile devices)
  'video/3gpp2', // 3G2
  'video/x-3gpp', // 3GP
  'video/x-3gpp2', // 3G2
  'video/x-dv', // DV (Digital Video)
  'video/dv', // DV
  'video/x-h264', // H.264
  'video/h264', // H.264
  'video/x-h265', // H.265/HEVC
  'video/h265', // H.265/HEVC
  'video/hevc', // HEVC
  'video/x-ogm', // OGM
  'video/ogg', // OGG
  'video/webm', // WebM
  'video/x-theora', // Theora
  'video/x-vp8', // VP8
  'video/x-vp9', // VP9
  // Professional Camera Video Formats
  'video/x-mxf', // MXF (professional cameras)
  'video/mxf', // MXF
  'video/x-avchd', // AVCHD
  'video/avchd', // AVCHD
  'video/x-mts', // MTS (AVCHD)
  'video/x-m2ts', // M2TS (AVCHD)
  'video/x-m2t', // M2T
  'video/x-mod', // MOD (JVC, Panasonic)
  'video/x-tod', // TOD (JVC)
  'video/x-vob', // VOB (DVD)
  'video/x-ts', // TS (Transport Stream)
  'video/x-trp', // TRP (Transport Stream)
  'video/x-rm', // RealMedia
  'video/x-rmvb', // RealMedia Variable Bitrate
  'video/x-vivo', // VIVO
  // Audio Formats (from recording devices)
  'audio/mpeg', // MP3
  'audio/mp3', // MP3
  'audio/x-mpeg', // MP3
  'audio/x-mpeg-3', // MP3
  'audio/mp4', // M4A
  'audio/x-m4a', // M4A
  'audio/m4a', // M4A
  'audio/wav', // WAV
  'audio/x-wav', // WAV
  'audio/wave', // WAV
  'audio/vnd.wave', // WAV
  'audio/aac', // AAC
  'audio/x-aac', // AAC
  'audio/flac', // FLAC
  'audio/x-flac', // FLAC
  'audio/ogg', // OGG
  'audio/vorbis', // Vorbis
  'audio/x-vorbis', // Vorbis
  'audio/opus', // Opus
  'audio/x-opus', // Opus
  'audio/amr', // AMR (mobile recording)
  'audio/x-amr', // AMR
  'audio/3gpp', // 3GP audio
  'audio/x-3gpp', // 3GP audio
  'audio/aiff', // AIFF
  'audio/x-aiff', // AIFF
  'audio/aif', // AIF
  'audio/x-aif', // AIF
  'audio/x-pn-aiff', // AIFF
  'audio/basic', // AU
  'audio/x-au', // AU
  'audio/x-pn-au', // AU
  'audio/x-pn-wav', // WAV
  'audio/x-pn-windows-acm', // WAV
  'audio/vnd.dlna.adts', // ADTS
  'audio/x-ms-wma', // WMA
  'audio/x-ms-wax', // WAX
  'audio/x-realaudio', // RealAudio
  'audio/x-pn-realaudio', // RealAudio
  'audio/x-pn-realaudio-plugin', // RealAudio Plugin
  // Professional Audio Formats
  'audio/x-wavpack', // WavPack
  'audio/x-ape', // Monkey's Audio
  'audio/x-shorten', // Shorten
  'audio/x-tak', // TAK
  'audio/x-tta', // TTA
  // Archives (for bundled camera files)
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'application/x-rar',
  'application/x-7z-compressed',
  'application/x-tar',
  'application/gzip',
  'application/x-gzip',
]

export const filterValidUploadFiles = files => {
  return files.filter(file => VALID_UPLOAD_MIME_TYPES.includes(file.type))
}

export const filterValidRawFiles = files => {
  return files.filter(file => VALID_RAW_FILES_MIME_TYPES.includes(file.type))
}
