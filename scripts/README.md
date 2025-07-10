# Scripts Directory

이 디렉토리는 프로젝트 개발 및 운영에 필요한 스크립트들을 포함합니다.

## 구조

```
scripts/
├── api-test/       # API 테스트 및 디버깅 스크립트
├── data-migration/ # 데이터 마이그레이션 및 변환 스크립트
└── README.md
```

## api-test/

API 연동 테스트 및 디버깅을 위한 스크립트들:
- `debug_api.py` - API 디버깅
- `test_museum_api.py` - 박물관 API 테스트
- `museum_api_final.py` - 최종 API 구현

## data-migration/

데이터 수집, 변환 및 마이그레이션 스크립트들:
- `fetch_*.py` - 이미지 및 데이터 수집 스크립트
- `update_*.py` - 데이터 업데이트 스크립트
- `convert_ts_to_json.py` - TypeScript → JSON 변환
- `migrate-data.js` - Supabase 마이그레이션

## 사용법

개발 중에만 필요한 스크립트들이며, 프로덕션 빌드에는 포함되지 않습니다.