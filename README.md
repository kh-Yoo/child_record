# 7년의 기적, 초등학교 입학을 앞두고

<img width="671" height="128" alt="image" src="https://github.com/user-attachments/assets/bc7f7d5e-c426-4b13-afe5-2feb076fd420" />

## 프로젝트 소개
초등학교 입학을 앞둔 우리 아이의 **1세부터 7세까지 성장 기록**을 아름다운 포토북으로 제작하는 웹 애플리케이션입니다.  
부모가 그동안 찍어온 수많은 사진과 추억을 책으로 남겨, 아이가 커서 부모의 사랑과 마음을 느낄 수 있도록 만드는 것이 목표입니다.

## 📌 주요 기능 및 Workflow
Book Print API를 활용하여 아래 순서대로 포토북을 생성합니다.

1. 책 생성 (Create Book)
2. 표지 추가 (Add Cover)
3. 내지 추가 (Add Contents) — **최소 24페이지 준수**
4. 책 확정 (Finalize / Confirm)
5. 주문 (Order)

## 🚀 개발 과정 및 문제 해결 경험 (가장 중요)

과제 수행 중 **3단계(내지 추가)**에서 샌드박스 서버의 불안정(Internal Server Error)을 가장 큰 난관으로 만났습니다.

**대응 과정**
- 서버 부하 감소를 위해 실제 이미지 대신 **1x1px 가상 이미지**로 테스트 진행
- 서버 응답 로그를 분석하여 `napLabelX` 등 누락된 필수 파라미터를 발견하고 즉시 보완
- Exponential Backoff + Retry 로직(최대 6회) 구현
- UI에 진행률 표시, 재시도 버튼, 로딩 상태를 추가하여 사용자 경험 개선

이 과정을 통해 API 문서의 세밀한 명세를 정확히 따르는 것의 중요성과, 서버 불안정 상황에서도 안정적으로 동작하는 코드를 작성하는 방법을 배울 수 있었습니다.

## 프로젝트 목표
- 부모가 쉽게 사진과 글을 입력하면 자동으로 포토북이 완성되도록 함
- 아이가 커서 책을 보며 부모의 사랑을 느낄 수 있는 감동적인 결과물 제작

## 더 시간이 있었다면 추가하고 싶었던 기능
- QR코드 삽입을 통한 동영상 연동
- AI 기반 자동 레이아웃 및 템플릿 추천 기능
- 실시간 미리보기 강화
  
## 사용한 API 목록
<img width="595" height="151" alt="image" src="https://github.com/user-attachments/assets/dd474946-1aab-4d62-9960-02f1905a31c7" />

## AI 도구 사용 내
<img width="730" height="96" alt="image" src="https://github.com/user-attachments/assets/e1deb11f-10ed-4b81-9afb-ffcb0d1f758a" />

## 실행 방법
<img width="324" height="69" alt="image" src="https://github.com/user-attachments/assets/bc475d6e-f47d-477d-8ca6-d07a82e5f5ef" />

node server.js를 입력한 후에

<img width="739" height="339" alt="image" src="https://github.com/user-attachments/assets/5b386c4f-f5e6-4f0b-b8d1-d7348813e033" />

API 키를 입력하고 실행하면 됩니다!

1. 저장소 클론
```bash
git clone https://github.com/kh-Yoo/child_record.git
cd child_record
