#!/usr/bin/env python3

import requests
import json
import urllib.parse

# 디코딩된 API 키 사용
SERVICE_KEY_RAW = "YcIMxgSOiCBtw1UZ2MksofNXaiqbyUY8w/JAKpLS9tb6xwUXQD5dcCevW9yJvBCLjnpTa9lmu1nWjmMefTzvDw=="
SERVICE_KEY = urllib.parse.quote(SERVICE_KEY_RAW, safe='')

BASE_URL = "https://www.emuseum.go.kr/openapi/relic"

# 테스트할 소장품번호들
test_numbers = ["암사123", "본관6255", "신수2580", "공주633", "부여5333"]

print("디코딩된 API 키로 테스트...")
print(f"원본 키: {SERVICE_KEY_RAW}")
print(f"인코딩된 키: {SERVICE_KEY}")
print("="*80)

for i, item_no in enumerate(test_numbers):
    print(f"\n[{i+1}] {item_no} 테스트...")
    
    # URL 구성 (소장품번호도 인코딩)
    encoded_item = urllib.parse.quote(item_no, safe='')
    url = f"{BASE_URL}/list?serviceKey={SERVICE_KEY}&manageNo={encoded_item}&numOfRows=5&returnType=json"
    
    print(f"URL: {url}")
    
    try:
        response = requests.get(url, timeout=15)
        print(f"Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type', 'unknown')}")
        
        # 응답 내용 확인
        content = response.text
        print(f"응답 길이: {len(content)} 문자")
        print(f"응답 시작: {content[:200]}...")
        
        # JSON 파싱 시도
        if 'json' in response.headers.get('content-type', ''):
            try:
                data = response.json()
                print(f"JSON 파싱 성공!")
                
                # 구조 확인
                if 'response' in data:
                    body = data.get('response', {}).get('body', {})
                    total_count = body.get('totalCount', 0)
                    items = body.get('items', [])
                    
                    print(f"총 검색 결과: {total_count}개")
                    if items:
                        print(f"첫 번째 아이템: {items[0].get('name', '이름없음')}")
                        print(f"유물 ID: {items[0].get('id', '없음')}")
                    else:
                        print("검색 결과 없음")
                else:
                    print(f"응답 구조: {list(data.keys())}")
                    
            except json.JSONDecodeError as e:
                print(f"JSON 파싱 실패: {e}")
        else:
            print("JSON이 아닌 응답")
            
    except Exception as e:
        print(f"요청 실패: {e}")
    
    print("-" * 50)