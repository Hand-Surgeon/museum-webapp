#!/usr/bin/env python3

import requests
import json
import time
import urllib.parse

# 승인된 API 정보
SERVICE_KEY = "YcIMxgSOiCBtw1UZ2MksofNXaiqbyUY8w/JAKpLS9tb6xwUXQD5dcCevW9yJvBCLjnpTa9lmu1nWjmMefTzvDw=="
ENDPOINT = "www.emuseum.go.kr/openapi"

# 이용 가능한 API 기능들:
# 1. 코드 목록 조회
# 2. 소장품 목록 조회  
# 3. 소장품 상세 조회

def get_code_list():
    """코드 목록 조회 - 소장품 분류 코드 확인"""
    url = f"https://{ENDPOINT}/code/list"
    params = {
        'serviceKey': SERVICE_KEY,
        'returnType': 'json'
    }
    
    try:
        response = requests.get(url, params=params, timeout=15)
        print(f"코드 목록 조회 - Status: {response.status_code}")
        print(f"URL: {response.url}")
        print(f"응답: {response.text[:500]}...")
        
        if response.status_code == 200:
            try:
                data = response.json()
                return data
            except:
                print("JSON 파싱 실패")
        return None
        
    except Exception as e:
        print(f"코드 목록 조회 에러: {e}")
        return None

def search_relics(keyword="", page=1, size=10):
    """소장품 목록 조회"""
    url = f"https://{ENDPOINT}/relic/list"
    params = {
        'serviceKey': SERVICE_KEY,
        'returnType': 'json',
        'pageNo': page,
        'numOfRows': size
    }
    
    if keyword:
        params['name'] = keyword
    
    try:
        response = requests.get(url, params=params, timeout=15)
        print(f"소장품 목록 조회 - Status: {response.status_code}")
        print(f"검색어: {keyword}")
        print(f"URL: {response.url}")
        print(f"응답: {response.text[:500]}...")
        
        if response.status_code == 200:
            try:
                data = response.json()
                return data
            except:
                print("JSON 파싱 실패")
        return None
        
    except Exception as e:
        print(f"소장품 목록 조회 에러: {e}")
        return None

def get_relic_detail(relic_id):
    """소장품 상세 조회"""
    url = f"https://{ENDPOINT}/relic/detail"
    params = {
        'serviceKey': SERVICE_KEY,
        'id': relic_id,
        'returnType': 'json'
    }
    
    try:
        response = requests.get(url, params=params, timeout=15)
        print(f"소장품 상세 조회 - Status: {response.status_code}")
        print(f"ID: {relic_id}")
        print(f"응답: {response.text[:300]}...")
        
        if response.status_code == 200:
            try:
                data = response.json()
                return data
            except:
                print("JSON 파싱 실패")
        return None
        
    except Exception as e:
        print(f"소장품 상세 조회 에러: {e}")
        return None

def main():
    print("=== 국립중앙박물관 e뮤지엄 API 테스트 ===")
    print(f"엔드포인트: {ENDPOINT}")
    print(f"API 키: {SERVICE_KEY[:20]}...")
    print()
    
    # 1. 코드 목록 조회
    print("1. 코드 목록 조회 테스트...")
    codes = get_code_list()
    print("-" * 60)
    
    # 2. 소장품 목록 조회 (일반 검색)
    print("\n2. 소장품 목록 조회 테스트...")
    
    # 다양한 검색어로 테스트
    search_terms = ["토기", "금관", "청자", "불상"]
    
    for term in search_terms:
        print(f"\n검색어: {term}")
        results = search_relics(keyword=term, size=5)
        
        if results:
            print("검색 성공!")
            # 결과 구조 분석
            try:
                if 'response' in results:
                    body = results['response']['body']
                    total = body.get('totalCount', 0)
                    items = body.get('items', [])
                    
                    print(f"총 검색 결과: {total}개")
                    print(f"현재 페이지 결과: {len(items)}개")
                    
                    # 첫 번째 결과 상세 정보 가져오기
                    if items:
                        first_item = items[0]
                        item_id = first_item.get('id')
                        item_name = first_item.get('name', '이름없음')
                        
                        print(f"첫 번째 결과: {item_name} (ID: {item_id})")
                        
                        # 상세 정보 조회
                        if item_id:
                            print(f"\n상세 정보 조회 중...")
                            detail = get_relic_detail(item_id)
                            
                            if detail:
                                print("상세 조회 성공!")
                                # 이미지 정보 확인
                                try:
                                    detail_info = detail['response']['body']['items'][0]
                                    images = detail_info.get('imageList', [])
                                    print(f"이미지 개수: {len(images)}개")
                                    
                                    if images:
                                        print("이미지 URL:")
                                        for i, img in enumerate(images[:3]):  # 처음 3개만
                                            img_url = img.get('imgUrl', '')
                                            print(f"  {i+1}. {img_url}")
                                except Exception as e:
                                    print(f"상세 정보 파싱 에러: {e}")
                            
                            time.sleep(1)  # API 호출 간격
                            
                except Exception as e:
                    print(f"응답 파싱 에러: {e}")
        else:
            print("검색 실패")
            
        print("-" * 40)
        time.sleep(1)  # API 호출 간격

if __name__ == "__main__":
    main()