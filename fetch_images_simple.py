#!/usr/bin/env python3

import urllib.request
import urllib.parse
import json
import time

# 국립중앙박물관 e뮤지엄 Open API 서비스키
SERVICE_KEY = "YcIMxgSOiCBtw1UZ2MksofNXaiqbyUY8w%2FJAKpLS9tb6xwUXQD5dcCevW9yJvBCLjnpTa9lmu1nWjmMefTzvDw%3D%3D"
BASE_URL = "https://www.emuseum.go.kr/openapi/relic"

# 실제 소장품번호 몇 개만 테스트
test_items = [
    {"inventory": "암사123", "title": "빗살무늬토기"},
    {"inventory": "본관6255", "title": "귀걸이"},
    {"inventory": "신수2580", "title": "방울"},
    {"inventory": "공주633", "title": "관꽂이"},
    {"inventory": "부여5333", "title": "백제금동대향로"}
]

def fetch_url(url):
    """URL에서 JSON 데이터 가져오기"""
    try:
        with urllib.request.urlopen(url, timeout=15) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"URL 요청 실패: {e}")
        return None

def find_relic_id(item_no):
    """소장품번호로 유물 ID 찾기"""
    encoded_item = urllib.parse.quote(item_no)
    url = f"{BASE_URL}/list?serviceKey={SERVICE_KEY}&manageNo={encoded_item}&numOfRows=1&returnType=json"
    
    data = fetch_url(url)
    if data:
        try:
            items = data["response"]["body"]["items"]
            if items:
                return items[0]["id"]
        except (KeyError, IndexError):
            pass
    return None

def fetch_detail(relic_id):
    """유물 상세 정보 가져오기"""
    url = f"{BASE_URL}/detail?serviceKey={SERVICE_KEY}&id={relic_id}&returnType=json"
    
    data = fetch_url(url)
    if data:
        try:
            return data["response"]["body"]["items"][0]
        except (KeyError, IndexError):
            pass
    return {}

print("국립중앙박물관 Open API 테스트 중...")

results = []

for i, item in enumerate(test_items):
    item_no = item["inventory"]
    expected_title = item["title"]
    
    print(f"\n[{i+1}/{len(test_items)}] {item_no} ({expected_title}) 검색 중...")
    
    # 1. 유물 ID 찾기
    relic_id = find_relic_id(item_no)
    if not relic_id:
        print(f"  → ID를 찾을 수 없습니다")
        continue
    
    print(f"  → 유물 ID: {relic_id}")
    
    # 2. 상세 정보 가져오기
    detail = fetch_detail(relic_id)
    if not detail:
        print(f"  → 상세 정보를 가져올 수 없습니다")
        continue
    
    # 3. 정보 추출
    title = detail.get("name", "")
    period = detail.get("era", "")
    material = detail.get("material", "")
    description = detail.get("description", "")
    
    # 4. 이미지 URL 찾기
    image_url = ""
    image_list = detail.get("imageList", [])
    
    for img in image_list:
        img_url = img.get("imgUrl", "")
        if img_url and "thumbnail" not in img_url.lower():
            image_url = img_url
            break
    
    if not image_url and image_list:
        image_url = image_list[0].get("imgUrl", "")
    
    result = {
        "inventory_number": item_no,
        "expected_title": expected_title,
        "actual_title": title,
        "period": period,
        "material": material,
        "description": description[:200] + "..." if len(description) > 200 else description,
        "image_url": image_url,
        "relic_id": relic_id
    }
    
    results.append(result)
    
    print(f"  → 제목: {title}")
    print(f"  → 시대: {period}")
    print(f"  → 재질: {material}")
    if image_url:
        print(f"  → 이미지: {image_url[:80]}...")
    else:
        print(f"  → 이미지: 없음")
    
    # API 호출 제한 고려
    time.sleep(1)

# 결과 저장
with open("api_test_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\n=== 테스트 완료 ===")
print(f"성공: {len(results)}개 / 총 {len(test_items)}개")
print("결과가 api_test_results.json에 저장되었습니다.")

# 이미지 URL이 있는 항목들 요약
image_count = sum(1 for r in results if r["image_url"])
print(f"실제 이미지 URL 확보: {image_count}개")

if image_count > 0:
    print("\n=== 실제 이미지가 있는 유물들 ===")
    for result in results:
        if result["image_url"]:
            print(f"- {result['actual_title']} ({result['inventory_number']})")
            print(f"  {result['image_url']}")