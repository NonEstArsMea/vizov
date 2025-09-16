

function openModal() {
    const modal = document.getElementById("videoModal");
    const video = document.getElementById("modalVideo");

    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
        video.play().catch(e => {
            console.log("Автовоспроизведение заблокировано");
        });
    }, 300);
}

function closeVideoModal() {
    const modal = document.getElementById("videoModal");
    modal.classList.remove("active");
    document.body.style.overflow = ""; // возвращаем скролл

    const video = document.getElementById("modalVideo");
    video.pause();
    video.currentTime = 0;
}

// клик по фону
document.getElementById("videoModal").addEventListener("click", e => {
    if (e.target === e.currentTarget) closeVideoModal();
});

// закрытие по Esc
document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeVideoModal();
});


// Функция прокрутки к записи
function scrollToSignup() {
  const signupSection = document.getElementById('signup');
  if (signupSection) {
    signupSection.scrollIntoView({ behavior: 'smooth' });
  } else {
    console.log('Секция записи не найдена, проверьте id="signup"');
  }
}

