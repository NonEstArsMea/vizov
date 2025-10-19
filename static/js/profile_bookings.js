document.addEventListener('DOMContentLoaded', function() {
    // Переключение между основной и дополнительной информацией
    const toggleButtons = document.querySelectorAll('.toggle-info-btn');

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookingCard = this.closest('.booking-card');
            const details = bookingCard.querySelector('.booking-details');
            const info = bookingCard.querySelector('.booking-info');
            const toggleIcon = this.querySelector('.toggle-icon');
            const toggleText = this.querySelector('.toggle-text');

            const isShowingDetails = details.classList.contains('active');

            // Анимация кнопки
            animateButton(this);

            if (isShowingDetails) {
                // Переключаем на дополнительную информацию
                switchToInfo(details, info, toggleIcon, toggleText);
            } else {
                // Переключаем на основную информацию
                switchToDetails(details, info, toggleIcon, toggleText);
            }
        });
    });
    

    // Функция переключения на дополнительную информацию
    function switchToInfo(details, info, toggleIcon, toggleText) {
        // Плавно скрываем детали
        details.style.opacity = '0';
        details.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            details.classList.remove('active');

            // Показываем информацию
            info.classList.add('active');
            setTimeout(() => {
                info.style.opacity = '1';
                info.style.transform = 'translateY(0)';
            }, 50);

            // Обновляем кнопку
            toggleIcon.textContent = '📋';
            toggleText.textContent = 'Основное';
        }, 200);
    }

    // Функция переключения на основную информацию
    function switchToDetails(details, info, toggleIcon, toggleText) {
        // Плавно скрываем информацию
        info.style.opacity = '0';
        info.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            info.classList.remove('active');

            // Показываем детали
            details.classList.add('active');
            setTimeout(() => {
                details.style.opacity = '1';
                details.style.transform = 'translateY(0)';
            }, 50);

            // Обновляем кнопку
            toggleIcon.textContent = '📖';
            toggleText.textContent = 'Подробнее';
        }, 200);
    }

    // Анимация кнопки
    function animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }

    // Обработка отмены бронирования
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    const cancelModal = document.getElementById('cancelModal');
    const modalClose = cancelModal.querySelector('.modal-close');
    const cancelNo = document.getElementById('cancelNo');
    const cancelYes = document.getElementById('cancelYes');

    let currentBooking = null;

    cancelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-booking-id');
            const bookingCard = this.closest('.booking-card');
            const title = bookingCard.querySelector('.booking-title').textContent;
            const dateElement = bookingCard.querySelector('.detail-value');
            const date = dateElement ? dateElement.textContent : 'Дата не указана';

            currentBooking = bookingId;
            document.getElementById('modalBookingTitle').textContent = title;
            document.getElementById('modalBookingDate').textContent = date;

            showModal(cancelModal);
        });
    });

    // Показать модальное окно
    function showModal(modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    // Скрыть модальное окно
    function hideModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    // Закрытие модального окна
    function closeCancelModal() {
        hideModal(cancelModal);
        currentBooking = null;
        document.getElementById('cancelReason').value = '';
        document.getElementById('cancelComment').value = '';
    }

    modalClose.addEventListener('click', closeCancelModal);
    cancelNo.addEventListener('click', closeCancelModal);

    // Подтверждение отмены бронирования
    cancelYes.addEventListener('click', function() {
        if (currentBooking) {
            const reason = document.getElementById('cancelReason').value;
            const comment = document.getElementById('cancelComment').value;

            // Симуляция запроса к серверу
            simulateCancelBooking(currentBooking, reason, comment);
        }
    });

    // Симуляция отмены бронирования
    function simulateCancelBooking(bookingId, reason, comment) {
        // Показываем индикатор загрузки
        const cancelYes = document.getElementById('cancelYes');
        const originalText = cancelYes.innerHTML;
        cancelYes.innerHTML = '⏳ Отменяем...';
        cancelYes.disabled = true;

        // Имитируем запрос к серверу
        setTimeout(() => {
            const bookingCard = document.querySelector(`[data-booking-id="${bookingId}"]`).closest('.booking-card');

            if (bookingCard) {
                // Анимация удаления карточки
                animateCardRemoval(bookingCard, () => {
                    // Обновляем статистику
                    updateStats();

                    // Закрываем модальное окно
                    closeCancelModal();

                    // Показываем уведомление об успехе
                    showNotification('Бронирование успешно отменено!', 'success');
                });
            }

            // Восстанавливаем кнопку
            cancelYes.innerHTML = originalText;
            cancelYes.disabled = false;

        }, 1500);
    }

    // Анимация удаления карточки
    function animateCardRemoval(card, callback) {
        card.style.transform = 'scale(0.95)';
        card.style.opacity = '0.5';

        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.transform = 'translateX(100%) rotate(5deg)';
            card.style.opacity = '0';

            setTimeout(() => {
                card.remove();
                if (callback) callback();
            }, 500);
        }, 200);
    }

    // Обновление статистики
    function updateStats() {
        const bookings = document.querySelectorAll('.booking-card');
        const totalBookings = bookings.length;
        const confirmedBookings = Array.from(bookings).filter(card =>
            card.querySelector('.booking-badge').textContent.includes('Подтверждено')
        ).length;
        const soonBookings = Array.from(bookings).filter(card =>
            card.querySelector('.booking-urgency').textContent.includes('Скоро')
        ).length;

        // Анимированное обновление цифр
        animateCounter('.stat-number:nth-child(1)', totalBookings);
        animateCounter('.stat-number:nth-child(2)', confirmedBookings);
        animateCounter('.stat-number:nth-child(3)', soonBookings);

        // Если броней не осталось, показываем пустое состояние
        if (totalBookings === 0) {
            setTimeout(() => {
                showEmptyState();
            }, 1000);
        }
    }

    // Анимация счетчика
    function animateCounter(selector, targetValue) {
        const element = document.querySelector(selector);
        if (!element) return;

        const currentValue = parseInt(element.textContent) || 0;
        const duration = 500;
        const stepTime = 50;
        const steps = duration / stepTime;
        const increment = (targetValue - currentValue) / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const value = Math.round(currentValue + (increment * currentStep));
            element.textContent = value;

            if (currentStep >= steps) {
                element.textContent = targetValue;
                clearInterval(timer);
            }
        }, stepTime);
    }

    // Показать пустое состояние
    function showEmptyState() {
        const bookingsGrid = document.querySelector('.bookings-grid');
        const bookingsStats = document.querySelector('.bookings-stats');

        if (bookingsGrid && bookingsStats) {
            bookingsGrid.style.display = 'none';
            bookingsStats.style.display = 'none';

            // Показываем анимированное появление пустого состояния
            const emptyState = document.querySelector('.empty-bookings');
            if (emptyState) {
                emptyState.style.display = 'block';
                emptyState.style.animation = 'fadeInUp 0.8s ease';
            }
        }
    }

    // Показать уведомление
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-text">${message}</span>
        `;

        // Стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(notification);

        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Автоматическое скрытие
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Получить иконку для уведомления
    function getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    // Получить цвет для уведомления
    function getNotificationColor(type) {
        const colors = {
            success: 'rgba(0, 184, 148, 0.9)',
            error: 'rgba(255, 71, 87, 0.9)',
            warning: 'rgba(255, 165, 0, 0.9)',
            info: 'rgba(255, 94, 0, 0.9)'
        };
        return colors[type] || colors.info;
    }

    // Обработка кнопки "Поделиться"
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookingCard = this.closest('.booking-card');
            const title = bookingCard.querySelector('.booking-title').textContent;
            const dateElement = bookingCard.querySelector('.detail-value');
            const date = dateElement ? dateElement.textContent : '';

            shareBooking(title, date, this);
        });
    });

    // Функция шаринга
    function shareBooking(title, date, button) {
        const shareData = {
            title: 'Мое бронирование - Вызов 01',
            text: `Я записался на "${title}" ${date}`,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData)
                .then(() => {
                    showNotification('Успешно поделились!', 'success');
                })
                .catch(() => {
                    fallbackShare(shareData.text, button);
                });
        } else {
            fallbackShare(shareData.text, button);
        }
    }

    // Fallback для шаринга
    function fallbackShare(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = button.innerHTML;
            button.innerHTML = '✅ Скопировано!';
            button.style.background = 'rgba(0, 184, 148, 0.2)';
            button.style.color = '#00b894';
            button.style.border = '1px solid rgba(0, 184, 148, 0.5)';

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = '';
                button.style.color = '';
                button.style.border = '';
            }, 2000);
        }).catch(() => {
            showNotification('Не удалось скопировать ссылку', 'error');
        });
    }

    // Закрытие модального окна по клику вне его
    cancelModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeCancelModal();
        }
    });

    // Обработка клавиши Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cancelModal.classList.contains('active')) {
            closeCancelModal();
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        // Улучшение выпадающего списка
        const cancelReason = document.getElementById('cancelReason');
        if (cancelReason) {
            // Добавляем кастомные стили для выпадающего списка
            cancelReason.addEventListener('focus', function() {
                this.style.background = 'rgba(40, 40, 40, 0.9)';
            });

            cancelReason.addEventListener('blur', function() {
                this.style.background = 'rgba(30, 30, 30, 0.9)';
            });
        }

        // Улучшение текстового поля
        const cancelComment = document.getElementById('cancelComment');
        if (cancelComment) {
            cancelComment.addEventListener('focus', function() {
                this.style.background = 'rgba(40, 40, 40, 0.9)';
            });

            cancelComment.addEventListener('blur', function() {
                this.style.background = 'rgba(30, 30, 30, 0.9)';
            });
        }
    });

    // Инициализация прогресс-баров
    function initializeProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';

            setTimeout(() => {
                bar.style.transition = 'width 1s ease-in-out';
                bar.style.width = targetWidth;
            }, 500);
        });
    }

    // Запуск инициализации
    initializeProgressBars();
});