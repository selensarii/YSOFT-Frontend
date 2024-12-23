const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await registerUser();
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await loginUser();
  });
});

async function registerUser() {
  const username = document.getElementById("registerName").value;
  const password = document.getElementById("registerPassword").value;

  try {
    const response = await fetch("https://localhost:7104/api/User/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, role: "user" }),
    });

    const messageDiv = document.getElementById("message");
    if (response.ok) {
      messageDiv.innerHTML = `<p class="success">Kayıt Başarılı!</p>`;

      // Kayıt başarılı olduktan sonra giriş sekmesine geçiş yap
      container.classList.remove("active"); // Kayıt formunu gizle
      setTimeout(() => {
        document.getElementById("login").click(); // Giriş sekmesini tıkla
      }, 1000); // 1 saniye bekleyip giriş formuna yönlendir
    } else {
      const errorData = await response.json();
      messageDiv.innerHTML = `<p class="error">Kayıt Başarısız: ${
        errorData.message || "Bilinmeyen bir hata"
      }</p>`;
    }
  } catch (error) {
    console.error("Kayıt Hatası:", error);
    alert("Sunucuya bağlanırken bir hata oluştu.");
  }
}

async function loginUser() {
  const username = document.getElementById("loginName").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch("https://localhost:7104/api/User/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const messageDiv = document.getElementById("message");
    if (response.ok) {
      const data = await response.json();
      messageDiv.innerHTML = `<p class="success">Giriş Başarılı! Token: ${data.token}</p>`;

      // Başarılı giriş sonrası yönlendirme
      window.location.href = "index.html"; // Giriş başarılıysa ana sayfaya yönlendir
    } else {
      const errorData = await response.json();
      messageDiv.innerHTML = `<p class="error">Giriş Başarısız: ${
        errorData.message || "Bilinmeyen bir hata"
      }</p>`;
    }
  } catch (error) {
    console.error("Giriş Hatası:", error);
    alert("Sunucuya bağlanırken bir hata oluştu.");
  }
}
