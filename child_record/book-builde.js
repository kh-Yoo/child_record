/**
 * 아이 성장 기록집 — 데이터 조립 및 파라미터 빌더 (book-builder.js)
 */

// 전역 변수로 관리되는 그래픽 데이터 (alrimjang-config.js 등에 정의되어 있어야 함)
const DAY_NAMES_EN = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 템플릿 파라미터 중 이미지가 비어있으면 해당 키를 제거하여 전송 에러를 방지합니다.
 * (app.js와 중복되지 않도록 여기서만 정의하거나 app.js에서 호출 가능하게 유지)
 */
function stripEmptyImages(obj) {
    const IMAGE_PARAM_KEYS = new Set(['coverPhoto', 'monthCharacter', 'lineVertical', 'parentBalloon', 'weatherIcon', 'photo']);
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
        if (IMAGE_PARAM_KEYS.has(k) && (!v || v === '')) continue;
        result[k] = v;
    }
    return result;
}

// ── 연령별 간지(챕터) 파라미터 빌더 ──
function ganjiParamsA(age, year, month, mc) {
    return { year: "Growth Record", monthName: `AGE ${age}`, monthNum: `${age}살`, monthColor: mc.color };
}

function ganjiParamsB(age, year, month, mc) {
    return {
        year: "Growth Record", monthName: `${age} Years Old`, monthNum: `${age}살`,
        monthCharacter: GRAPHICS_B[mc.characterKey], bgColor: mc.bgColor, textColor: mc.textColor,
    };
}

let chapterCounterC = 0;
function ganjiParamsC(age, year, month, mc) {
    chapterCounterC++;
    return {
        year: "Growth Record", monthName: `AGE ${age}`, monthNum: `${age}살`,
        chapterNum: String(chapterCounterC), bgColor: mc.color,
    };
}

// ── 내지 파라미터 빌더 ──
function naejiParamsA(year, month, mc, dayData, bookTitle) {
    return {
        year: String(year), month: String(month), monthNum: String(month).padStart(2,'0'),
        monthNameCapitalized: mc.cap, monthColor: mc.color,
        bookTitle: bookTitle || '성장 스토리북',
        lineVertical: GRAPHICS_A[mc.lineKey],
        date: dayData.date, dayOfWeek: dayData.dayOfWeek, dayOfWeekX: 88.0,
        weather: '', meal: '', nap: '', 
        parentComment: dayData.parentComment, hasParentComment: !!dayData.parentComment,
        teacherComment: '', hasTeacherComment: false,
        photos: dayData.photos || [],
    };
}

function naejiParamsB(year, month, mc, dayData, bookTitle) {
    return {
        year: String(year), month: String(month), monthNameCapitalized: mc.name,
        bookTitle: bookTitle || '성장 이야기',
        pointColor: mc.textColor,
        date: dayData.dateB, weather: '', meal: '', nap: '',
        parentComment: dayData.parentComment, hasParentComment: !!dayData.parentComment,
        teacherComment: '', hasTeacherComment: false,
        photos: dayData.photos || [],
    };
}

function naejiParamsC(year, month, mc, dayData, isFirstOfAge, bookTitle) {
    const p = {
        year: String(year), month: String(month),
        bookTitle: bookTitle || '성장 이야기',
        parentBalloon: GRAPHICS_C[mc.balloon] || '',
        pointColor: mc.color, weatherIcon: '',
        date: dayData.dateC,
        parentComment: dayData.parentComment, hasParentComment: !!dayData.parentComment,
        teacherComment: '', hasTeacherComment: false,
        photos: dayData.photos || [],
    };
    if (isFirstOfAge) p.monthNameCapitalized = mc.NAME;
    return p;
}

/**
 * 데이터를 기반으로 연령별 간지 및 내지 엔트리를 생성합니다.
 */
function buildEntries(items) {
    const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
    const entries = []; 
    let prevAge = -1;
    
    sorted.forEach((item) => {
        const year = parseInt(item.date.substring(0,4));
        const month = parseInt(item.date.substring(5,7));
        const day = parseInt(item.date.substring(8,10));
        const currentAge = item.age || 1;
        
        const isNewAge = (currentAge !== prevAge);
        if (isNewAge) { 
            entries.push({ type: 'ganji', age: currentAge, year, month }); 
            prevAge = currentAge; 
        }
        
        const d = new Date(item.date); 

        entries.push({
            type: 'naeji', 
            age: currentAge,
            year, 
            month, 
            isFirstOfAge: isNewAge,
            dayData: {
                date: `${year}년 ${month}월 ${day}일`, 
                dateB: `${year}.${String(month).padStart(2,'0')}.${String(day).padStart(2,'0')}`, 
                dateC: `${String(month).padStart(2,'0')}.${String(day).padStart(2,'0')}｜${DAY_NAMES_EN[d.getDay()]}`, 
                dayOfWeek: DAY_NAMES[d.getDay()],
                parentComment: item.memo || '',
                // app.js의 업로드 맵을 활용해 사진 URL 치환
                photos: (item.photoUrls || []).map(fileName => {
                    return (typeof uploadedPhotoMap !== 'undefined' && uploadedPhotoMap[fileName]) 
                           ? uploadedPhotoMap[fileName] 
                           : fileName;
                }),
            },
        });
    });
    return entries;
}

/**
 * SDK를 사용하여 콘텐츠 페이지 삽입
 */
async function sdkPostContent(client, bookUid, templateUid, parameters, breakBefore) {
    return client.contents.insert(bookUid, templateUid, stripEmptyImages(parameters), {
        breakBefore: breakBefore === 'none' ? '' : breakBefore,
    });
}