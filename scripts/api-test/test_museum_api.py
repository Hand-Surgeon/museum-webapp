#!/usr/bin/env python3

import requests
import json
import time

# API 정보
SERVICE_KEY = "YcIMxgSOiCBtw1UZ2MksofNXaiqbyUY8w/JAKpLS9tb6xwUXQD5dcCevW9yJvBCLjnpTa9lmu1nWjmMefTzvDw=="
BASE_URL = "https://www.emuseum.go.kr/openapi"

def test_relic_search():
    """소장품 목록 조회 테스트"""
    print("=== 소장품 목록 조회 테스트 ===")
    
    # 다양한 검색어로 테스트
    search_terms = ["토기", "금관", "청자", "불상", "빗살무늬"]
    
    for term in search_terms:
        print(f"\n검색어: {term}")
        
        url = f"{BASE_URL}/relic/list"
        params = {
            'serviceKey': SERVICE_KEY,
            'name': term,
            'numOfRows': 5,
            'pageNo': 1,
            'returnType': 'json'
        }
        
        try:
            response = requests.get(url, params=params, timeout=15)
            print(f"Status: {response.status_code}")
            print(f"URL: {response.url}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    
                    # 응답 구조 확인
                    if 'response' in data:
                        body = data['response']['body']
                        total_count = body.get('totalCount', 0)
                        items = body.get('items', [])
                        
                        print(f"총 검색 결과: {total_count}개")
                        print(f"현재 페이지 결과: {len(items)}개")
                        
                        # 첫 번째 결과 정보
                        if items:
                            first = items[0]
                            print(f"첫 번째 결과:")
                            print(f"  이름: {first.get('name', '없음')}")
                            print(f"  ID: {first.get('id', '없음')}")
                            print(f"  시대: {first.get('era', '없음')}")
                            print(f"  재질: {first.get('material', '없음')}")
                            
                            # 첫 번째 결과의 상세 정보 조회
                            relic_id = first.get('id')
                            if relic_id:
                                print(f"\n상세 정보 조회 중... (ID: {relic_id})")
                                detail_info = get_relic_detail(relic_id)
                                if detail_info:
                                    print("상세 조회 성공!")
                                
                        else:
                            print("검색 결과 없음")
                    else:
                        print(f"예상과 다른 응답 구조: {list(data.keys())}")
                        
                except json.JSONDecodeError as e:
                    print(f"JSON 파싱 실패: {e}")
                    print(f"응답 내용: {response.text[:200]}...")
                    
            else:
                print(f"HTTP 에러: {response.status_code}")
                print(f"응답 내용: {response.text[:200]}...")
                
        except Exception as e:
            print(f"요청 실패: {e}")
            
        print("-" * 50)
        time.sleep(1)  # API 호출 간격

def get_relic_detail(relic_id):
    """소장품 상세 조회"""
    url = f"{BASE_URL}/relic/detail"
    params = {
        'serviceKey': SERVICE_KEY,
        'id': relic_id,
        'returnType': 'json'
    }
    
    try:
        response = requests.get(url, params=params, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            
            if 'response' in data:
                body = data['response']['body']
                items = body.get('items', [])
                
                if items:
                    detail = items[0]
                    print(f"  상세 이름: {detail.get('name', '없음')}")
                    print(f"  설명: {detail.get('description', '없음')[:100]}...")
                    
                    # 이미지 정보
                    images = detail.get('imageList', [])
                    print(f"  이미지 개수: {len(images)}개")
                    
                    if images:
                        print(f"  첫 번째 이미지: {images[0].get('imgUrl', '없음')}")
                        
                        # 실제 사용 가능한 이미지 저장
                        image_data = {
                            'relic_id': relic_id,
                            'name': detail.get('name', ''),
                            'images': [img.get('imgUrl', '') for img in images if img.get('imgUrl')]
                        }
                        
                        # JSON 파일에 저장
                        try:
                            with open('found_images.json', 'a', encoding='utf-8') as f:
                                f.write(json.dumps(image_data, ensure_ascii=False) + '\n')
                        except:
                            pass
                            
                    return True
                    
    except Exception as e:
        print(f"  상세 조회 실패: {e}")
        
    return False

def test_code_list():
    """코드 목록 조회 테스트"""
    print("=== 코드 목록 조회 테스트 ===")
    
    url = f"{BASE_URL}/code/list"
    params = {
        'serviceKey': SERVICE_KEY,
        'returnType': 'json'
    }
    
    try:
        response = requests.get(url, params=params, timeout=15)
        print(f"Status: {response.status_code}")
        print(f"응답: {response.text[:300]}...")
        
    except Exception as e:
        print(f"에러: {e}")

if __name__ == "__main__":
    print("국립중앙박물관 e뮤지엄 API 테스트")
    print(f"엔드포인트: {BASE_URL}")
    print()
    
    # 코드 목록 조회 테스트
    test_code_list()
    print()
    
    # 소장품 검색 테스트
    test_relic_search()
    
    print("\n테스트 완료!")