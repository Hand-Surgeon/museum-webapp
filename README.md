# 국립중앙박물관 웹앱

한국의 역사와 문화를 담은 소중한 유물들을 디지털로 감상할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- **홈페이지**: 박물관 소개와 주요 소장품 전시
- **소장품 갤러리**: 100개의 대표 문화재 컬렉션
- **작품 상세보기**: 각 작품의 상세 정보와 역사적 배경
- **검색 및 필터링**: 분류, 시대별 작품 검색
- **다국어 지원**: 한국어/영어 인터페이스
- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **접근성**: 스크린 리더 및 키보드 네비게이션 지원
- **성능 최적화**: 가상 스크롤링 및 이미지 지연 로딩

## 기술 스택

### Frontend
- **Framework**: React 18 + TypeScript
- **Routing**: React Router DOM v6
- **Build Tool**: Vite
- **Styling**: CSS3 (반응형 디자인)
- **Data**: Supabase / JSON (환경별 설정)
- **Performance**: React.lazy, React.memo, react-window
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged

### Architecture
- **Clean Architecture**: Repository Pattern, Use Cases, Service Layer
- **Type Safety**: TypeScript strict mode
- **Security**: Input sanitization, CSP headers
- **Accessibility**: WCAG 2.1 AA 준수

## 설치 및 실행

### 환경 설정

```bash
# 환경 변수 파일 생성
cp .env.example .env

# Supabase 사용 시
VITE_DATA_SOURCE=supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 로컬 JSON 사용 시
VITE_DATA_SOURCE=json
```

### 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 테스트 실행
npm run test

# 타입 체크
npm run type-check

# 린트 검사
npm run lint

# 코드 포맷팅
npm run format
```

### 프로덕션 빌드

```bash
# 환경 변수 검증
npm run validate:env

# 프로덕션 빌드 (전체 검증 포함)
npm run prod:build

# 빌드만 실행
npm run build:prod

# 번들 사이즈 분석
npm run build:analyze

# 프리뷰
npm run preview
```

### Docker 배포

```bash
# Docker 이미지 빌드
npm run docker:build

# Docker 컨테이너 실행
npm run docker:run

# Docker Compose 사용
docker-compose up -d
```

## 프로젝트 구조

```
museum-webapp/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ArtworkCard.tsx
│   │   ├── FilterControls.tsx
│   │   ├── ProgressiveImage.tsx
│   │   └── VirtualizedArtworkGrid.tsx
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── Home.tsx
│   │   ├── Gallery.tsx
│   │   └── ArtworkDetail.tsx
│   ├── repositories/       # 데이터 접근 레이어
│   │   ├── artworkRepository.ts
│   │   ├── localArtworkRepository.ts
│   │   └── supabaseArtworkRepository.ts
│   ├── services/           # 비즈니스 로직
│   │   └── artworkService.ts
│   ├── hooks/              # 커스텀 훅
│   │   └── useArtworkFilter.ts
│   ├── utils/              # 유틸리티 함수
│   │   └── sanitize.ts
│   ├── types/              # TypeScript 타입 정의
│   │   └── database.ts
│   ├── config/             # 설정 파일
│   │   └── dataSource.ts
│   ├── locales/            # 다국어 파일
│   │   ├── ko.json
│   │   └── en.json
│   ├── data/               # 로컬 데이터
│   │   └── artworks.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── scripts/                # 스크립트 파일
│   ├── validate-env.js
│   └── build-prod.sh
├── tests/                  # 테스트 파일
├── .github/                # GitHub Actions
│   └── workflows/
│       └── ci.yml
├── nginx.conf              # Nginx 설정
├── Dockerfile              # Docker 설정
├── docker-compose.yml      # Docker Compose 설정
├── vercel.json             # Vercel 배포 설정
├── netlify.toml            # Netlify 배포 설정
├── vite.config.ts          # Vite 설정
├── tsconfig.json           # TypeScript 설정
├── .eslintrc.json          # ESLint 설정
├── .prettierrc             # Prettier 설정
└── package.json
```

## 배포 옵션

### Vercel
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### Netlify
```bash
# Netlify CLI 설치
npm i -g netlify-cli

# 배포
netlify deploy --prod
```

### Docker
```bash
# 이미지 빌드 및 실행
docker build -t museum-webapp .
docker run -p 80:80 museum-webapp
```

### 전통 호스팅
1. `npm run build:prod` 실행
2. `dist/` 폴더의 내용을 웹 서버에 업로드
3. 제공된 `nginx.conf` 설정 적용

## 성능 최적화

- **코드 분할**: React.lazy와 Suspense를 사용한 라우트별 분할
- **번들 최적화**: Vite의 수동 청크 설정 (vendor, supabase, utils)
- **이미지 최적화**: ProgressiveImage 컴포넌트로 점진적 로딩
- **가상 스크롤링**: 100개 이상의 아이템일 때 자동 적용
- **메모이제이션**: React.memo와 useMemo 활용
- **캐싱 전략**: 정적 자산에 대한 장기 캐싱

## 테스트

```bash
# 단위 테스트 실행
npm run test

# 커버리지 리포트
npm run test:coverage

# 감시 모드
npm run test -- --watch
```

## 개발 가이드

### 커밋 메시지 규칙
- `feat:` 새로운 기능
- `fix:` 버그 수정
- `docs:` 문서 변경
- `style:` 코드 포맷팅
- `refactor:` 리팩토링
- `test:` 테스트 추가/수정
- `chore:` 빌드 설정 등

### 브랜치 전략
- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발
- `hotfix/*`: 긴급 수정

## 소장품 컬렉션

### 시대별 분류
- 고조선/청동기시대 (기원전 10~2세기)
- 삼국시대 (1~7세기) - 백제, 고구려, 신라
- 통일신라 (7~10세기)
- 고려 (918~1392년)
- 조선 (1392~1910년)

### 분야별 분류
- **도자기**: 청자, 백자, 분청사기 (85개)
- **불교조각**: 금동불상, 석조불상 (15개)
- **금속공예**: 금관, 청동기, 은입사 (20개)
- **회화**: 산수화, 풍속화, 고분벽화 (15개)
- **전적류**: 훈민정음, 조선왕조실록 등 (8개)
- **기타**: 나전칠기, 토기, 유리공예 등

## 기여하기

이 프로젝트는 한국 문화재의 디지털 보존과 교육을 목적으로 제작되었습니다. 
문화재 정보의 정확성이나 추가 기능에 대한 제안을 환영합니다.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

---

> "문화는 과거와 현재를 잇는 다리이며, 미래로 향하는 나침반이다."