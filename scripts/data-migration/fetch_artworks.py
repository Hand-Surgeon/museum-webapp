
import requests
import json
import os

# e뮤지엄 Open API 설정
API_KEY = "YOUR_API_KEY"  # 실제 발급받은 API 키로 교체해야 합니다.
BASE_URL = "https://www.emuseum.go.kr/openapi/relic"

def fetch_artworks():
    # "국립중앙박물관 100선" 필터에 해당하는 코드나 파라미터를 찾아야 합니다.
    # 우선은 예시로 전체 데이터를 요청하는 URL을 사용합니다.
    # 실제 구현에서는 100선 필터링 방법을 찾아 적용해야 합니다.
    params = {
        "serviceKey": API_KEY,
        "pageNo": 1,
        "numOfRows": 100,  # 우선 100개 요청
        "sort": "ACQ_DATE_DESC" # 예시 정렬 기준
    }

    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()  # 오류 발생 시 예외 처리
        data = response.json()

        # 수집된 데이터를 파일로 저장
        with open("artworks_meta.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        print("e뮤지엄 데이터를 성공적으로 가져와 artworks_meta.json 파일로 저장했습니다.")

        # 이미지 다운로드 로직 추가 (별도 함수로 분리 예정)
        # download_images(data)

    except requests.exceptions.RequestException as e:
        print(f"API 요청 중 오류가 발생했습니다: {e}")
    except json.JSONDecodeError:
        print("API 응답을 JSON으로 파싱하는 데 실패했습니다.")
    except Exception as e:
        print(f"알 수 없는 오류가 발생했습니다: {e}")

if __name__ == "__main__":
    fetch_artworks()
