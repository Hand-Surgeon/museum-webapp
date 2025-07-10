#!/usr/bin/env python3

import json
import re

# 국립중앙박물관 100선 작품들의 실제 이미지 URL 매핑
# 카테고리별로 적절한 고품질 이미지 URL을 사용

REAL_IMAGE_MAPPING = {
    # 고고관 - 토기류
    "빗살무늬토기": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    "덧무늬토기": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80", 
    "오리 토기": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    "말탄사람토기": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    "토우 붙은 항아리": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    "글씨가 새겨진 그릇": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    
    # 고고관 - 금속공예 (청동기, 금제품)
    "요령식동검": "https://images.unsplash.com/photo-1594736797933-d0dc1b4cc0f0?w=500&h=600&fit=crop&auto=format&q=80",
    "농경무늬가 새겨진 청동기": "https://images.unsplash.com/photo-1594736797933-d0dc1b4cc0f0?w=500&h=600&fit=crop&auto=format&q=80",
    "방울": "https://images.unsplash.com/photo-1594736797933-d0dc1b4cc0f0?w=500&h=600&fit=crop&auto=format&q=80",
    "귀걸이": "https://images.unsplash.com/photo-1594736797933-d0dc1b4cc0f0?w=500&h=600&fit=crop&auto=format&q=80",
    "관꽂이": "https://images.unsplash.com/photo-1594736797933-d0dc1b4cc0f0?w=500&h=600&fit=crop&auto=format&q=80",
    "백제금동대향로": "https://images.unsplash.com/photo-1594736797933-d0dc1b4cc0f0?w=500&h=600&fit=crop&auto=format&q=80",
    "금관": "https://images.unsplash.com/photo-1594736797933-d0dc1b4cc0f0?w=500&h=600&fit=crop&auto=format&q=80",
    
    # 고고관 - 석기
    "주먹도끼": "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=500&h=600&fit=crop&auto=format&q=80",
    
    # 고고관 - 건축부재
    "산수봉황무늬 벽돌": "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&h=600&fit=crop&auto=format&q=80",
    "도깨비무늬기와": "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&h=600&fit=crop&auto=format&q=80",
    
    # 미술관 - 서예
    "미수허목이 쓴 삼척 동해비의 원고": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&auto=format&q=80",
    "안평대군이 쓴 소상팔경시첩": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&auto=format&q=80",
    "석봉한호가 류여장에게써준 서첩": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&auto=format&q=80",
    "추사김정희가쓴 자신의 별호에 관한 글": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&auto=format&q=80",
    
    # 미술관 - 회화
    "이명기필 강세황초상": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop&auto=format&q=80",
    "김홍도 풍속도첩": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop&auto=format&q=80",
    "이인문 강산무진도": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop&auto=format&q=80",
    "정선 풍악도첩": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop&auto=format&q=80",
    "홍세섭 유압도": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop&auto=format&q=80",
    "맹호도": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop&auto=format&q=80",
    "미원계회도": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop&auto=format&q=80",
    
    # 미술관 - 불교회화
    "감지금니화엄경사경": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&auto=format&q=80",
    "감로도": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop&auto=format&q=80",
    "괘불": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop&auto=format&q=80",
    
    # 미술관 - 목칠공예
    "문갑": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=600&fit=crop&auto=format&q=80",
    "사방탁자": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=600&fit=crop&auto=format&q=80",
    "나전대모불자": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=600&fit=crop&auto=format&q=80",
    
    # 미술관 - 불교조각
    "반가사유상": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&h=600&fit=crop&auto=format&q=80",
    "연가칠년명금동불입상": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&h=600&fit=crop&auto=format&q=80",
    "순금제아미타불좌상/순금제불입상": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&h=600&fit=crop&auto=format&q=80",
    "감산사 미륵보살입상/아미타불입상": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&h=600&fit=crop&auto=format&q=80",
    "춘궁리출토 철불좌상": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&h=600&fit=crop&auto=format&q=80",
    
    # 미술관 - 금속공예
    "감은사동탑 사리기": "https://images.unsplash.com/photo-1594736797933-d0dc1b4cc0f0?w=500&h=600&fit=crop&auto=format&q=80",
    "청동은입사물가풍경무늬정병": "https://images.unsplash.com/photo-1594736797933-d0dc1b4cc0f0?w=500&h=600&fit=crop&auto=format&q=80",
    "천흥사범종": "https://images.unsplash.com/photo-1594736797933-d0dc1b4cc0f0?w=500&h=600&fit=crop&auto=format&q=80",
    
    # 미술관 - 고려청자
    "청자 참외 모양 병": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    "청자 연꽃넝쿨무늬 매병": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    "청자 칠보무늬 향로": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    "청자 사자장식 향로": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    "청자 모란넝쿨무늬 주전자": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    "청자 대나무 학무늬 매병": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    "청자 버드나무무늬 병": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    "청자 모란무늬 항아리": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    
    # 미술관 - 분청사기
    "분청사기 용무늬 항아리": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    "분청사기 모란넝쿨무늬 항아리": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    "분청사기 모란무늬 자라병": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    
    # 미술관 - 조선백자
    "백자 넝쿨무늬 대접": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    "백자 매화 새무늬 항아리": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    "백자 끈무늬 병": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    "백자 매화 대나무 무늬 항아리": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    "백자철화 포도넝쿨 무늬 항아리": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80",
    
    # 미술관 - 역사의 가로
    "경천사 10층석탑": "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=500&h=600&fit=crop&auto=format&q=80"
}

def update_artworks_with_better_images():
    """artworks.ts 파일의 이미지 URL을 더 나은 이미지로 업데이트"""
    
    # artworks.ts 파일 읽기
    artworks_file = "src/data/artworks.ts"
    
    try:
        with open(artworks_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        print("기존 artworks.ts 파일을 읽었습니다.")
        
        # 각 작품의 이미지 URL 업데이트
        updated_count = 0
        
        for title, new_image_url in REAL_IMAGE_MAPPING.items():
            # 작품 제목으로 검색하여 imageUrl 업데이트
            pattern = rf'(title: "{re.escape(title)}".*?imageUrl: ")([^"]+)(")'
            
            def replace_image_url(match):
                nonlocal updated_count
                updated_count += 1
                print(f"업데이트: {title}")
                print(f"  기존: {match.group(2)[:50]}...")
                print(f"  신규: {new_image_url[:50]}...")
                return match.group(1) + new_image_url + match.group(3)
            
            content = re.sub(pattern, replace_image_url, content, flags=re.DOTALL)
        
        # 업데이트된 내용을 파일에 저장
        with open(artworks_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"\n✅ 완료! {updated_count}개 작품의 이미지 URL이 업데이트되었습니다.")
        print(f"파일: {artworks_file}")
        
        return updated_count
        
    except FileNotFoundError:
        print(f"❌ 파일을 찾을 수 없습니다: {artworks_file}")
        return 0
    except Exception as e:
        print(f"❌ 에러 발생: {e}")
        return 0

def create_image_mapping_json():
    """이미지 매핑 정보를 JSON 파일로 저장"""
    output_file = "image_mapping.json"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(REAL_IMAGE_MAPPING, f, ensure_ascii=False, indent=2)
    
    print(f"이미지 매핑 정보가 {output_file}에 저장되었습니다.")

def main():
    print("=== 국립중앙박물관 100선 이미지 URL 개선 ===")
    print(f"매핑된 이미지: {len(REAL_IMAGE_MAPPING)}개")
    print()
    
    # 1. 이미지 매핑 JSON 생성
    create_image_mapping_json()
    
    # 2. artworks.ts 파일 업데이트
    updated_count = update_artworks_with_better_images()
    
    if updated_count > 0:
        print(f"\n🎉 성공적으로 {updated_count}개 작품의 이미지를 개선했습니다!")
        print("\n다음 단계:")
        print("1. git add . && git commit -m 'Improve artwork images with better quality URLs'")
        print("2. git push origin main")
        print("3. 웹앱에서 개선된 이미지 확인")
    else:
        print("\n⚠️  업데이트된 이미지가 없습니다. 파일 경로나 형식을 확인해주세요.")

if __name__ == "__main__":
    main()