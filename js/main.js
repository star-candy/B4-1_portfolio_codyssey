
    // ==========================================
    // 1. 다크 모드 상태 관리 및 렌더링
    // ==========================================
    // 다크모드를 토글할 버튼 요소를 선택합니다.
    const themeToggleBtn = document.querySelector('.theme-toggle');
    
    // 상태 초기화: 사용자가 이전에 설정한 테마가 있는지 브라우저의 로컬스토리지에서 확인합니다.
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme'); // 'theme' 키로 저장된 값을 가져옴
        // 저장된 테마가 'dark'라면
        if (savedTheme === 'dark') {
            // HTML 최상위 태그(<html>)에 data-theme="dark" 속성을 부여하여 CSS 다크모드를 활성화합니다.
            document.documentElement.setAttribute('data-theme', 'dark');
            // 버튼 아이콘을 해(라이트 모드로 전환하는 UI)로 변경합니다.
            themeToggleBtn.textContent = '☀️';
        }
    };
    initTheme(); // 페이지 로드 시 즉시 초기화 함수 실행

    // 테마 토글 버튼 클릭 이벤트
    themeToggleBtn.addEventListener('click', () => {
        // 현재 HTML 태그에 설정된 테마 상태를 가져옵니다.
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        // 상태 변경 및 렌더링 업데이트 로직
        if (currentTheme === 'dark') {
            // 현재가 다크모드라면 -> 라이트 모드로 전환
            document.documentElement.removeAttribute('data-theme'); // 속성 제거 (기본 CSS 적용)
            localStorage.setItem('theme', 'light'); // 변경된 상태를 로컬스토리지에 저장하여 새로고침 시 유지
            themeToggleBtn.textContent = '🌙'; // 버튼 아이콘을 달로 변경
        } else {
            // 현재가 라이트 모드라면 -> 다크 모드로 전환
            document.documentElement.setAttribute('data-theme', 'dark'); // 다크모드 CSS 활성화
            localStorage.setItem('theme', 'dark'); // 로컬스토리지에 다크모드 상태 저장
            themeToggleBtn.textContent = '☀️'; // 버튼 아이콘을 해로 변경
        }
    });

    // ==========================================
    // 2. 모바일 네비게이션 및 스크롤 이벤트
    // ==========================================
    const hamburger = document.querySelector('.hamburger'); // 모바일 햄버거 메뉴 버튼
    const navMenu = document.querySelector('.nav-menu'); // 숨겨져 있는 모바일 네비게이션 메뉴
    const header = document.getElementById('header'); // 상단 고정 헤더
    const scrollTopBtn = document.getElementById('scroll-top'); // 맨 위로 가기 버튼

    // 햄버거 버튼 클릭 토글 이벤트
    hamburger.addEventListener('click', () => {
        // classList.toggle()은 클래스가 없으면 추가하고, 있으면 제거합니다.
        // 버튼 모양을 X자로 바꾸고, 메뉴를 화면 안으로 슬라이드 시킵니다. (CSS와 연동)
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 네비게이션 링크 클릭 시 부드러운 스크롤 이동 및 모바일 메뉴 닫기
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // a 태그의 기본 동작(페이지 튕김 현상)을 막습니다.
            
            // href 속성에서 '#'을 제외한 id 값만 추출합니다. (예: '#about' -> 'about')
            const targetId = link.getAttribute('href').substring(1);
            // 해당 id를 가진 요소의 위치로 부드럽게 스크롤합니다.
            document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
            
            // 이동 후 열려있던 모바일 메뉴를 닫아줍니다. (.active 클래스 제거)
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 스크롤 발생 시 이벤트 (헤더 배경 변경 및 최상단 이동 버튼 제어)
    window.addEventListener('scroll', () => {
        // window.scrollY는 현재 사용자가 위에서부터 스크롤한 픽셀 값을 나타냅니다.
        // 스크롤이 60px을 넘어가면 헤더 배경을 불투명하게 만듭니다.
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled'); // 맨 위로 올라오면 다시 투명하게
        }

        // 스크롤이 300px을 넘어가면 맨 위로 가기 버튼을 표시합니다.
        if (window.scrollY > 300) {
            scrollTopBtn.classList.remove('hidden');
        } else {
            scrollTopBtn.classList.add('hidden');
        }
    });

    // 맨 위로 가기 버튼 클릭 이벤트
    scrollTopBtn.addEventListener('click', () => {
        // 화면 좌표(0,0)으로 부드럽게 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================
    // 3. 스크롤 애니메이션 (Intersection Observer API)
    // ==========================================
    // IntersectionObserver는 요소가 화면(뷰포트)에 들어왔는지 효율적으로 감지합니다.
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // isIntersecting 속성이 true면 해당 요소가 화면에 나타났음을 의미합니다.
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // CSS 애니메이션(.visible) 실행
                // 한 번 나타난 후에는 다시 감지할 필요가 없으므로 관찰을 해제하여 성능을 최적화합니다.
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.2 }); // 요소의 20% 이상이 화면에 보일 때 콜백 함수를 실행합니다.

    // HTML 내에 .fade-in 클래스를 가진 모든 섹션을 찾아서 관찰 대상에 등록합니다.
    document.querySelectorAll('.fade-in').forEach(section => {
        observer.observe(section);
    });

    // ==========================================
    // 4. GitHub API 연동 (비동기 처리 & UI 상태 렌더링)
    // ==========================================
    const projectsContainer = document.getElementById('projects-container');
    const GITHUB_USERNAME = 'star-candy'; // 데이터를 가져올 GitHub 아이디

    // 비동기 통신을 위해 async 함수를 선언합니다.
    const fetchGitHubProjects = async () => {
        // [상태 1] 로딩 중 UI 렌더링: API 요청 전 사용자에게 로딩 상태를 알립니다.
        projectsContainer.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">데이터를 불러오는 중입니다...</p>';

        try {
            // fetch API를 사용해 데이터를 요청하고, await로 응답이 올 때까지 기다립니다.
            // ?sort=updated를 통해 최근 업데이트된 레포지토리 순으로 가져옵니다.
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated`);
            
            // HTTP 응답 코드가 200번대(성공)가 아니라면 에러를 던집니다(catch 블록으로 이동).
            if (!response.ok) {
                // 특히 시간당 호출 횟수(Rate Limit) 초과 시 발생하는 403 에러를 구분하여 처리합니다.
                if (response.status === 403) throw new Error('API 호출 제한(Rate Limit)을 초과했습니다.');
                throw new Error('데이터를 불러오지 못했습니다.');
            }

            // 응답받은 JSON 문자열 데이터를 JavaScript 배열 객체로 파싱합니다.
            const repos = await response.json();

            // [상태 2] 빈 상태 UI 렌더링: 데이터가 배열 형태이지만 항목이 0개일 때 처리합니다.
            if (repos.length === 0) {
                projectsContainer.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">표시할 프로젝트가 없습니다.</p>';
                return; // 함수 실행 종료
            }

            // [상태 3] 성공 상태 렌더링
            const html = repos
                .filter(repo => !repo.fork) // 1. 내가 직접 포크(Fork)하지 않은 오리지널 레포지만 필터링
                .slice(0, 6) // 2. 최신순으로 상위 6개까지만 자름
                .map(repo => { // 3. 배열 안의 데이터를 바탕으로 HTML 문자열 배열 생성
                    // 객체 구조 분해 할당을 통해 필요한 속성만 깔끔하게 추출합니다.
                    const { name, html_url, description, language } = repo;
                    return `
                        <article class="card">
                            <h3><a href="${html_url}" target="_blank" rel="noopener noreferrer">${name}</a></h3>
                            <p style="margin: 0.5rem 0; color: var(--secondary-color);">${description || '설명이 제공되지 않은 프로젝트입니다.'}</p>
                            <span style="font-size: 0.85rem; font-weight: bold;">${language ? `🔵 ${language}` : ''}</span>
                        </article>
                    `;
                }).join(''); // 4. 만들어진 HTML 문자열 배열을 하나의 거대한 텍스트로 합침

            // 조합된 HTML 문자열을 DOM에 삽입하여 화면에 그립니다.
            projectsContainer.innerHTML = html;

        } catch (error) {
            // [상태 4] 에러 상태 UI 렌더링: 네트워크 장애나 응답 에러 시 처리합니다.
            // 에러 메시지와 함께 다시 시도할 수 있는 버튼을 렌더링합니다.
            projectsContainer.innerHTML = `
                <div style="text-align:center; grid-column: 1/-1;">
                    <p style="color: var(--error-color); margin-bottom: 1rem;">${error.message}</p>
                    <button id="retry-btn" class="btn btn-secondary">다시 시도</button>
                </div>
            `;
            // 동적으로 생성된 재시도 버튼에 다시 API를 호출하는 이벤트를 연결해줍니다.
            document.getElementById('retry-btn').addEventListener('click', fetchGitHubProjects);
        }
    };

    fetchGitHubProjects(); // 스크립트 실행 시 API 호출 함수 최초 1회 실행

    // ==========================================
    // 5. 폼 유효성 검사 (입력 상태 검증)
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    
    // 이메일 형식이 맞는지 정규 표현식(Regex)을 이용해 검사하는 도우미 함수입니다.
    const isValidEmail = (email) => {
        // @와 공백을 제외한 모든 문자가 1개 이상 포함된다.
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email); // 통과하면 true, 아니면 false 반환
    };

    // 폼 제출 이벤트
    contactForm.addEventListener('submit', (e) => {
        // 서버로 폼이 제출되어 페이지가 새로고침 되는 기본 동작을 막습니다. (프론트엔드 단독 검증을 위함)
        e.preventDefault(); 
        
        let isValid = true; // 최종 제출을 허용할지 결정하는 상태값

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        // [이름 검증]
        // trim()은 입력값 앞뒤의 공백을 제거합니다. 스페이스바만 입력한 경우 빈 문자열로 처리됩니다.
        if (!nameInput.value.trim()) {
            // 입력값이 없으면 hidden 클래스를 제거하여 에러 메시지를 보여줍니다.
            document.getElementById('name-error').classList.remove('hidden');
            isValid = false; // 하나라도 실패하면 제출 상태를 false로 변경
        } else {
            // 입력값이 정상이면 에러 메시지를 다시 숨깁니다.
            document.getElementById('name-error').classList.add('hidden');
        }

        // [이메일 검증]
        // 빈 값이거나, 정규식에 통과하지 못하면 에러 표시
        if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
            document.getElementById('email-error').classList.remove('hidden');
            isValid = false;
        } else {
            document.getElementById('email-error').classList.add('hidden');
        }

        // [메시지 검증]
        if (!messageInput.value.trim()) {
            document.getElementById('message-error').classList.remove('hidden');
            isValid = false;
        } else {
            document.getElementById('message-error').classList.add('hidden');
        }

        // [성공 상태 UI 처리]
        if (isValid) { // 모든 검증을 통과했다면
            const successMsg = document.getElementById('form-success');
            // 1. 성공 메시지 표시
            successMsg.classList.remove('hidden');
            // 2. 입력칸 안의 텍스트 모두 초기화(리셋)
            contactForm.reset();
            
            // 3. 3초(3000ms) 뒤에 성공 메시지를 자동으로 다시 숨김
            setTimeout(() => {
                successMsg.classList.add('hidden');
            }, 3000);
        }
    });