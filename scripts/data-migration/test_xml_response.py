#!/usr/bin/env python3

import requests
import urllib.parse
import xml.etree.ElementTree as ET

# API 설정
SERVICE_KEY_RAW = "YcIMxgSOiCBtw1UZ2MksofNXaiqbyUY8w/JAKpLS9tb6xwUXQD5dcCevW9yJvBCLjnpTa9lmu1nWjmMefTzvDw=="
SERVICE_KEY = urllib.parse.quote(SERVICE_KEY_RAW, safe='')
BASE_URL = "https://www.emuseum.go.kr/openapi/relic"

def test_api_call(item_no):
    """API 호출 테스트"""
    encoded_item = urllib.parse.quote(item_no, safe='')
    url = f"{BASE_URL}/list?serviceKey={SERVICE_KEY}&manageNo={encoded_item}&numOfRows=5&returnType=json"
    
    print(f"\n테스트: {item_no}")
    print(f"URL: {url}")
    
    try:
        response = requests.get(url, timeout=15)
        print(f"Status: {response.status_code}")
        
        # XML 파싱
        root = ET.fromstring(response.text)
        
        # 기본 정보 추출
        result_code = root.find('resultCode')
        result_msg = root.find('resultMsg')
        total_count = root.find('totalCount')
        
        print(f"Result Code: {result_code.text if result_code is not None else 'None'}")
        print(f"Result Message: {result_msg.text if result_msg is not None else 'None'}")
        print(f"Total Count: {total_count.text if total_count is not None else 'None'}")
        
        # 아이템들 확인
        items = root.find('items')
        if items is not None and len(items) > 0:
            print(f"발견된 아이템: {len(items)}개")
            for i, item in enumerate(items):
                print(f"  아이템 {i+1}:")
                for child in item:
                    print(f"    {child.tag}: {child.text}")
        else:
            print("아이템 없음")
            
        return root
        
    except Exception as e:
        print(f"에러: {e}")
        return None

# 테스트할 소장품번호들
test_numbers = ["암사123", "본관6255", "신수2580"]

print("=== XML 응답 파싱 테스트 ===")

for item_no in test_numbers:
    result = test_api_call(item_no)
    print("-" * 60)

# 일반적인 검색어로도 테스트
print("\n=== 일반 검색어 테스트 ===")
general_terms = ["토기", "금관", "청자"]

for term in general_terms:
    encoded_term = urllib.parse.quote(term, safe='')
    url = f"{BASE_URL}/list?serviceKey={SERVICE_KEY}&name={encoded_term}&numOfRows=3&returnType=json"
    
    print(f"\n검색어: {term}")
    print(f"URL: {url}")
    
    try:
        response = requests.get(url, timeout=15)
        root = ET.fromstring(response.text)
        
        total_count = root.find('totalCount')
        result_code = root.find('resultCode')
        
        print(f"Total Count: {total_count.text if total_count is not None else 'None'}")
        print(f"Result Code: {result_code.text if result_code is not None else 'None'}")
        
        # 첫 번째 아이템만 확인
        items = root.find('items')
        if items is not None and len(items) > 0:
            first_item = items[0]
            name = first_item.find('name')
            item_id = first_item.find('id')
            print(f"첫 번째 결과: {name.text if name is not None else 'None'} (ID: {item_id.text if item_id is not None else 'None'})")
        
    except Exception as e:
        print(f"에러: {e}")
        
    print("-" * 40)