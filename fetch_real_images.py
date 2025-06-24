#!/usr/bin/env python3

import requests
import json
import time
import urllib.parse
from pathlib import Path

# API 설정
SERVICE_KEY = "YcIMxgSOiCBtw1UZ2MksofNXaiqbyUY8w/JAKpLS9tb6xwUXQD5dcCevW9yJvBCLjnpTa9lmu1nWjmMefTzvDw=="
BASE_URL = "https://www.emuseum.go.kr/openapi"

# 100선 작품 정보 (artworks.ts에서 추출)
ARTWORKS_100 = [
    {"id": 1, "title": "빗살무늬토기", "inventory": "암사123", "museum": "고고관"},
    {"id": 2, "title": "요령식동검", "inventory": "본관11377", "museum": "고고관"},
    {"id": 3, "title": "산수봉황무늬 벽돌", "inventory": "본관13972", "museum": "고고관"},
    {"id": 4, "title": "귀걸이", "inventory": "본관6255", "museum": "고고관"},
    {"id": 5, "title": "주먹도끼", "inventory": "서울대22", "museum": "고고관"},
    {"id": 6, "title": "덧무늬토기", "inventory": "미등록", "museum": "고고관"},
    {"id": 7, "title": "농경무늬가 새겨진 청동기", "inventory": "신수1794", "museum": "고고관"},
    {"id": 8, "title": "방울", "inventory": "신수2580", "museum": "고고관"},
    {"id": 9, "title": "오리 토기", "inventory": "영남대2", "museum": "고고관"},
    {"id": 10, "title": "글씨가 새겨진 그릇", "inventory": "신수120", "museum": "고고관"},
    # 처음 10개로 테스트
]

def search_artwork(title, inventory_number=None):
    """작품명으로 검색하여 유물 ID 찾기"""
    url = f"{BASE_URL}/relic/list"
    
    # 기본 파라미터
    params = {
        'serviceKey': SERVICE_KEY,
        'name': title,
        'numOfRows': 10,
        'pageNo': 1,
        'returnType': 'json'
    }
    
    # 국립중앙박물관 본관 소장품으로 필터링 (가능하다면)
    # params['org'] = 'PS01'  # 필요시 추가
    
    try:
        print(f"검색 중: {title}")
        response = requests.get(url, params=params, timeout=15)
        
        if response.status_code == 200:
            # JSON 응답 시도
            try:
                data = response.json()
                
                if 'response' in data:
                    body = data['response']['body']
                    total_count = body.get('totalCount', 0)
                    items = body.get('items', [])
                    
                    print(f"  검색 결과: {total_count}개")
                    
                    # 가장 적합한 결과 찾기
                    for item in items:
                        item_name = item.get('name', '')
                        item_collection = item.get('collection', '')
                        item_id = item.get('id', '')
                        
                        print(f"    후보: {item_name} (소장품번호: {item_collection})")
                        
                        # 소장품번호가 일치하는 경우 우선
                        if inventory_number and inventory_number in item_collection:
                            print(f"    ✓ 소장품번호 일치: {item_id}")
                            return item_id, item
                        
                        # 작품명이 포함되는 경우
                        if title in item_name or item_name in title:
                            print(f"    ✓ 작품명 유사: {item_id}")
                            return item_id, item
                    
                    # 정확한 매치가 없으면 첫 번째 결과 사용
                    if items:
                        first_item = items[0]
                        print(f"    → 첫 번째 결과 사용: {first_item.get('id', '')}")
                        return first_item.get('id', ''), first_item
                
            except json.JSONDecodeError:
                # XML 응답인 경우 XML 파싱
                print(f"  XML 응답 처리 중...")
                return parse_xml_search_response(response.text, title, inventory_number)
                
    except Exception as e:
        print(f"  검색 실패: {e}")
    
    return None, None

def parse_xml_search_response(xml_text, title, inventory_number):
    """XML 응답을 파싱하여 유물 ID 찾기"""
    import xml.etree.ElementTree as ET
    
    try:
        root = ET.fromstring(xml_text)
        
        # 기본 정보 확인
        result_code = root.find('resultCode')
        total_count = root.find('totalCount')
        
        if result_code is not None:
            print(f"    Result Code: {result_code.text}")
        
        if total_count is not None:
            print(f"    Total Count: {total_count.text}")
            
            if int(total_count.text) > 0:
                # items 찾기
                items_elem = root.find('items')
                if items_elem is not None:
                    for item in items_elem:
                        item_data = {}
                        for child in item:
                            item_data[child.tag] = child.text
                        
                        item_name = item_data.get('name', '')
                        item_collection = item_data.get('collection', '')
                        item_id = item_data.get('id', '')
                        
                        print(f"    XML 후보: {item_name} (ID: {item_id})")
                        
                        # 매칭 로직
                        if inventory_number and inventory_number in item_collection:
                            return item_id, item_data
                        
                        if title in item_name or item_name in title:
                            return item_id, item_data
                    
                    # 첫 번째 아이템 반환
                    if len(items_elem) > 0:
                        first_item_data = {}
                        for child in items_elem[0]:
                            first_item_data[child.tag] = child.text
                        return first_item_data.get('id', ''), first_item_data
        
    except Exception as e:
        print(f"    XML 파싱 실패: {e}")
    
    return None, None

def get_artwork_detail(relic_id):
    """유물 상세 정보 및 이미지 조회"""
    url = f"{BASE_URL}/relic/detail"
    params = {
        'serviceKey': SERVICE_KEY,
        'id': relic_id,
        'returnType': 'json'
    }
    
    try:
        print(f"  상세 정보 조회: {relic_id}")
        response = requests.get(url, params=params, timeout=15)
        
        if response.status_code == 200:
            try:
                data = response.json()
                
                if 'response' in data:
                    body = data['response']['body']
                    items = body.get('items', [])
                    
                    if items:
                        detail = items[0]
                        
                        # 이미지 정보 추출
                        image_list = detail.get('imageList', {})
                        if isinstance(image_list, dict):
                            images = image_list.get('list', [])
                        else:
                            images = image_list if isinstance(image_list, list) else []
                        
                        print(f"    이미지 개수: {len(images)}개")
                        
                        # 대표 이미지 URL 선택
                        best_image_url = ""
                        if images:
                            first_image = images[0]
                            
                            # 이미지 URL 우선순위: 원본 > 중형 썸네일 > 소형 썸네일
                            for url_key in ['imgOriUri', 'imgThumUriM', 'imgThumUriS', 'imgUrl']:
                                if url_key in first_image and first_image[url_key]:
                                    best_image_url = first_image[url_key]
                                    print(f"    선택된 이미지: {url_key} - {best_image_url}")
                                    break
                        
                        return {
                            'name': detail.get('name', ''),
                            'description': detail.get('description', ''),
                            'era': detail.get('era', ''),
                            'material': detail.get('material', ''),
                            'size': detail.get('size', ''),
                            'designation': detail.get('designation', ''),
                            'collection': detail.get('collection', ''),
                            'imageUrl': best_image_url,
                            'imageCount': len(images),
                            'allImages': images
                        }
                        
            except json.JSONDecodeError:
                # XML 응답 처리
                print(f"    XML 상세 응답 처리 중...")
                return parse_xml_detail_response(response.text)
                
    except Exception as e:
        print(f"    상세 조회 실패: {e}")
    
    return None

def parse_xml_detail_response(xml_text):
    """XML 상세 응답 파싱"""
    import xml.etree.ElementTree as ET
    
    try:
        root = ET.fromstring(xml_text)
        
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
                            img_data[img_child.tag] = img_child.text
                        images.append(img_data)
                else:
                    detail_data[child.tag] = child.text
            
            # 대표 이미지 선택
            best_image_url = ""
            if images:
                first_image = images[0]
                for url_key in ['imgOriUri', 'imgThumUriM', 'imgThumUriS']:
                    if url_key in first_image and first_image[url_key]:
                        best_image_url = first_image[url_key]
                        break
            
            return {
                'name': detail_data.get('name', ''),
                'description': detail_data.get('description', ''),
                'era': detail_data.get('era', ''),
                'material': detail_data.get('material', ''),
                'size': detail_data.get('size', ''),
                'designation': detail_data.get('designation', ''),
                'collection': detail_data.get('collection', ''),
                'imageUrl': best_image_url,
                'imageCount': len(images),
                'allImages': images
            }
        
    except Exception as e:
        print(f"    XML 상세 파싱 실패: {e}")
    
    return None

def main():
    print("=== 국립중앙박물관 100선 실제 이미지 수집 ===")
    print(f"API 엔드포인트: {BASE_URL}")
    print(f"처리 대상: {len(ARTWORKS_100)}개 작품")
    print()
    
    results = []
    success_count = 0
    
    for artwork in ARTWORKS_100:
        print(f"\n[{artwork['id']}/100] {artwork['title']}")
        print(f"소장품번호: {artwork['inventory']}")
        print(f"전시관: {artwork['museum']}")
        
        # 1단계: 작품 검색
        relic_id, search_result = search_artwork(
            artwork['title'], 
            artwork['inventory'] if artwork['inventory'] != '미등록' else None
        )
        
        if not relic_id:
            print("  ✗ 검색 결과 없음")
            results.append({
                'id': artwork['id'],
                'title': artwork['title'],
                'status': 'not_found',
                'error': '검색 결과 없음'
            })
            continue
        
        # 2단계: 상세 정보 조회
        detail_info = get_artwork_detail(relic_id)
        
        if not detail_info:
            print("  ✗ 상세 정보 조회 실패")
            results.append({
                'id': artwork['id'],
                'title': artwork['title'],
                'relic_id': relic_id,
                'status': 'detail_failed',
                'error': '상세 정보 조회 실패'
            })
            continue
        
        # 3단계: 결과 저장
        if detail_info['imageUrl']:
            print("  ✓ 이미지 URL 확보 성공!")
            success_count += 1
            status = 'success'
        else:
            print("  △ 상세 정보는 있으나 이미지 없음")
            status = 'no_image'
        
        results.append({
            'id': artwork['id'],
            'title': artwork['title'],
            'relic_id': relic_id,
            'status': status,
            'api_data': detail_info,
            'original_inventory': artwork['inventory']
        })
        
        print(f"  API 작품명: {detail_info.get('name', '')}")
        print(f"  이미지 URL: {detail_info['imageUrl'][:80]}..." if detail_info['imageUrl'] else "  이미지: 없음")
        
        # API 호출 간격
        time.sleep(0.5)
        print("-" * 60)
    
    # 결과 저장
    output_file = "museum_100_images_result.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"\n=== 수집 완료 ===")
    print(f"총 처리: {len(ARTWORKS_100)}개")
    print(f"성공: {success_count}개")
    print(f"실패: {len(ARTWORKS_100) - success_count}개")
    print(f"결과 파일: {output_file}")
    
    # 성공한 케이스들 요약
    successful_items = [r for r in results if r['status'] == 'success']
    if successful_items:
        print(f"\n=== 이미지 확보 성공 작품들 ===")
        for item in successful_items:
            api_data = item.get('api_data', {})
            print(f"- {item['title']} (ID: {item['id']})")
            print(f"  API 이름: {api_data.get('name', '')}")
            print(f"  이미지: {api_data.get('imageUrl', '')}")

if __name__ == "__main__":
    main()