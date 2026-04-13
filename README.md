## 프로젝트 소개
초등학교 입학을 앞둔 우리 아이의 **1세부터 7세**까지 성장 기록을 아름다운 포토북으로 제작하는 웹 애플리케이션입니다.  
부모가 그동안 찍어온 수많은 사진과 추억을 책으로 남겨, 아이가 커서 부모의 사랑과 마음을 느낄 수 있도록 만드는 것이 목표입니다.

<img width="671" height="128" alt="image" src="https://github.com/user-attachments/assets/bc7f7d5e-c426-4b13-afe5-2feb076fd420" />

## 이 서비스를 선택한 이유
저는 부모가 아이를 키우면서 가장 많이 느끼는 감정이 **시간이 너무 빠르게 지나간다**는 아쉬움이라고 생각합니다.  
초등학교 입학이라는 큰 전환점을 앞두고, 그동안 무수히 찍어온 순간들이 흩어지지 않고 아름다운 책으로 남는다면 큰 감동이 될 것 같았습니다.  
그래서 이번 과제에서 **초등학교 입학 전, 아이의 성장 기록 포토북**이라는 주제를 선택했습니다.

## 타겟층 및 비즈니스 가능성
**주요 타겟층**  
30~40대 부모, 특히 첫째 아이를 키우는 가정과 유치원·어린이집에 다니는 아이를 둔 부모

**비즈니스 가능성**  
긍정적으로 평가합니다. 매년 약 40~45만 명의 아이가 초등학교에 입학하며, 부모들은 아이 성장 기록에 높은 지출 의향을 보입니다.  
“초등학교 입학 전 마지막 기록”이라는 명확한 컨셉은 기존 아기 수첩·돌 사진책 시장과 차별화가 가능하며, 유치원 단체 주문, 출산·입학 선물 세트 등으로 확장 가능성이 높습니다.

## 📌 주요 기능 및 Workflow
Book Print API를 활용하여 아래 순서대로 포토북을 생성합니다.

1. 책 생성 (Create Book)
2. 표지 추가 (Add Cover)
3. 내지 추가 (Add Contents) — **최소 24페이지 준수**
4. 책 확정 (Finalize / Confirm)
5. 주문 (Order)

## 프로젝트 목표
- 부모가 쉽게 사진과 글을 입력하면 자동으로 포토북이 완성되도록 함
- 아이가 커서 책을 보며 부모의 사랑을 느낄 수 있는 감동적인 결과물 제작

## 더 시간이 있었다면 추가하고 싶었던 기능
- QR코드 삽입을 통한 동영상 연동
- AI 기반 자동 레이아웃 및 템플릿 추천 기능
- 실시간 미리보기 강화

## 실행 영상
![최종 영상](https://github.com/user-attachments/assets/3e45cdde-de70-4ff7-8c6c-d311b9648848)

## 사용한 API 목록
<img width="607" height="168" alt="image" src="https://github.com/user-attachments/assets/97310ae0-a3c0-478b-b7a0-0aaf11e3bf40" />

## AI 도구 사용 내역
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
npm install
npm run dev
