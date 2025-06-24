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
import sys, subprocess, importlib, io, os, json, textwrap

def _pip(pkg):
    if importlib.util.find_spec(pkg) is None:
        subprocess.check_call([sys.executable, "-m", "pip", "-q", "install", pkg])

for p in ("pandas", "requests", "openpyxl", "tqdm"): _pip(p)

import pandas as pd, requests, tqdm, time
from pathlib import Path

# 국립중앙박물관 e뮤지엄 Open API 서비스키 (공공데이터포털에서 발급)
SERVICE_KEY = "YcIMxgSOiCBtw1UZ2MksofNXaiqbyUY8w%2FJAKpLS9tb6xwUXQD5dcCevW9yJvBCLjnpTa9lmu1nWjmMefTzvDw%3D%3D"

# Excel 내려받기 URL (2005‑07‑19 알림 게시물 첨부 ID 7399) :contentReference[oaicite:0]{index=0}
EXCEL_URL = "https://www.museum.go.kr/afile/fileDownloadById/7399"

# ── 1. 엑셀 목록 읽기 ───────────────────────────────────────────────
def load_excel(url_or_path: str) -> pd.DataFrame:
    if url_or_path:
        resp = requests.get(url_or_path, timeout=30)
        resp.raise_for_status()
        data = io.BytesIO(resp.content)
    else:                     # 사용자가 직접 올린 파일 선택
        path = next(Path(".").glob("*.xls*"))
        data = path
    df = pd.read_excel(data, header=0)
    # 컬럼명 정리 (엑셀 원본은 '소장품번호'·'명칭' 등)
    df.columns = [c.strip() for c in df.columns]
    df = df.head(100)        # 안전장치: 100개 초과 시 잘라내기
    return df[["소장품번호", "명칭"]]

nmk_df = load_excel(EXCEL_URL)
print(f"목록 로드 완료 — {len(nmk_df)} 건")

# ── 2. e뮤지엄에서 상세 정보 가져오기 ───────────────────────────────
BASE = "https://www.emuseum.go.kr/openapi/relic"
HEADERS = {"Accept": "application/json"}

def find_relic_id(item_no: str) -> str | None:
    """소장품번호만 알고 있는 경우 목록 API로 ID 탐색 (1 회 쿼리)"""
    url = f"{BASE}/list?serviceKey={SERVICE_KEY}&manageNo={item_no}&numOfRows=1&returnType=json"
    r = requests.get(url, timeout=15, headers=HEADERS).json()
    try:
        return r["response"]["body"]["items"][0]["id"]
    except (KeyError, IndexError):
        return None

def fetch_detail(rid: str) -> dict:
    url = f"{BASE}/detail?serviceKey={SERVICE_KEY}&id={rid}&returnType=json"
    r = requests.get(url, timeout=15, headers=HEADERS).json()
    return r["response"]["body"]["items"][0]

records = []
for item_no, title in tqdm.tqdm(nmk_df.itertuples(index=False), total=len(nmk_df)):
    rid = find_relic_id(item_no)
    if not rid:
        print(f"[WARN] ID 미확인 → 스킵: {item_no} ({title})"); continue
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
        "item_no"    : item_no
    })
    time.sleep(0.1)   # 우발적 과다 호출 방지

print(f"API 수집 완료 — {len(records)} 건")

# ── 3. 저장 ─────────────────────────────────────────────────────────
out_csv  = "nmk_100_highlights.csv"
out_json = "nmk_100_highlights.json"

pd.DataFrame(records).to_csv(out_csv,  index=False, encoding="utf-8")
pd.DataFrame(records).to_json(out_json, orient="records", indent=2, force_ascii=False)

print(f"\n✔️ 완료:  {out_csv}, {out_json} 두 파일이 생성되었습니다.")