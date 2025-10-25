// scripts/convert-images.cjs
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

/**
 * Convert images to WebP format and rename sequentially
 * @param {string} inputDir - Directory containing original images
 * @param {string} prefix - Prefix for output files (e.g., 'avatar', 'event')
 * @param {number} quality - WebP quality (1-100)
 * @param {number} maxWidth - Maximum width for resizing
 * @param {number|null} maxHeight - Maximum height for resizing (null for auto)
 */
async function convertImages(inputDir, prefix, quality = 85, maxWidth = 1200, maxHeight = null) {
  console.log(`\n📁 Processing directory: ${inputDir}`)
  console.log(`🎯 Target: ${prefix}-1.webp, ${prefix}-2.webp, etc.`)

  // Check if directory exists
  if (!fs.existsSync(inputDir)) {
    console.error(`❌ Directory not found: ${inputDir}`)
    return
  }

  // Get all image files
  const files = fs.readdirSync(inputDir)
  const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif|bmp|tiff)$/i.test(file))

  if (imageFiles.length === 0) {
    console.log('⚠️  No images found in directory')
    return
  }

  console.log(`📸 Found ${imageFiles.length} images to convert\n`)

  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < imageFiles.length; i++) {
    const inputFile = path.join(inputDir, imageFiles[i])
    const outputFile = path.join(inputDir, `${prefix}-${i + 1}.webp`)

    try {
      // Get original file size
      const originalStats = fs.statSync(inputFile)
      const originalSize = (originalStats.size / 1024).toFixed(2)

      // Convert and compress
      const sharpInstance = sharp(inputFile)

      if (maxHeight) {
        await sharpInstance
          .resize(maxWidth, maxHeight, {
            fit: 'cover',
            position: 'center',
          })
          .webp({ quality, effort: 6 })
          .toFile(outputFile)
      } else {
        await sharpInstance
          .resize(maxWidth, null, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality, effort: 6 })
          .toFile(outputFile)
      }

      // Get new file size
      const newStats = fs.statSync(outputFile)
      const newSize = (newStats.size / 1024).toFixed(2)
      const reduction = (((originalStats.size - newStats.size) / originalStats.size) * 100).toFixed(
        1
      )

      console.log(
        `✅ ${prefix}-${i + 1}.webp | ${originalSize}KB → ${newSize}KB (${reduction}% reduction)`
      )

      // Delete original file
      fs.unlinkSync(inputFile)

      successCount++
    } catch (error) {
      console.error(`❌ Failed to convert ${imageFiles[i]}:`, error.message)
      errorCount++
    }
  }

  console.log(`\n✨ Conversion complete for ${prefix}:`)
  console.log(`   ✅ Success: ${successCount}`)
  if (errorCount > 0) {
    console.log(`   ❌ Failed: ${errorCount}`)
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting image conversion and compression...\n')
  console.log('='.repeat(60))

  const avatarsDir = path.join(__dirname, '..', 'public', 'uploads', 'avatars')
  const eventsDir = path.join(__dirname, '..', 'public', 'uploads', 'events')

  // Convert avatars (400x400, square crop, higher quality)
  await convertImages(
    avatarsDir,
    'avatar', // prefix
    90, // quality (higher for faces)
    400, // maxWidth
    400 // maxHeight (square)
  )

  console.log('\n' + '='.repeat(60))

  // Convert events (1920x1080, landscape, standard quality)
  await convertImages(
    eventsDir,
    'event', // prefix
    85, // quality
    1920, // maxWidth
    null // maxHeight (auto, maintain aspect ratio)
  )

  console.log('\n' + '='.repeat(60))
  console.log('\n🎉 All images have been converted to WebP format!')
  console.log('\n📝 Summary:')
  console.log('   • Avatars: avatar-1.webp to avatar-30.webp')
  console.log('   • Events: event-1.webp to event-30.webp')
  console.log('\n💡 Tip: Original JPG files have been deleted automatically')
}

// Run the script
main().catch((error) => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
