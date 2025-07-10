#!/usr/bin/env python3

import requests
import xml.etree.ElementTree as ET
import json

# API 정보
SERVICE_KEY = "YcIMxgSOiCBtw1UZ2MksofNXaiqbyUY8w/JAKpLS9tb6xwUXQD5dcCevW9yJvBCLjnpTa9lmu1nWjmMefTzvDw=="
BASE_URL = "https://www.emuseum.go.kr/openapi"

def search_with_xml_parse(search_term):
    """XML 응답을 파싱해서 실제 데이터 확인"""
    print(f"\n=== {search_term} 검색 ===")
    
    url = f"{BASE_URL}/relic/list"
    params = {
        'serviceKey': SERVICE_KEY,
        'name': search_term,
        'numOfRows': 10,
        'pageNo': 1,
        'returnType': 'json'  # 요청은 JSON이지만 XML이 올 것으로 예상
    }
    
    try:
        response = requests.get(url, params=params, timeout=15)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            # XML 파싱
            root = ET.fromstring(response.text)
            
            # 기본 정보 추출
            result_code = root.find('resultCode')
            result_msg = root.find('resultMsg')
            total_count = root.find('totalCount')
            
            print(f"Result Code: {result_code.text if result_code is not None else 'None'}")
            print(f"Result Message: {result_msg.text if result_msg is not None else 'None'}")
            print(f"Total Count: {total_count.text if total_count is not None else 'None'}")
            
            # items 찾기
            items_elem = root.find('items')
            if items_elem is not None:
                items = list(items_elem)
                print(f"검색된 아이템 수: {len(items)}개")
                
                # 각 아이템 정보 출력
                for i, item in enumerate(items[:3]):  # 처음 3개만
                    print(f"\n아이템 {i+1}:")
                    item_data = {}
                    
                    for child in item:
                        value = child.text if child.text else ''
                        item_data[child.tag] = value
                        print(f"  {child.tag}: {value}")
                    
                    # 상세 정보 조회 시도
                    item_id = item_data.get('id')
                    if item_id:
                        print(f"\n  상세 정보 조회 중... (ID: {item_id})")
                        detail_info = get_detail_with_xml(item_id)
                        
                        if detail_info and 'imageList' in detail_info:
                            images = detail_info['imageList']
                            print(f"  이미지 개수: {len(images)}개")
                            
                            if images:
                                # 실제 이미지 URL 저장
                                save_image_info(item_data.get('name', ''), item_id, images)
                
            else:
                print("검색 결과 없음")
                
    except Exception as e:
        print(f"에러: {e}")

def get_detail_with_xml(relic_id):
    """상세 정보를 XML로 파싱"""
    url = f"{BASE_URL}/relic/detail"
    params = {
        'serviceKey': SERVICE_KEY,
        'id': relic_id,
        'returnType': 'json'
    }
    
    try:
        response = requests.get(url, params=params, timeout=15)
        
        if response.status_code == 200:
            root = ET.fromstring(response.text)
            
            # items 찾기
            items_elem = root.find('items')
            if items_elem is not None and len(items_elem) > 0:
                item = items_elem[0]
                
                detail_data = {}
                for child in item:
                    if child.tag == 'imageList':
                        # 이미지 리스트 파싱
                        images = []
                        for img_item in child:
                            img_data = {}
                            for img_child in img_item:
                                img_data[img_child.tag] = img_child.text
                            images.append(img_data)
                        detail_data['imageList'] = images
                    else:
                        detail_data[child.tag] = child.text
                
                return detail_data
                
    except Exception as e:
        print(f"  상세 조회 에러: {e}")
    
    return None

def save_image_info(name, relic_id, images):
    """실제 이미지 정보를 파일에 저장"""
    image_info = {
        'name': name,
        'relic_id': relic_id,
        'images': []
    }
    
    for img in images:
        img_url = img.get('imgUrl', '')
        if img_url:
            image_info['images'].append(img_url)
            print(f"    이미지: {img_url}")
    
    # JSON 파일에 추가
    try:
        with open('museum_images_found.json', 'a', encoding='utf-8') as f:
            f.write(json.dumps(image_info, ensure_ascii=False) + '\n')
    except:
        pass

def main():
    print("국립중앙박물관 API XML 응답 파싱 테스트")
    
    # 다양한 검색어로 테스트
    search_terms = ["토기", "금관", "청자", "불상", "빗살무늬토기"]
    
    for term in search_terms:
        search_with_xml_parse(term)
        print("-" * 80)

if __name__ == "__main__":
    main()