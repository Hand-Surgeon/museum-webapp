import os
import requests
import json
import time
import logging
from typing import Optional, Dict, Any
from requests.exceptions import RequestException, Timeout, ConnectionError

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("dotenv library not installed. Please install with 'pip install python-dotenv'.")
    print("Environment variables might not be loaded.")

# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('museum_api.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class MuseumAPIClient:
    """국립박물관 API 클라이언트"""
    
    def __init__(self):
        self.service_key = self._get_service_key()
        self.endpoint = "www.emuseum.go.kr/openapi"
        self.base_url = f"https://{self.endpoint}"
        self.timeout = 15
        
    def _get_service_key(self) -> str:
        """환경변수에서 API 키 가져오기"""
        service_key = os.getenv('MUSEUM_API_KEY')
        if not service_key:
            raise ValueError(
                "MUSEUM_API_KEY 환경변수가 설정되지 않았습니다. "
                "export MUSEUM_API_KEY='your_api_key' 명령으로 설정하세요."
            )
        return service_key
    
    def _make_request(self, endpoint: str, params: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """공통 API 요청 메서드"""
        url = f"{self.base_url}/{endpoint}"
        params['serviceKey'] = self.service_key
        params['returnType'] = 'json'
        
        try:
            logger.info(f"API 요청: {endpoint} - {params}")
            response = requests.get(url, params=params, timeout=self.timeout)
            response.raise_for_status()
            
            logger.info(f"응답 상태: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    logger.info("JSON 파싱 성공")
                    return data
                except json.JSONDecodeError as e:
                    logger.error(f"JSON 파싱 실패: {e}")
                    logger.error(f"응답 내용: {response.text[:500]}...")
                    return None
            else:
                logger.warning(f"예상치 못한 상태 코드: {response.status_code}")
                return None
                
        except Timeout:
            logger.error(f"요청 시간 초과 ({self.timeout}초)")
        except ConnectionError:
            logger.error("연결 오류 - 네트워크 상태를 확인하세요")
        except RequestException as e:
            logger.error(f"HTTP 요청 오류: {e}")
        except Exception as e:
            logger.error(f"예상치 못한 오류: {e}")
            
        return None
    
    def get_code_list(self) -> Optional[Dict[str, Any]]:
        """코드 목록 조회 - 소장품 분류 코드 확인"""
        return self._make_request("code/list", {})
    
    def search_relics(self, keyword: str = "", page: int = 1, size: int = 10) -> Optional[Dict[str, Any]]:
        """소장품 목록 조회"""
        params = {
            'pageNo': page,
            'numOfRows': size
        }
        if keyword:
            params['keyword'] = keyword
            
        return self._make_request("relic/list", params)
    
    def get_relic_detail(self, relic_id: str) -> Optional[Dict[str, Any]]:
        """소장품 상세 정보 조회"""
        params = {'id': relic_id}
        return self._make_request("relic/detail", params)

    def get_relic_detail_by_title(self, title: str) -> Optional[Dict[str, Any]]:
        """제목으로 소장품 상세 정보 조회"""
        logger.info(f"제목으로 소장품 검색: {title}")
        search_results = self.search_relics(keyword=title, size=1)
        
        if search_results and 'response' in search_results and 'body' in search_results['response'] and 'items' in search_results['response']['body']:
            items = search_results['response']['body']['items']
            if items:
                relic_id = items[0].get('id')
                if relic_id:
                    logger.info(f"검색된 유물 ID: {relic_id} (제목: {title})")
                    return self.get_relic_detail(relic_id)
                else:
                    logger.warning(f"검색 결과에 ID가 없습니다: {title}")
            else:
                logger.warning(f"검색 결과가 없습니다: {title}")
        else:
            logger.warning(f"API 응답 형식이 예상과 다릅니다 (제목 검색): {title}")
        return None
    
    def export_to_json(self, data: Dict[str, Any], filename: str) -> bool:
        """데이터를 JSON 파일로 저장"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            logger.info(f"데이터가 {filename}에 저장되었습니다.")
            return True
        except Exception as e:
            logger.error(f"파일 저장 실패: {e}")
            return False

ARTWORKS_JSON_PATH = 'src/data/artworks.json'

def read_artworks_from_json(file_path: str) -> list:
    """JSON 파일에서 작품 데이터를 읽어옵니다."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"오류: {file_path} 파일을 찾을 수 없습니다.")
        return []
    except json.JSONDecodeError as e:
        print(f"오류: {file_path} 파일 파싱 오류 - {e}")
        return []

def write_artworks_to_json(file_path: str, data: list):
    """업데이트된 작품 데이터를 JSON 파일에 씁니다."""
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"성공적으로 {file_path} 파일에 업데이트된 작품 데이터를 저장했습니다.")
    except Exception as e:
        print(f"오류: {file_path} 파일 저장 실패 - {e}")

def update_artworks_data_from_api(artworks_data: list, api_client: MuseumAPIClient) -> list:
    """API를 통해 작품 데이터를 업데이트합니다."""
    updated_count = 0
    for i, artwork in enumerate(artworks_data):
        print(f"[{i+1}/{len(artworks_data)}] 작품 업데이트 중: {artwork.get('title', '제목 없음')}")
        
        # 이미 imageUrl이 유효한 경우 건너뛰기 (선택 사항)
        # if artwork.get('imageUrl') and not "unsplash.com" in artwork['imageUrl']:
        #     print(f"  이미지 URL이 존재하여 건너뜁니다.")
        #     continue

        api_detail = api_client.get_relic_detail_by_title(artwork.get('title', ''))
        
        if api_detail and 'response' in api_detail and 'body' in api_detail['response'] and 'items' in api_detail['response']['body']:
            items = api_detail['response']['body']['items']
            if items:
                detail_info = items[0]
                
                # 이미지 URL 업데이트
                if 'imageList' in detail_info and detail_info['imageList']:
                    # 첫 번째 이미지 URL 사용
                    artwork['imageUrl'] = detail_info['imageList'][0].get('imgUrl', artwork.get('imageUrl'))
                    print(f"  이미지 URL 업데이트: {artwork['imageUrl'][:50]}...")
                
                # 추가 정보 업데이트 (예시)
                artwork['description'] = detail_info.get('content', artwork.get('description'))
                artwork['period'] = detail_info.get('eraName', artwork.get('period'))
                artwork['material'] = detail_info.get('material', artwork.get('material'))
                artwork['dimensions'] = detail_info.get('standard', artwork.get('dimensions'))
                artwork['museum'] = detail_info.get('museumName', artwork.get('museum'))
                artwork['inventoryNumber'] = detail_info.get('inventoryNum', artwork.get('inventoryNumber'))
                artwork['culturalProperty'] = detail_info.get('designation', artwork.get('culturalProperty'))
                
                # 상세 설명 필드 업데이트 (API에 해당 필드가 있다면)
                artwork['detailedDescription'] = detail_info.get('detailedContent', artwork.get('detailedDescription'))
                artwork['historicalBackground'] = detail_info.get('historicalBackground', artwork.get('historicalBackground'))
                artwork['artisticFeatures'] = detail_info.get('artisticFeatures', artwork.get('artisticFeatures'))
                artwork['significance'] = detail_info.get('significance', artwork.get('significance'))

                updated_count += 1
            else:
                print(f"  API에서 상세 정보를 찾을 수 없습니다: {artwork.get('title', '제목 없음')}")
        else:
            print(f"  API 호출 실패 또는 응답 형식 오류: {artwork.get('title', '제목 없음')}")
        
        # API 호출 간격 유지 (과도한 호출 방지)
        time.sleep(0.5) # 0.5초 대기
        
    print(f"총 {updated_count}개의 작품 정보가 API를 통해 업데이트되었습니다.")
    return artworks_data

if __name__ == "__main__":
    client = MuseumAPIClient()
    
    print("기존 작품 데이터를 JSON 파일에서 읽는 중...")
    artworks = read_artworks_from_json(ARTWORKS_JSON_PATH)
    
    if artworks:
        print(f"총 {len(artworks)}개의 작품 데이터를 읽었습니다. API를 통해 업데이트를 시작합니다...")
        updated_artworks = update_artworks_data_from_api(artworks, client)
        
        print("업데이트된 작품 데이터를 JSON 파일에 쓰는 중...")
        write_artworks_to_json(ARTWORKS_JSON_PATH, updated_artworks)
        print("작업 완료.")
    else:
        print("작품 데이터를 읽거나 파싱하는 데 실패했습니다. 스크립트를 종료합니다.")