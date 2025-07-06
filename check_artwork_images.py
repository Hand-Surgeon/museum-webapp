import json

ARTWORKS_JSON_PATH = 'src/data/artworks.json'

def check_artwork_image_urls(file_path: str):
    """artworks.json 파일의 이미지 URL 필드를 점검합니다."""
    print(f"\n--- {file_path} 이미지 URL 점검 리포트 ---")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            artworks = json.load(f)
    except FileNotFoundError:
        print(f"오류: {file_path} 파일을 찾을 수 없습니다.")
        return
    except json.JSONDecodeError as e:
        print(f"오류: {file_path} 파일 파싱 오류 - {e}")
        return

    missing_count = 0
    empty_count = 0
    unsplash_count = 0
    total_artworks = len(artworks)

    for i, artwork in enumerate(artworks):
        artwork_id = artwork.get('id', f'Unknown ID {i}')
        artwork_title = artwork.get('title', '제목 없음')
        image_url = artwork.get('imageUrl')

        if image_url is None:
            print(f"[경고] ID: {artwork_id}, 제목: {artwork_title} - imageUrl 필드가 누락되었습니다.")
            missing_count += 1
        elif not image_url.strip():
            print(f"[경고] ID: {artwork_id}, 제목: {artwork_title} - imageUrl 필드 값이 비어있습니다.")
            empty_count += 1
        elif "unsplash.com" in image_url:
            print(f"[경고] ID: {artwork_id}, 제목: {artwork_title} - imageUrl에 Unsplash URL이 남아있습니다: {image_url}")
            unsplash_count += 1

    print(f"\n--- 점검 요약 ---")
    print(f"총 작품 수: {total_artworks}")
    print(f"imageUrl 누락: {missing_count}개")
    print(f"imageUrl 빈 값: {empty_count}개")
    print(f"Unsplash URL 포함: {unsplash_count}개")

    if missing_count == 0 and empty_count == 0 and unsplash_count == 0:
        print("모든 작품의 imageUrl 필드가 유효해 보입니다. 데이터 문제는 없는 것 같습니다.")
    else:
        print("imageUrl 필드에 문제가 있는 작품이 발견되었습니다. 위 리포트를 확인해주세요.")

if __name__ == "__main__":
    check_artwork_image_urls(ARTWORKS_JSON_PATH)
