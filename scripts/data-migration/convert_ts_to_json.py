import json
import re
import ast

ARTWORKS_TS_PATH = 'src/data/artworks-data.ts'
ARTWORKS_JSON_PATH = 'src/data/artworks.json'

def convert_ts_to_json(ts_file_path: str, json_file_path: str):
    """TypeScript 파일에서 artworksData 배열을 추출하여 JSON 파일로 변환합니다."""
    try:
        with open(ts_file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # artworksData 배열 부분을 정확히 추출
        # 'export const artworksData: Artwork[] = ' 다음에 오는 '['부터 마지막 '];'까지 캡처
        # re.DOTALL 플래그를 사용하여 '.'이 줄바꿈 문자도 포함하도록 함
        match = re.search(r"export const artworksData: Artwork\[\] =(\s*\[[\s\S]*?\]);", content, re.DOTALL)
        if not match:
            print(f"오류: {ts_file_path} 파일에서 artworksData 배열을 찾을 수 없습니다.")
            return

        js_array_str = match.group(1).strip()

        # JavaScript/TypeScript 문법을 Python 리터럴에 가깝게 전처리
        # 1. 주석 제거 (// 및 /* */)
        js_array_str = re.sub(r'//.*\n', '\n', js_array_str) # 단일 라인 주석
        js_array_str = re.sub(r'/\*.*?\*/', '', js_array_str, flags=re.DOTALL) # 멀티라인 주석

        # 2. JavaScript 불리언/null을 Python 불리언/None으로 변환
        js_array_str = re.sub(r'\btrue\b', 'True', js_array_str)
        js_array_str = re.sub(r'\bfalse\b', 'False', js_array_str)
        js_array_str = re.sub(r'\bnull\b', 'None', js_array_str)

        # 3. 따옴표 없는 키에 따옴표 추가 (JSON 유효하게)
        # 이 정규식은 이미 따옴표가 있는 키는 건드리지 않습니다.
        js_array_str = re.sub(r'([{\,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*):\s*', r'\1"\2":', js_array_str)

        # 4. 작은따옴표로 감싸진 문자열을 큰따옴표로 변환
        js_array_str = re.sub(r"'(.*?)'", r'"\1"', js_array_str)

        # 5. 마지막 콤마 제거 (JSON은 마지막 콤마를 허용하지 않음)
        js_array_str = re.sub(r',\s*([}\]])', r'\1', js_array_str)

        # ast.literal_eval을 사용하여 안전하게 파싱
        artworks_list = ast.literal_eval(js_array_str)

        with open(json_file_path, 'w', encoding='utf-8') as f:
            json.dump(artworks_list, f, ensure_ascii=False, indent=2)

        print(f"성공적으로 {ts_file_path}를 {json_file_path}로 변환했습니다.")

    except FileNotFoundError:
        print(f"오류: {ts_file_path} 파일을 찾을 수 없습니다.")
    except (SyntaxError, ValueError) as e:
        print(f"파싱 오류 (SyntaxError/ValueError): {e}")
        print(f"오류 발생 부분: {js_array_str[max(0, e.offset-50):e.offset+50] if hasattr(e, 'offset') else js_array_str}")
    except Exception as e:
        print(f"예상치 못한 오류: {e}")

if __name__ == "__main__":
    convert_ts_to_json(ARTWORKS_TS_PATH, ARTWORKS_JSON_PATH)