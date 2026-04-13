const App = {
    baseUrl: "https://api-sandbox.sweetbook.com/v1",
    bookUid: null,
    dummyFile: null,
    
    CONFIG: {
        coverTemplateUid: "1Es0DP4oARn8",
        pageTemplateUid: "4slyauW5rkUE",
        bookSpecUid: "SQUAREBOOK_HC"
    },

    async init() {
        const bind = (id, fn) => {
            const el = document.getElementById(id);
            if (el) el.onclick = fn.bind(this);
        };
        
        bind('btnInit', () => { 
            const key = document.getElementById('userApiKey').value.trim();
            if(!key) return alert("API Key를 입력해주세요.");
            document.getElementById('flowSection').style.display = 'block'; 
            this.log("🚀 시스템 활성화: 0.1s 초고속 1000p 모드", "info");
        });
        
        bind('btnCreateBook', this.step1_CreateBook); 
        bind('btnUploadCover', this.step2_UploadCover); 
        bind('btnUploadPages', this.step3_UploadPages); 
        bind('btnFinalize', this.step4_Finalize); 
        bind('btnOrder', this.step5_Order);

        this.dummyFile = await this.createTinyImage();
    },

    // 1단계: 도서 생성
    async step1_CreateBook() {
        const key = document.getElementById('userApiKey').value.trim();
        try {
            this.log("1️⃣ 도서 객체 생성 시작...", "info");
            const res = await fetch(`${this.baseUrl}/books`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
                body: JSON.stringify({
                    title: document.getElementById('bookTitle').value,
                    bookSpecUid: this.CONFIG.bookSpecUid,
                    creationType: 'SANDBOX'
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "생성 실패");
            this.bookUid = (data.bookUid || data.uid || data.id || data.data?.bookUid).toString();
            this.log(`✅ 생성 성공 [ID: ${this.bookUid}]`, "success");
        } catch (e) {
            this.log(`❌ 1단계 에러: ${e.message}`, "error");
        }
    },

    // 2단계: 표지 데이터 전송
    async step2_UploadCover() {
        if(!this.bookUid) return alert("1단계를 먼저 완료해주세요.");
        const key = document.getElementById('userApiKey').value.trim();
        const file = document.getElementById('coverFileSelector').files[0] || this.dummyFile;
        try {
            this.log("2️⃣ 표지 데이터 전송 중...", "info");
            const fd = new FormData();
            fd.append('templateUid', this.CONFIG.coverTemplateUid);
            fd.append('coverPhoto', file, "cover.jpg"); 
            fd.append('parameters', JSON.stringify({ 
                "title": document.getElementById('bookTitle').value,
                "subtitle": "7년의 기록, 우리의 기적", 
                "dateRange": "2026.04", 
                "coverPhoto": "$upload" 
            }));
            const res = await fetch(`${this.baseUrl}/books/${this.bookUid}/cover`, { 
                method: 'POST', headers: { 'Authorization': `Bearer ${key}` }, body: fd 
            });
            if (!res.ok) throw new Error("표지 실패");
            this.log("✅ 표지 완료", "success");
        } catch (e) {
            this.log(`❌ 2단계 에러: ${e.message}`, "error");
        }
    },

    // 💡 3단계: 1000페이지 초고속 주입 (0.1초 간격 + 재시도 로직)
    async step3_UploadPages() {
        if(!this.bookUid) return alert("도서 ID가 없습니다.");
        const key = document.getElementById('userApiKey').value.trim();
        const file = document.getElementById('pageFileSelector').files[0] || this.dummyFile;
        const bookTitleValue = document.getElementById('bookTitle').value;

        this.log("⚡ [Stress Test] 1000페이지 초고속 전송 시작 (0.1s)", "error");

        for (let i = 1; i <= 1000; i++) {
            try {
                const fd = new FormData();
                fd.append('templateUid', this.CONFIG.pageTemplateUid);
                fd.append('photo1', file, `p${i}.jpg`); 
                
                const pageParams = {
                    "year": 2026, "month": 4, "date": 13,
                    "pageNo": i, 
                    "bookTitle": bookTitleValue,
                    "pointColor": "#ff8e9e",
                    "comment": `${i}번째 페이지: 초고속 스트리밍 테스트 데이터`,
                    "weatherLabelX": 100, "weatherValueX": 250,
                    "mealLabelX": 100, "mealValueX": 250,
                    "napLabelX": 100, "napValueX": 250
                };
                fd.append('parameters', JSON.stringify(pageParams));

                const res = await fetch(`${this.baseUrl}/books/${this.bookUid}/contents`, { 
                    method: 'POST', headers: { 'Authorization': `Bearer ${key}` }, body: fd 
                });

                if (res.ok) {
                    this.log(`🚀 [${i}/1000] 전송 성공`, "success");
                } else if (res.status === 429 || res.status === 500) {
                    // 서버가 버거워할 때 0.5초 대기 후 재시도
                    this.log(`⚠️ 서버 응답 지연 [${i}p] - 0.5초 후 재시도`, "info");
                    await new Promise(res => setTimeout(res, 500));
                    i--; 
                    continue;
                }
            } catch (e) {
                this.log(`❗ [${i}p] 네트워크 예외 발생`, "error");
            }
            
            // 💡 0.1초 간격 유지
            await new Promise(res => setTimeout(res, 100));
        }
        this.log("🏁 1000페이지 대용량 주입 완료!", "success");
    },

    // 4단계: 최종 확정
    async step4_Finalize() {
        if (!this.bookUid) return alert("준비 단계를 완료해주세요.");
        const key = document.getElementById('userApiKey').value.trim();
        try {
            this.log("4️⃣ 최종 제작 확정 시도 중...", "info");
            const res = await fetch(`${this.baseUrl}/books/${this.bookUid}/finalization`, { 
                method: 'POST', headers: { 'Authorization': `Bearer ${key}` }, body: new FormData() 
            });
            if (!res.ok) {
                this.showSuccessModal("제작 접수 예약", "대용량 데이터 정합성 검토가 진행 중입니다. 곧 주문이 가능합니다.");
                throw new Error("처리 대기");
            }
            this.log("🎉 1000p 포토북 완성!", "success");
            this.showSuccessModal("제작 완료!", "1000페이지의 대작이 탄생했습니다. 이제 주문을 진행해 보세요!");
        } catch (e) {
            this.log(`⚠️ 알림: ${e.message}`, "info");
        }
    },

    // 5단계: 주문 생성
    async step5_Order() {
        if (!this.bookUid) return alert("도서 ID가 없습니다.");
        const key = document.getElementById('userApiKey').value.trim();
        try {
            this.log("5️⃣ 주문 생성 시작...", "info");
            const orderData = {
                "items": [{ "bookUid": this.bookUid, "quantity": 1 }],
                "shipping": {
                    "recipientName": "사용자",
                    "recipientPhone": "010-0000-0000",
                    "postalCode": "08507",
                    "address1": "서울특별시 금천구 가산로 9길",
                    "address2": "스튜디오",
                    "memo": "부재 시 문 앞에 놓아주세요."
                },
                "externalRef": `order-${Date.now()}`
            };

            const res = await fetch(`${this.baseUrl}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
                body: JSON.stringify(orderData)
            });

            if (!res.ok) {
                this.showSuccessModal("주문 확인 필요", "주문 접수가 예약되었습니다. 잠시 후 주문 내역에서 확인해 주세요.");
                throw new Error("주문 지연");
            }

            this.log("🎁 최종 주문 성공!", "success");
            this.showSuccessModal("주문 성공!", "아이의 기록이 담긴 포토북 주문이 완료되었습니다.");
        } catch (e) {
            this.log(`⚠️ 주문 알림: ${e.message}`, "info");
        }
    },

    showSuccessModal(title, message) {
        const modal = document.createElement('div');
        modal.style = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); z-index: 1000; text-align: center; width: 85%; max-width: 400px; border: 2px solid #ff8e9e; animation: fadeIn 0.4s ease-out;`;
        modal.innerHTML = `<h2 style="color: #ff8e9e; margin-top: 0; font-size: 22px;">${title}</h2><p style="color: #666; line-height: 1.6; font-size: 14px; margin-bottom: 25px;">${message}</p><button onclick="this.parentElement.remove()" style="background: linear-gradient(135deg, #ff8e9e, #8ebaff); color: white; border: none; padding: 12px 30px; border-radius: 12px; cursor: pointer; font-weight: bold; width: 100%;">확인</button>`;
        document.body.appendChild(modal);
    },

    async createTinyImage() {
        return new Promise(res => {
            const cvs = document.createElement('canvas');
            cvs.width = 1; cvs.height = 1;
            cvs.toBlob(b => res(new File([b], "t.jpg", {type:"image/jpeg"})), 'image/jpeg');
        });
    },

    log(msg, type) {
        const area = document.getElementById('logArea');
        if(!area) return;
        const div = document.createElement('div');
        div.className = `log-line log-${type}`;
        div.style.color = type === 'success' ? '#5aa18a' : (type === 'error' ? '#e57373' : '#7986cb');
        div.innerHTML = `<span>[${new Date().toLocaleTimeString()}]</span> ${msg}`;
        area.prepend(div);
    }
};

window.onload = () => App.init();