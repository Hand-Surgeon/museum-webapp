#!/usr/bin/env python3

import requests

# API 테스트
SERVICE_KEY = "YcIMxgSOiCBtw1UZ2MksofNXaiqbyUY8w%2FJAKpLS9tb6xwUXQD5dcCevW9yJvBCLjnpTa9lmu1nWjmMefTzvDw%3D%3D"
BASE_URL = "https://www.emuseum.go.kr/openapi/relic"

# 테스트 URL 구성
test_url = f"{BASE_URL}/list?serviceKey={SERVICE_KEY}&manageNo=암사123&numOfRows=1&returnType=json"

print("API 테스트 URL:")
print(test_url)
print("\n" + "="*80)

try:
    response = requests.get(test_url, timeout=15)
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    print(f"Raw Response: {response.text[:500]}...")
    
    if response.headers.get('content-type', '').startswith('application/json'):
        try:
            json_data = response.json()
            print(f"JSON Data: {json_data}")
        except Exception as e:
            print(f"JSON 파싱 에러: {e}")
    
except Exception as e:
    print(f"Request 에러: {e}")

# 간단한 테스트로 다른 소장품번호도 시도
test_numbers = ["본관6255", "신수2580"]
for num in test_numbers:
    url = f"{BASE_URL}/list?serviceKey={SERVICE_KEY}&manageNo={num}&numOfRows=1&returnType=json"
    print(f"\n테스트: {num}")
    try:
        resp = requests.get(url, timeout=10)
        print(f"  Status: {resp.status_code}, Content: {resp.text[:100]}...")
    except Exception as e:
        print(f"  에러: {e}")