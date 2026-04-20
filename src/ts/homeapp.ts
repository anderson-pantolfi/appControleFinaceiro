// Aguarda o documento carregar
document.addEventListener('DOMContentLoaded', () => {
    
    // ================= 1. MODO DARK / LIGHT =================
    const themeToggleBtn = document.getElementById('theme-toggle') as HTMLButtonElement;
    const themeIcon = themeToggleBtn.querySelector('i') as HTMLElement;
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme); 
        if (currentTheme === 'dark') themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    });

    // ================= 2. RECOLHER / EXPANDIR MENU =================
    const sidebar = document.getElementById('sidebar') as HTMLElement;
    const sidebarToggleBtn = document.getElementById('sidebar-toggle') as HTMLButtonElement;
    
    // Verifica na memória se o usuário já havia deixado o menu recolhido
    const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed');
    
    if (isSidebarCollapsed === 'true') {
        sidebar.classList.add('collapsed');
    }
    
    sidebarToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        if (sidebar.classList.contains('collapsed')) {
            localStorage.setItem('sidebarCollapsed', 'true');
        } else {
            localStorage.setItem('sidebarCollapsed', 'false');
        }
    });
});