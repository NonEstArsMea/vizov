// Функция для показа уведомлений
function showToast(message) {
    // Удаляем предыдущий toast если существует
    const oldToast = document.querySelector('.z-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'z-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Показываем toast
    requestAnimationFrame(() => toast.classList.add('show'));

    // Скрываем через 3 секунды
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Функция копирования в буфер обмена
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Скопировано: ' + text);
    } catch (e) {
        // Fallback для старых браузеров
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showToast('Скопировано: ' + text);
            } else {
                showToast('Не удалось скопировать');
            }
        } catch (err) {
            showToast('Ошибка копирования');
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

// Заглушки для функций
function openLoginModal() {
    showToast('Форма входа будет здесь');
}

document.addEventListener("DOMContentLoaded", function () {
    const burger = document.getElementById("burger");
    const mobileMenu = document.getElementById("mobileMenu");

    // открытие/закрытие
    burger.addEventListener("click", function () {
        mobileMenu.classList.toggle("show");
        burger.classList.toggle("active");
    });

    // закрытие при клике по ссылке
    document.querySelectorAll(".mobile-menu a, .mobile-menu button").forEach(item => {
        item.addEventListener("click", () => {
            mobileMenu.classList.remove("show");
            burger.classList.remove("active");
        });
    });
});