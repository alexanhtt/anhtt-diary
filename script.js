async function login() {
    const password = document.getElementById("pass").value;
    const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (data.success) {
        document.getElementById("login").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
        document.getElementById("date").classList.remove("hidden");
        document.getElementById("content").classList.remove("hidden");
        loadDiary();
    } else {
        alert("Sai mật khẩu");
    }
}

async function loadDiary() {
    try {
        const res = await fetch("/diary");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        window.diaryData = Array.isArray(data) ? data : [];
        loadData();
    } catch (err) {
        console.error("Failed to load diary:", err);
        window.diaryData = [];
        document.getElementById("content").innerText = "Lỗi tải dữ liệu";
    }
}

function loadData() {
    const date = document.getElementById("date").value;
    const contentDiv = document.getElementById("content");

    if (!window.diaryData || !Array.isArray(window.diaryData)) {
        contentDiv.innerText = "Dữ liệu chưa tải.";
        return;
    }

    const entry = window.diaryData.find(e => e.date === date);

    if (entry) {
        contentDiv.innerHTML = entry.content;
    } else {
        contentDiv.innerHTML = "Không có nội dung cho ngày này.";
    }
}

// Load diary khi trang tải
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
    document.getElementById('date').value = today;
    // Không loadDiary ở đây, chỉ sau login
});