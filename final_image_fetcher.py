#!/usr/bin/env python3

import requests
import json
import time
import urllib.parse
import xml.etree.ElementTree as ET

# 올바른 API 키 (디코딩된 버전)
SERVICE_KEY = "YcIMxgSOiCBtw1UZ2MksofNXaiqbyUY8w/JAKpLS9tb6xwUXQD5dcCevW9yJvBCLjnpTa9lmu1nWjmMefTzvDw=="
BASE_URL = "https://www.emuseum.go.kr/openapi"

# 처음 20개 작품으로 테스트
TEST_ARTWORKS = [
    {"id": 1, "title": "빗살무늬토기", "inventory": "암사123"},
    {"id": 2, "title": "요령식동검", "inventory": "본관11377"},
    {"id": 3, "title": "산수봉황무늬 벽돌", "inventory": "본관13972"},
    {"id": 4, "title": "귀걸이", "inventory": "본관6255"},
    {"id": 5, "title": "주먹도끼", "inventory": "서울대22"},
    {"id": 8, "title": "방울", "inventory": "신수2580"},
    {"id": 11, "title": "관꽂이", "inventory": "공주633"},
    {"id": 12, "title": "백제금동대향로", "inventory": "부여5333"},
    {"id": 14, "title": "금관", "inventory": "황북9310"},
    {"id": 15, "title": "말탄사람토기", "inventory": "본관9705"},
    {"id": 20, "title": "미수허목이 쓴 삼척 동해비의 원고", "inventory": "신수10610"},
    {"id": 25, "title": "김홍도 풍속도첩", "inventory": "본관6504"},
    {"id": 37, "title": "반가사유상", "inventory": "덕수 3312"},
    {"id": 38, "title": "연가칠년명금동불입상", "inventory": "신수 853"},
    {"id": 43, "title": "청동은입사물가풍경무늬정병", "inventory": "본관02426"},
    {"id": 45, "title": "청자 참외 모양 병", "inventory": "본관4254"},
    {"id": 53, "title": "분청사기 용무늬 항아리", "inventory": "덕수2411"},
    {"id": 57, "title": "백자 매화 새무늬 항아리", "inventory": "신수 4522"},
    {"id": 74, "title": "무구정광대다라니경", "inventory": "기탁 56"},
    {"id": 79, "title": "이성계호적", "inventory": "신수 6267"}
]

def search_relic_by_name(title):
    """작품명으로 유물 검색"""
    encoded_title = urllib.parse.quote(title)
    url = f"{BASE_URL}/relic/list"
    params = {
        'serviceKey': SERVICE_KEY,
        'name': encoded_title,
        'numOfRows': 10,
        'pageNo': 1,
        'returnType': 'json'
    }
    
    try:
        print(f"검색: {title}")
        response = requests.get(url, params=params, timeout=15)
        
        # XML 응답을 파싱
        root = ET.fromstring(response.text)
        
        result_code = root.find('resultCode')
        total_count = root.find('totalCount')
        
        print(f"  Result Code: {result_code.text if result_code is not None else 'None'}")
        print(f"  Total Count: {total_count.text if total_count is not None else 'None'}")
        
        if total_count is not None and int(total_count.text) > 0:
            # items 찾기
            items_elem = root.find('items')
            if items_elem is not None:
                results = []
                for item in items_elem:
                    item_data = {}
                    for child in item:
                        item_data[child.tag] = child.text if child.text else ''
                    results.append(item_data)
                    
                    print(f"    후보: {item_data.get('name', '')} (ID: {item_data.get('id', '')}, 소장품: {item_data.get('collection', '')})")
                
                return results
        
        return []
        
    except Exception as e:
        print(f"  검색 실패: {e}")
        return []

def get_relic_detail(relic_id):
    """유물 상세 정보 조회"""
    url = f"{BASE_URL}/relic/detail"
    params = {
        'serviceKey': SERVICE_KEY,
        'id': relic_id,
        'returnType': 'json'
    }
    
    try:
        print(f"    상세 조회: {relic_id}")
        response = requests.get(url, params=params, timeout=15)
        
        # XML 응답을 파싱
        root = ET.fromstring(response.text)
        
        # items 찾기
        items_elem = root.find('items')
        if items_elem is not None and len(items_elem) > 0:
            item = items_elem[0]
            
            detail_data = {}
            images = []
            
            for child in item:
                if child.tag == 'imageList':
                    # 이미지 리스트 파싱
                    for img_item in child:
                        img_data = {}
                        for img_child in img_item:
                            img_data[img_child.tag] = img_child.text if img_child.text else ''
                        images.append(img_data)
                else:
                    detail_data[child.tag] = child.text if child.text else ''
            
            # 최적의 이미지 URL 선택
            best_image_url = ""
            if images:
                first_image = images[0]
                # 우선순위: 원본 > 중형 썸네일 > 소형 썸네일
                for url_key in ['imgOriUri', 'imgThumUriM', 'imgThumUriS', 'imgUrl']:
                    if url_key in first_image and first_image[url_key]:
                        best_image_url = first_image[url_key]
                        print(f"      선택된 이미지: {url_key} = {best_image_url}")
                        break
            
            return {
                'name': detail_data.get('name', ''),
                'collection': detail_data.get('collection', ''),
                'era': detail_data.get('era', ''),
                'material': detail_data.get('material', ''),
                'size': detail_data.get('size', ''),
                'description': detail_data.get('description', ''),
                'designation': detail_data.get('designation', ''),
                'imageUrl': best_image_url,
                'imageCount': len(images),
                'allImages': images
            }
        
        return None
        
    except Exception as e:
        print(f"    상세 조회 실패: {e}")
        return None

def find_best_match(artwork, search_results):
    """검색 결과에서 최적의 매칭 찾기"""
    if not search_results:
        return None
    
    # 1순위: 소장품번호 매칭
    for result in search_results:
        result_collection = result.get('collection', '')
        if artwork['inventory'] in result_collection or result_collection in artwork['inventory']:
            print(f"    ✓ 소장품번호 매칭: {result.get('id', '')}")
            return result
    
    # 2순위: 작품명 매칭
    for result in search_results:
        result_name = result.get('name', '')
        if artwork['title'] in result_name or result_name in artwork['title']:
            print(f"    ✓ 작품명 매칭: {result.get('id', '')}")
            return result
    
    # 3순위: 첫 번째 결과
    print(f"    → 첫 번째 결과 사용: {search_results[0].get('id', '')}")
    return search_results[0]

def main():
    print("=== 국립중앙박물관 실제 이미지 수집 (최종) ===")
    print(f"API Key: {SERVICE_KEY[:20]}...")
    print(f"테스트 작품: {len(TEST_ARTWORKS)}개")
    print()
    
    successful_results = []
    failed_results = []
    
    for artwork in TEST_ARTWORKS:
        print(f"\n[{artwork['id']}] {artwork['title']}")
        print(f"소장품번호: {artwork['inventory']}")
        
        # 1단계: 작품명으로 검색
        search_results = search_relic_by_name(artwork['title'])
        
        if not search_results:
            print("  ✗ 검색 결과 없음")
            failed_results.append({
                'artwork': artwork,
                'error': '검색 결과 없음'
            })
            continue
        
        # 2단계: 최적 매칭 찾기
        best_match = find_best_match(artwork, search_results)
        
        if not best_match or not best_match.get('id'):
            print("  ✗ 적절한 매칭 없음")
            failed_results.append({
                'artwork': artwork,
                'error': '적절한 매칭 없음'
            })
            continue
        
        # 3단계: 상세 정보 조회
        detail_info = get_relic_detail(best_match['id'])
        
        if not detail_info:
            print("  ✗ 상세 정보 조회 실패")
            failed_results.append({
                'artwork': artwork,
                'relic_id': best_match['id'],
                'error': '상세 정보 조회 실패'
            })
            continue
        
        # 4단계: 결과 저장
        if detail_info['imageUrl']:
            print(f"  ✓ 성공! 이미지 URL 확보")
            print(f"    API 작품명: {detail_info['name']}")
            print(f"    이미지: {detail_info['imageUrl']}")
            
            successful_results.append({
                'artwork': artwork,
                'relic_id': best_match['id'],
                'api_data': detail_info
            })
        else:
            print("  △ 상세 정보는 있으나 이미지 없음")
            failed_results.append({
                'artwork': artwork,
                'relic_id': best_match['id'],
                'api_data': detail_info,
                'error': '이미지 없음'
            })
        
        # API 호출 간격
        time.sleep(1)
        print("-" * 60)
    
    # 결과 저장
    result_data = {
        'successful': successful_results,
        'failed': failed_results,
        'summary': {
            'total': len(TEST_ARTWORKS),
            'success': len(successful_results),
            'failed': len(failed_results)
        }
    }
    
    with open('real_museum_images.json', 'w', encoding='utf-8') as f:
        json.dump(result_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n=== 수집 완료 ===")
    print(f"총 처리: {len(TEST_ARTWORKS)}개")
    print(f"성공: {len(successful_results)}개")
    print(f"실패: {len(failed_results)}개")
    print(f"결과 파일: real_museum_images.json")
    
    if successful_results:
        print(f"\n=== 성공한 작품들 ===")
        for result in successful_results:
            artwork = result['artwork']
            api_data = result['api_data']
            print(f"- {artwork['title']} (ID: {artwork['id']})")
            print(f"  이미지: {api_data['imageUrl'][:80]}...")

if __name__ == "__main__":
    main()