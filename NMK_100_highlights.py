


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

import pandas as pd, requests, tqdm, time, urllib.parse

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

def find_relic_by_name(title: str) -> Union[dict, None]:
    q = urllib.parse.quote(title)
    url = f"{BASE}/list?serviceKey={SERVICE_KEY}&name={q}&numOfRows=1"
    try:
        r = requests.get(url, headers=HEADERS, timeout=15).json()
        if r.get("resultCode") == "00": # API 호출 성공 시
            if r["response"]["body"]["items"]:
                return r["response"]["body"]["items"][0]
            else:
                print(f"API 응답에 유물 정보가 없습니다: {r}")
                return None
        else:
            # Simplify the f-string to avoid syntax issues
            error_msg = r.get("resultMsg", "알 수 없는 오류")
            print(f"API 오류 발생: {error_msg}. 응답: {r}")
            return None
    except (KeyError, IndexError, requests.exceptions.RequestException) as e:
        print(f"API 요청 중 오류가 발생했습니다: {e}. 응답: {r if 'r' in locals() else '응답 없음'}")
        return None

records = []
for item_no, title in tqdm.tqdm(nmk_df.itertuples(index=False), total=len(nmk_df)):
    if pd.isna(item_no) or pd.isna(title) or title is None:
        continue
    
    cleaned_item_no = str(item_no).split('\n')[0].strip()
    if not cleaned_item_no or cleaned_item_no == 'nan' or cleaned_item_no == '유물번호':
        continue

    best = find_relic_by_name(str(title)) # 유물명으로 API 검색

    if not best:
        print(f"[WARN] API 미확인 → 스킵: {cleaned_item_no} ({title})"); continue
    
    records.append({
        "id"         : best["id"],
        "title_ko"   : best.get("name"),
        "title_en"   : best.get("nameEng"),
        "period"     : best.get("era"),
        "material"   : best.get("material"),
        "dimensions" : best.get("size"),
        "short_desc" : textwrap.shorten(best.get("description", ""), 180, placeholder="…"),
        "image_url"  : best.get("imgPath"), # imgPath 사용
        "license"    : best.get("copyright", {}).get("typeNm", "KOGL Type 1"), # API에서 라이선스 가져오기
        "item_no"    : cleaned_item_no
    })
    time.sleep(0.2)   # 과도한 동시 호출 방지

print(f"API 수집 완료 — {len(records)} 건")

# 3. 저장
out_csv  = "nmk_100_highlights.csv"
out_json = "nmk_100_highlights.json"

pd.DataFrame(records).to_csv(out_csv,  index=False, encoding="utf-8")
pd.DataFrame(records).to_json(out_json, orient="records", indent=2, force_ascii=False)

print(f"\n✔️ 완료:  {out_csv}, {out_json} 두 파일이 생성되었습니다.")
