#!/usr/bin/env python3

import json
import requests
import time
import sys

# 국립중앙박물관 e뮤지엄 Open API 서비스키
SERVICE_KEY = "YcIMxgSOiCBtw1UZ2MksofNXaiqbyUY8w%2FJAKpLS9tb6xwUXQD5dcCevW9yJvBCLjnpTa9lmu1nWjmMefTzvDw%3D%3D"
BASE_URL = "https://www.emuseum.go.kr/openapi/relic"

# 우리가 가진 소장품번호들 (첫 10개만 테스트)
inventory_numbers = [
    "암사123", "본관11377", "본관13972", "본관6255", "서울대22",
    "신수1794", "신수2580", "영남대2", "신수120", "공주633"
]

def find_relic_id(item_no):
    """소장품번호로 유물 ID 찾기"""
    url = f"{BASE_URL}/list?serviceKey={SERVICE_KEY}&manageNo={item_no}&numOfRows=1&returnType=json"
    try:
        response = requests.get(url, timeout=15)
        data = response.json()
        items = data.get("response", {}).get("body", {}).get("items", [])
        if items:
            return items[0].get("id")
    except Exception as e:
        print(f"Error finding ID for {item_no}: {e}")
    return None

def fetch_detail(relic_id):
    """유물 상세 정보 가져오기"""
    url = f"{BASE_URL}/detail?serviceKey={SERVICE_KEY}&id={relic_id}&returnType=json"
    try:
        response = requests.get(url, timeout=15)
        data = response.json()
        return data.get("response", {}).get("body", {}).get("items", [{}])[0]
    except Exception as e:
        print(f"Error fetching detail for {relic_id}: {e}")
    return {}

results = []

print("국립중앙박물관 Open API에서 실제 이미지 URL 가져오는 중...")

for i, item_no in enumerate(inventory_numbers):
    print(f"[{i+1}/{len(inventory_numbers)}] {item_no} 검색 중...")
    
    # 1. 유물 ID 찾기
    relic_id = find_relic_id(item_no)
    if not relic_id:
        print(f"  → ID를 찾을 수 없습니다: {item_no}")
        continue
    
    # 2. 상세 정보 가져오기
    detail = fetch_detail(relic_id)
    if not detail:
        print(f"  → 상세 정보를 가져올 수 없습니다: {item_no}")
        continue
    
    # 3. 이미지 URL 추출
    image_url = ""
    image_list = detail.get("imageList", [])
    for img in image_list:
        if "thumbnail" not in img.get("imgUrl", ""):  # 원본 이미지 우선
            image_url = img.get("imgUrl", "")
            break
    
    if not image_url and image_list:  # 원본이 없으면 썸네일이라도
        image_url = image_list[0].get("imgUrl", "")
    
    result = {
        "inventory_number": item_no,
        "relic_id": relic_id,
        "title": detail.get("name", ""),
        "period": detail.get("era", ""),
        "material": detail.get("material", ""),
        "dimensions": detail.get("size", ""),
        "description": detail.get("description", ""),
        "image_url": image_url
    }
    
    results.append(result)
    print(f"  → 성공: {detail.get('name', '')} ({image_url[:50]}...)")
    
    # API 호출 제한 고려
    time.sleep(0.5)

# 결과 저장
with open("museum_images.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\n완료! {len(results)}개 유물의 정보를 museum_images.json에 저장했습니다.")

# 결과 요약 출력
for result in results:
    print(f"- {result['title']} ({result['inventory_number']})")
    if result['image_url']:
        print(f"  이미지: {result['image_url']}")
    else:
        print(f"  이미지: 없음")