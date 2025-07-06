import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase 설정 - 실제 프로젝트의 URL과 키로 교체 필요
const supabaseUrl = 'https://sgvpiljodxoyghluvdhi.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY; // 환경변수에서 키 읽기

const supabase = createClient(supabaseUrl, supabaseKey);

// artworks-data.ts 파일을 읽어서 데이터 추출
function loadArtworksData() {
  const dataPath = path.join(__dirname, 'src', 'data', 'artworks-data.ts');
  const fileContent = fs.readFileSync(dataPath, 'utf8');
  
  // TypeScript 파일에서 JSON 데이터 추출 (간단한 정규식 사용)
  // 실제로는 더 정교한 파싱이 필요할 수 있습니다
  const jsonMatch = fileContent.match(/export const artworksData: Artwork\[\] = (\[[\s\S]*\]);/);
  if (!jsonMatch) {
    throw new Error('데이터를 찾을 수 없습니다');
  }
  
  // JSON 형태로 변환 (eval 사용 주의 - 실제 환경에서는 더 안전한 방법 사용)
  const artworksArray = eval(jsonMatch[1]);
  return artworksArray;
}

// JSON 파일에서 데이터 로드하는 대안 방법
function loadArtworksFromJson() {
  const jsonPath = path.join(__dirname, 'src', 'data', 'artworks.json');
  const jsonContent = fs.readFileSync(jsonPath, 'utf8');
  return JSON.parse(jsonContent);
}

// 데이터베이스 필드명으로 변환
function transformArtworkForDB(artwork) {
  return {
    id: artwork.id,
    title: artwork.title,
    title_en: artwork.titleEn || null,
    period: artwork.period,
    category: artwork.category,
    material: artwork.material,
    dimensions: artwork.dimensions || null,
    description: artwork.description,
    detailed_description: artwork.detailedDescription || null,
    historical_background: artwork.historicalBackground || null,
    artistic_features: artwork.artisticFeatures || null,
    image_url: artwork.imageUrl,
    featured: artwork.featured || false,
    cultural_property: artwork.culturalProperty || null,
    national_treasure_number: artwork.nationalTreasureNumber || null,
    museum: artwork.museum,
    inventory_number: artwork.inventoryNumber || null,
    era: artwork.era || null,
    significance: artwork.significance || null,
    display_location: artwork.displayLocation || null
  };
}

// 데이터 마이그레이션 실행
async function migrateData() {
  try {
    console.log('데이터 마이그레이션을 시작합니다...');
    
    // 기존 데이터 확인
    const { data: existingData, error: selectError } = await supabase
      .from('artworks')
      .select('id');
    
    if (selectError) {
      throw selectError;
    }
    
    if (existingData && existingData.length > 0) {
      console.log(`기존 데이터 ${existingData.length}개 발견. 삭제 후 새로 입력합니다.`);
      const { error: deleteError } = await supabase
        .from('artworks')
        .delete()
        .neq('id', 0); // 모든 데이터 삭제
      
      if (deleteError) {
        throw deleteError;
      }
    }
    
    // 데이터 로드
    let artworksData;
    try {
      artworksData = loadArtworksFromJson();
      console.log('JSON 파일에서 데이터 로드 성공');
    } catch (error) {
      console.log('JSON 파일 로드 실패, TypeScript 파일에서 시도...');
      artworksData = loadArtworksData();
      console.log('TypeScript 파일에서 데이터 로드 성공');
    }
    
    console.log(`총 ${artworksData.length}개의 작품 데이터를 발견했습니다.`);
    
    // 데이터 변환
    const transformedData = artworksData.map(transformArtworkForDB);
    
    // 배치로 데이터 삽입 (한 번에 너무 많이 하면 실패할 수 있으므로)
    const batchSize = 10;
    let insertedCount = 0;
    
    for (let i = 0; i < transformedData.length; i += batchSize) {
      const batch = transformedData.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('artworks')
        .insert(batch);
      
      if (error) {
        console.error(`배치 ${Math.floor(i / batchSize) + 1} 삽입 실패:`, error);
        throw error;
      }
      
      insertedCount += batch.length;
      console.log(`${insertedCount}/${transformedData.length} 작품 데이터 삽입 완료`);
    }
    
    console.log('모든 데이터 마이그레이션이 완료되었습니다!');
    
    // 최종 확인
    const { data: finalData, error: finalError } = await supabase
      .from('artworks')
      .select('id, title, museum')
      .limit(5);
    
    if (finalError) {
      throw finalError;
    }
    
    console.log('마이그레이션 확인 - 처음 5개 작품:');
    finalData.forEach(artwork => {
      console.log(`- ID: ${artwork.id}, 제목: ${artwork.title}, 박물관: ${artwork.museum}`);
    });
    
  } catch (error) {
    console.error('마이그레이션 중 오류 발생:', error);
    process.exit(1);
  }
}

// 환경변수 확인
if (!supabaseKey) {
  console.error('SUPABASE_ANON_KEY 환경변수가 설정되지 않았습니다.');
  console.log('다음 명령어로 실행하세요:');
  console.log('SUPABASE_ANON_KEY=your_anon_key node migrate-data.js');
  process.exit(1);
}

// 스크립트 실행
migrateData();