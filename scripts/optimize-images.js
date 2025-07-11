import sharp from 'sharp'
import { promises as fs } from 'fs'
import path from 'path'

const ARTWORK_DIR = './public/images/artworks'
const OPTIMIZED_DIR = './public/images/artworks-optimized'
const THUMBNAIL_DIR = './public/images/artworks-thumbnails'

// 크기 설정
const SIZES = {
  optimized: { width: 1200, quality: 85 },
  thumbnail: { width: 400, quality: 80 },
}

async function optimizeImages() {
  try {
    // 디렉토리 생성
    await fs.mkdir(OPTIMIZED_DIR, { recursive: true })
    await fs.mkdir(THUMBNAIL_DIR, { recursive: true })

    // 원본 이미지 목록 가져오기
    const files = await fs.readdir(ARTWORK_DIR)
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png)$/i.test(file))

    console.log(`총 ${imageFiles.length}개의 이미지를 최적화합니다...`)

    for (const file of imageFiles) {
      const inputPath = path.join(ARTWORK_DIR, file)
      const optimizedPath = path.join(OPTIMIZED_DIR, file)
      const thumbnailPath = path.join(THUMBNAIL_DIR, file)

      console.log(`처리 중: ${file}`)

      // 최적화된 이미지 생성
      await sharp(inputPath)
        .resize(SIZES.optimized.width, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .jpeg({ quality: SIZES.optimized.quality, progressive: true })
        .toFile(optimizedPath.replace(/\.\w+$/, '.jpg'))

      // 썸네일 생성
      await sharp(inputPath)
        .resize(SIZES.thumbnail.width, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .jpeg({ quality: SIZES.thumbnail.quality })
        .toFile(thumbnailPath.replace(/\.\w+$/, '.jpg'))
    }

    console.log('이미지 최적화 완료!')

    // 파일 크기 비교
    const originalSize = await getDirectorySize(ARTWORK_DIR)
    const optimizedSize = await getDirectorySize(OPTIMIZED_DIR)
    const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1)

    console.log(`원본 크기: ${(originalSize / 1024 / 1024).toFixed(1)}MB`)
    console.log(`최적화 크기: ${(optimizedSize / 1024 / 1024).toFixed(1)}MB`)
    console.log(`절감률: ${savings}%`)
  } catch (error) {
    console.error('이미지 최적화 중 오류 발생:', error)
  }
}

async function getDirectorySize(dirPath) {
  const files = await fs.readdir(dirPath)
  let totalSize = 0

  for (const file of files) {
    const stats = await fs.stat(path.join(dirPath, file))
    totalSize += stats.size
  }

  return totalSize
}

// 스크립트 실행
optimizeImages()
