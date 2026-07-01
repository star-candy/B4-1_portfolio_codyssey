document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. 다크 모드 상태 관리 및 렌더링
    // ==========================================
    const themeToggleBtn = document.querySelector('.theme-toggle');
    
    // 상태 초기화: 로컬스토리지 기반
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggleBtn.textContent = '☀️';
        }
    };
    initTheme();

    // 테마 토글 이벤트
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        // 상태 변경 및 렌더링 업데이트
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.textContent = '☀️';
        }
    });

    // ==========================================
    // 2. 모바일 네비게이션 및 스크롤 이벤트
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scroll-top');

    // 햄버거 토글
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 부드러운 스크롤 & 메뉴 닫기
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
            
            // 모바일 메뉴 닫기
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 스크롤 이벤트 (헤더 배경 변경 및 최상단 이동 버튼)
    window.addEventListener('scroll', () => {
        // 스크롤 60px 기준 배경색 업데이트
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 스크롤 300px 기준 top 버튼 표시/숨김
        if (window.scrollY > 300) {
            scrollTopBtn.classList.remove('hidden');
        } else {
            scrollTopBtn.classList.add('hidden');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================
    // 3. 스크롤 애니메이션 (Intersection Observer)
    // ==========================================
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // 한 번 보이면 관찰 해제
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.fade-in').forEach(section => {
        observer.observe(section);
    });

    // ==========================================
    // 4. GitHub API 연동 (비동기 처리 & UI 상태 렌더링)
    // ==========================================
    const projectsContainer = document.getElementById('projects-container');
    const GITHUB_USERNAME = 'star-candy'; //[cite: 1]

    const fetchGitHubProjects = async () => {
        // [상태 1] 로딩 중
        projectsContainer.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">데이터를 불러오는 중입니다...</p>';

        try {
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated`);
            
            if (!response.ok) {
                if (response.status === 403) throw new Error('API 호출 제한(Rate Limit)을 초과했습니다.');
                throw new Error('데이터를 불러오지 못했습니다.');
            }

            const repos = await response.json();

            // [상태 2] 빈 상태
            if (repos.length === 0) {
                projectsContainer.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">표시할 프로젝트가 없습니다.</p>';
                return;
            }

            // [상태 3] 성공 상태 렌더링 (map, filter, 구조분해할당 활용)
            const html = repos
                .filter(repo => !repo.fork) 
                .slice(0, 6) // 최근 6개만 표시
                .map(repo => {
                    const { name, html_url, description, language } = repo;
                    return `
                        <article class="card">
                            <h3><a href="${html_url}" target="_blank" rel="noopener noreferrer">${name}</a></h3>
                            <p style="margin: 0.5rem 0; color: var(--secondary-color);">${description || '설명이 제공되지 않은 프로젝트입니다.'}</p>
                            <span style="font-size: 0.85rem; font-weight: bold;">${language ? `🔵 ${language}` : ''}</span>
                        </article>
                    `;
                }).join('');

            projectsContainer.innerHTML = html;

        } catch (error) {
            // [상태 4] 에러 상태
            projectsContainer.innerHTML = `
                <div style="text-align:center; grid-column: 1/-1;">
                    <p style="color: var(--error-color); margin-bottom: 1rem;">${error.message}</p>
                    <button id="retry-btn" class="btn btn-secondary">다시 시도</button>
                </div>
            `;
            document.getElementById('retry-btn').addEventListener('click', fetchGitHubProjects);
        }
    };

    fetchGitHubProjects();

    // ==========================================
    // 5. 폼 유효성 검사 (입력 상태 검증)
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        let isValid = true;

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        // 이름 검증
        if (!nameInput.value.trim()) {
            document.getElementById('name-error').classList.remove('hidden');
            isValid = false;
        } else {
            document.getElementById('name-error').classList.add('hidden');
        }

        // 이메일 검증
        if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
            document.getElementById('email-error').classList.remove('hidden');
            isValid = false;
        } else {
            document.getElementById('email-error').classList.add('hidden');
        }

        // 메시지 검증
        if (!messageInput.value.trim()) {
            document.getElementById('message-error').classList.remove('hidden');
            isValid = false;
        } else {
            document.getElementById('message-error').classList.add('hidden');
        }

        // 성공 상태 UI 처리
        if (isValid) {
            const successMsg = document.getElementById('form-success');
            successMsg.classList.remove('hidden');
            contactForm.reset();
            
            setTimeout(() => {
                successMsg.classList.add('hidden');
            }, 3000);
        }
    });
});