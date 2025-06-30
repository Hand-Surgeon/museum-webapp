import { Artwork } from './types'

export const artworksData: Artwork[] = [
  // 고고관 - 선사시대부터 통일신라까지
  {
    id: 1,
    title: "빗살무늬토기",
    titleEn: "Comb-pattern Pottery",
    period: "신석기시대",
    era: "기원전 4000년경",
    category: "토기",
    material: "토기",
    dimensions: "높이 30cm",
    description: "한국 신석기시대를 대표하는 빗살무늬토기로, 빗 모양의 도구로 그어 넣은 문양이 특징입니다.",
    detailedDescription: "우리나라 신석기 문화를 대표하는 유물이다. 기원전 4000년경 신석기 시대에 제작되었으며, 주로 음식을 저장하거나 조리하는 데 쓰인 토기이다. 표면에 빗 모양의 도구로 선과 점을 눌러 기하학적인 무늬를 새긴 것이 특징이다. 바닥이 평평한 형태로 강원도 춘천 교동의 동굴 주거지에서 출토되었다.",
    historicalBackground: "당시에 이미 뛰어난 미적 감각과 토기 제작 기술을 보여주며, 신석기 시대 한반도 주민들의 생활상과 예술성을 잘 드러낸다.",
    artisticFeatures: "붉은 흙으로 빚은 후 낮은 온도에서 구워낸 연질 토기로, 표면 전체에 빗살무늬를 빽빽이 새겨 장식했다. 이러한 정교한 즐문 패턴은 토기의 미적 아름다움과 함께 주술적 의미를 지닌 것으로 해석된다. 특히 선과 점으로 이뤄진 기하학적 무늬는 반복적이면서도 조화로워 당시 신석기인들의 미의식을 보여준다.",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    featured: true,
    culturalProperty: "",
    museum: "고고관",
    inventoryNumber: "암사123",
    significance: "신석기 문화의 광범위한 교류와 공통된 양식을 증명하며, 그 디자인은 이후 한민족 토기 발전의 토대가 되었다.",
    displayLocation: "고고관 선사실"
  },
  {
    id: 2,
    title: "요령식동검",
    period: "청동기시대",
    category: "청동기",
    material: "청동",
    dimensions: "",
    description: "청동기시대 요령 지역에서 유래된 형태의 동검으로, 한국 청동기 문화의 특징을 보여주는 중요한 유물입니다.",
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0dc1b4cc0f0?w=500&h=600&fit=crop&auto=format&q=80",
    featured: false,
    culturalProperty: "",
    museum: "고고관",
    inventoryNumber: "본관11377, 본관10824"
  }
  // 나머지 98개 작품은 시간 관계상 생략 - 실제 구현시에는 모든 데이터를 포함해야 함
]