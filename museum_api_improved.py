#!/usr/bin/env python3

import os
import requests
import json
import time
import logging
from typing import Optional, Dict, Any
from requests.exceptions import RequestException, Timeout, ConnectionError

# 로깅 설정
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
    
    def search_relics_by_category(self, category: str, page: int = 1, size: int = 10) -> Optional[Dict[str, Any]]:
        """카테고리별 소장품 조회"""
        params = {
            'category': category,
            'pageNo': page,
            'numOfRows': size
        }
        return self._make_request("relic/list", params)
    
    def get_relic_detail(self, relic_id: str) -> Optional[Dict[str, Any]]:
        """소장품 상세 정보 조회"""
        params = {'id': relic_id}
        return self._make_request("relic/detail", params)
    
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

def main():
    """메인 실행 함수"""
    try:
        client = MuseumAPIClient()
        
        # 코드 목록 조회
        logger.info("=== 코드 목록 조회 ===")
        code_data = client.get_code_list()
        if code_data:
            client.export_to_json(code_data, 'museum_codes.json')
        
        # 소장품 검색 예시
        logger.info("=== 소장품 검색 (키워드: 청자) ===")
        search_data = client.search_relics("청자", page=1, size=20)
        if search_data:
            client.export_to_json(search_data, 'museum_celadon.json')
        
        # 카테고리별 검색 예시
        logger.info("=== 카테고리별 검색 ===")
        category_data = client.search_relics_by_category("도자기", page=1, size=30)
        if category_data:
            client.export_to_json(category_data, 'museum_ceramics.json')
            
    except Exception as e:
        logger.error(f"실행 중 오류 발생: {e}")

if __name__ == "__main__":
    main()