"use strict";
// Aguarda o documento carregar
document.addEventListener('DOMContentLoaded', () => {
    // ================= 1. MODO DARK / LIGHT =================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark')
            themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
        else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    });
    // ================= 2. RECOLHER / EXPANDIR MENU =================
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    // Verifica na memória se o usuário já havia deixado o menu recolhido
    const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed');
    if (isSidebarCollapsed === 'true') {
        sidebar.classList.add('collapsed');
    }
    sidebarToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        if (sidebar.classList.contains('collapsed')) {
            localStorage.setItem('sidebarCollapsed', 'true');
        }
        else {
            localStorage.setItem('sidebarCollapsed', 'false');
        }
    });
    // ================= 3. MENU DROPDOWN DO PERFIL (TOGGLE) =================
    const botaoPerfil = document.getElementById("perfil");
    const subMenuPerfil = document.getElementById("subMenuPerfil");
    botaoPerfil.addEventListener("click", (event) => {
        event.stopPropagation();
        if (subMenuPerfil.style.display === "none" || subMenuPerfil.style.display === "") {
            subMenuPerfil.style.display = "flex";
        }
        else {
            subMenuPerfil.style.display = "none";
        }
    });
    document.addEventListener("click", (event) => {
        const alvoDoClique = event.target;
        if (subMenuPerfil.style.display === "flex" && !subMenuPerfil.contains(alvoDoClique)) {
            subMenuPerfil.style.display = "none";
        }
    });
});
