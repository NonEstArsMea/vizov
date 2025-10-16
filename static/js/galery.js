const galleryImages = [
    { src: '/static/images/DSCF6958.webp', alt: 'Мероприятие Вызов-01' },
    { src: '/static/images/DSCF7222.webp', alt: 'Мероприятие Вызов-01' },
    { src: '/static/images/DSCF7271.webp', alt: 'Мероприятие Вызов-01' },
    { src: '/static/images/DSCF7828.webp', alt: 'Мероприятие Вызов-01' },
    { src: '/static/images/DSCF7940.webp', alt: 'Мероприятие Вызов-01' },
    { src: '/static/images/DSCF9252.webp', alt: 'Мероприятие Вызов-01' },
    { src: '/static/images/p1.webp', alt: 'Мероприятие Вызов-01' }
];

let currentImageIndex = 0;

// Функция переключения изображений
function changeImage(direction) {
    currentImageIndex += direction;

    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }

    const image = galleryImages[currentImageIndex];
    const modalImage = document.getElementById('modalImage');

    // Плавная смена
    modalImage.style.opacity = 0;

    setTimeout(() => {
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalImage.style.opacity = 1;
    }, 200);
}

// Обработка клавиш
function handleKeyPress(e) {
    if (e.key === 'ArrowLeft') changeImage(-1);
    if (e.key === 'ArrowRight') changeImage(1);
    if (e.key === 'Escape') closeImageModal();
}

// Открытие модального окна
function openGalleryModal(clickedImage) {
    const imageSrc = clickedImage.dataset.imageSrc;

    // Находим индекс изображения
    currentImageIndex = galleryImages.findIndex(img => img.src === imageSrc);
    if (currentImageIndex === -1) currentImageIndex = 0;

    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const image = galleryImages[currentImageIndex];

    modalImage.src = image.src;
    modalImage.alt = image.alt;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyPress);
}

// Закрытие модального окна
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeyPress);
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            openGalleryModal(this);
        });
    });

    // Закрытие по клику вне окна
    document.getElementById('imageModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeImageModal();
        }
    });

    // Кнопки навигации
    document.querySelector('.prev-btn')?.addEventListener('click', () => changeImage(-1));
    document.querySelector('.next-btn')?.addEventListener('click', () => changeImage(1));
});