"""
NMK_100_highlights.py
────────────────────────────────────────────────────────────────────
▶ 목적   : '국립중앙박물관 명품 100선'의 메타데이터·이미지를 e뮤지엄 Open API로
          수집해 CSV·JSON으로 저장
▶ 필요   : pandas, requests, openpyxl, tqdm  (자동 설치)
▶ 입력   : 공식 엑셀 목록  (EXCEL_URL 또는 로컬 업로드 파일)
▶ 출력   : nmk_100_highlights.csv  /  nmk_100_highlights.json
────────────────────────────────────────────────────────────────────
"""

# ── 0. 준비 ─────────────────────────────────────────────────────────
import sys, subprocess, io, os, json, textwrap

try:
    import pkg_resources
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "-q", "install", "setuptools"])
    import pkg_resources

def _pip(pkg):
    try:
        pkg_resources.get_distribution(pkg)
    except pkg_resources.DistributionNotFound:
        subprocess.check_call([sys.executable, "-m", "pip", "-q", "install", pkg])

for p in ("pandas", "requests", "openpyxl", "tqdm", "xlrd", "beautifulsoup4"): _pip(p)

import pandas as pd, requests, tqdm, time
from pathlib import Path
from bs4 import BeautifulSoup

# 국립중앙박물관 e뮤지엄 Open API 서비스키 (공공데이터포털에서 발급)
SERVICE_KEY = "YcIMxgSOiCBtw1UZ2MksofNXaiqbyUY8w%2FJAKpLS9tb6xwUXQD5dcCevW9yJvBCLjnpTa9lmu1nWjmMefTzvDw%3D%3D"

# 사용자 제공 CSV 파일 경로
DATA_PATH = "/Users/youngseoklee/Desktop/국중목록.csv"

def load_data(path: str) -> pd.DataFrame:
    if path.endswith('.xls') or path.endswith('.xlsx'):
        resp = requests.get(path, timeout=30)
        resp.raise_for_status()
        data = io.BytesIO(resp.content)
        df = pd.read_excel(data, header=2)
    elif path.endswith('.csv'):
        with open(path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
            header_line_index = -1
            for i, line in enumerate(lines):
                if "유물번호" in line and "유물명" in line:
                    header_line_index = i
                    break
            
            if header_line_index == -1:
                raise ValueError("Could not find header line in CSV file.")
            
            header_line = lines[header_line_index].strip()
            column_names = [c.strip() for c in header_line.split(',')]
            
            data_rows = []
            for line in lines[header_line_index + 1:]:
                if line.strip(): # Skip empty lines
                    data_rows.append([val.strip() for val in line.split(',')])
            
            df = pd.DataFrame(data_rows, columns=column_names)
    else:
        raise ValueError("Unsupported file format. Only .xls, .xlsx, and .csv are supported.")

    df = df.head(100)
    return df[["유물번호", "유물명"]]

# Excel 내려받기 URL (2005‑07‑19 알림 게시물 첨부 ID 7399) :contentReference[oaicite:0]{index=0}


# ── 1. 엑셀 목록 읽기 ───────────────────────────────────────────────


nmk_df = load_data(DATA_PATH)
print(f"목록 로드 완료 — {len(nmk_df)} 건")

# ── 2. e뮤지엄에서 상세 정보 가져오기 ───────────────────────────────
BASE = "https://www.emuseum.go.kr/openapi/relic"
HEADERS = {"Accept": "application/json"}

from typing import Union

def find_relic_id_by_web_search(title: str) -> Union[str, None]:
    search_url = f"https://www.emuseum.go.kr/search?keyword={title}"
    try:
        response = requests.get(search_url, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 검색 결과에서 첫 번째 유물의 상세 페이지 링크를 찾습니다.
        # e뮤지엄 웹사이트 구조에 따라 셀렉터를 조정해야 합니다。
        # 예시: <a href="/relic/detail/12345">...</a>
        first_result_link = soup.select_one('a[href*="/relic/detail/"]')
        
        if first_result_link:
            detail_url = first_result_link['href']
            # URL에서 유물 ID 추출
            relic_id = detail_url.split('/')[-1]
            return relic_id
        else:
            return None
    except requests.exceptions.RequestException as e:
        print(f"웹 검색 중 오류가 발생했습니다: {e}")
        return None

def fetch_detail(rid: str) -> dict:
    url = f"{BASE}/detail?serviceKey={SERVICE_KEY}&id={rid}&returnType=json"
    r = requests.get(url, timeout=15, headers=HEADERS).json()
    return r["response"]["body"]["items"][0]

records = []
print(f"nmk_df head before loop:\n{nmk_df.head()}")
for item_no, title in tqdm.tqdm(nmk_df.itertuples(index=False), total=len(nmk_df)):
    if pd.isna(item_no):
        continue
    
    cleaned_item_no = str(item_no).split('\n')[0].strip()
    if not cleaned_item_no or cleaned_item_no == 'nan' or cleaned_item_no == '유물번호':
        continue

    print(f"Searching for title: {title}")
    rid = find_relic_id_by_web_search(title) # 유물명으로 웹 검색
    if not rid:
        print(f"[WARN] ID 미확인 → 스킵: {cleaned_item_no} ({title})"); continue
    
    det = fetch_detail(rid)

    img = next((i["imgUrl"] for i in det.get("imageList", []) if "thumbnail" in i["imgUrl"]), "")
    records.append({
        "id"         : rid,
        "title_ko"   : det.get("name"),
        "title_en"   : det.get("nameEng"),
        "period"     : det.get("era"),
        "material"   : det.get("material"),
        "dimensions" : det.get("size"),
        "short_desc" : textwrap.shorten(det.get("description", ""), 180, placeholder="…"),
        "image_url"  : img,
        "license"    : det.get("copyright", {}).get("typeNm"),
        "item_no"    : cleaned_item_no
    })
    time.sleep(0.1)   # 우발적 과다 호출 방지

print(f"API 수집 완료 — {len(records)} 건")

# ── 3. 저장 ─────────────────────────────────────────────────────────
out_csv  = "nmk_100_highlights.csv"
out_json = "nmk_100_highlights.json"

pd.DataFrame(records).to_csv(out_csv,  index=False, encoding="utf-8")
pd.DataFrame(records).to_json(out_json, orient="records", indent=2, force_ascii=False)

print(f"\n✔️ 완료:  {out_csv}, {out_json} 두 파일이 생성되었습니다.")