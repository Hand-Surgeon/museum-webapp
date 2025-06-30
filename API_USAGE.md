# 국립박물관 API 사용법

## 개선된 API 클라이언트 (museum_api_improved.py)

### 주요 개선사항

1. **보안 강화**: API 키를 환경변수로 관리
2. **오류 처리 개선**: 구체적인 예외 처리 및 로깅
3. **코드 재사용성**: 공통 요청 메서드로 중복 제거
4. **로깅 시스템**: 파일 및 콘솔 로그 지원

### 사용 전 설정

1. 환경변수 설정:
```bash
export MUSEUM_API_KEY="your_actual_api_key_here"
```

2. 또는 .env 파일 생성:
```bash
cp .env.example .env
# .env 파일에서 API 키 수정
```

### 사용 예시

```python
from museum_api_improved import MuseumAPIClient

# 클라이언트 초기화
client = MuseumAPIClient()

# 코드 목록 조회
codes = client.get_code_list()

# 키워드 검색
artworks = client.search_relics("청자", page=1, size=20)

# 카테고리별 검색
ceramics = client.search_relics_by_category("도자기")

# 상세 정보 조회
detail = client.get_relic_detail("artwork_id")

# JSON 파일로 저장
client.export_to_json(artworks, "artworks.json")
```

### 보안 고려사항

- API 키를 코드에 하드코딩하지 마세요
- .env 파일을 .gitignore에 추가하세요
- 프로덕션 환경에서는 환경변수를 사용하세요

### 로그 파일

- `museum_api.log`: API 요청/응답 로그가 기록됩니다