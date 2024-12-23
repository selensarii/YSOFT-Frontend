const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");
const addEmployeeBtn = document.getElementById("add-employee-btn");
const addEmployeeForm = document.getElementById("add-employee-form");
const employeeForm = document.getElementById("employee-form");
const employeesTable = document
  .getElementById("employees-table")
  .getElementsByTagName("tbody")[0];

// Menü açma ve kapama
menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

// Dark mode geçişi
themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");

  themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
  themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
});

// Bölüm gösterme fonksiyonu
const showSection = (sectionId) => {
  // Tüm bölümleri gizle
  document.querySelectorAll("main").forEach((main) => {
    main.style.display = "none";
  });

  // İlgili bölümü göster
  document.getElementById(sectionId).style.display = "block";

  // Aktif menü öğesini güncelle
  document.querySelectorAll("aside .sidebar a").forEach((link) => {
    link.classList.remove("active");
  });

  document
    .querySelector(`aside .sidebar a[onclick="showSection('${sectionId}')"]`)
    .classList.add("active");
};

// "Yeni Çalışan" butonuna tıklayınca formu göster
addEmployeeBtn.addEventListener("click", () => {
  addEmployeeForm.style.display = "block";
});

// Çalışan Ekleme Formu Gönderildiğinde
employeeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Formdaki verileri al
  const employeeName = document.getElementById("employee-name").value;
  const position = document.getElementById("position").value;
  const project = document.getElementById("project").value;

  // Yeni çalışan objesi oluştur
  const newEmployee = {
    name: employeeName,
    role: position,
    projectId: project,
  };

  // API'ye POST isteği göndererek yeni çalışanı ekle
  fetch("https://localhost:7104/api/Employee", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newEmployee),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Çalışan başarıyla eklendiyse tabloyu güncelle
      updateEmployeeTable([data]); // Tabloyu sadece yeni çalışanla güncelle
    })
    .catch((error) => {
      console.error("Yeni çalışan eklenirken hata oluştu:", error);
    });

  // Formu gizle ve temizle
  addEmployeeForm.style.display = "none";
  employeeForm.reset();
});

// Başlangıçta Anasayfa gösterilir
showSection("anasayfa");

// Yeni Çalışan Ata butonuna tıklama işlemi
const addProjectBtn = document.getElementById("add-project-btn");
const addProjectForm = document.getElementById("add-project-form");
const projectForm = document.getElementById("project-form");

// Butona tıklandığında formu göster
addProjectBtn.addEventListener("click", () => {
  addProjectForm.style.display = "block";
});

// Proje Ekleme formunu kaydet
projectForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Formdan verileri al
  const selectedProject = document.getElementById("select-project").value;
  const selectedEmployees = Array.from(
    document.getElementById("employees").selectedOptions
  ).map((option) => option.value);

  // Proje ve çalışanları yeni satır olarak tabloya ekle
  const tbody = document.querySelector("#projects-table tbody");
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${selectedProject}</td>
    <td>${new Date().toLocaleDateString()}</td>
    <td><div class="employee-list">${selectedEmployees
      .map((emp) => `<span>${emp}</span>`)
      .join("")}</div></td>
    <td><button class="delete-btn">Sil</button></td>
  `;

  tbody.appendChild(newRow);

  // Formu sıfırla ve gizle
  projectForm.reset();
  addProjectForm.style.display = "none";
});

// Çalışan verilerini al
fetch("https://localhost:7104/api/Employee")
  .then((response) => {
    return response.json(); // JSON formatında veriyi al
  })
  .then((data) => {
    // Çalışanlar verisini al ve tabloyu güncelle
    const employees = data.$values;
    if (!employees || employees.length === 0) {
      console.log("Veri bulunamadı ya da boş bir dizi döndü.");
    } else {
      updateEmployeeTable(employees); // updateEmployeeTable fonksiyonunu çağır
    }
  })
  .catch((error) => {
    console.error("Error fetching employees:", error);
  });

// Çalışanları tabloya ekleme fonksiyonu
function updateEmployeeTable(employees) {
  const tableBody = document.querySelector("#employees-table tbody");
  tableBody.innerHTML = ""; // Önceki veriyi temizle

  employees.forEach((employee, index) => {
    // Tabloya yeni satır ekle
    const row = document.createElement("tr");

    // Çalışan adı
    const nameCell = document.createElement("td");
    nameCell.textContent = employee.name || "Bilinmiyor"; // Kontrol ekle
    row.appendChild(nameCell);

    // Pozisyon
    const roleCell = document.createElement("td");
    roleCell.textContent = employee.role || "Bilinmiyor"; // Kontrol ekle
    row.appendChild(roleCell);

    // Başlangıç tarihi
    const startDateCell = document.createElement("td");
    startDateCell.textContent = employee.startDate || "Bilgi Yok"; // Varsayılan değer ekle
    row.appendChild(startDateCell);

    // Proje
    const projectCell = document.createElement("td");
    projectCell.textContent = employee.projectId
      ? `Proje ID: ${employee.projectId}`
      : "Atanmadı";
    row.appendChild(projectCell);

    // Aksiyon
    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "İşten Çıkar";
    deleteButton.classList.add("delete-btn");

    // Silme butonuna tıklama olayı
    deleteButton.addEventListener("click", () => {
      deleteEmployee(employee.id, row); // Silme işlemi
    });

    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);

    // Satırı tabloya ekle
    tableBody.appendChild(row);
  });
}

// Çalışanı silme işlemi
function deleteEmployee(employeeId, row) {
  fetch(`https://localhost:7104/api/Employee/${employeeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        // Başarılı bir şekilde silindiğinde
        console.log(`Çalışan (ID: ${employeeId}) başarıyla silindi.`);
        // Satırı tablodan sil
        row.remove();
      } else {
        console.error("Silme işlemi başarısız oldu.");
      }
    })
    .catch((error) => {
      console.error("Silme işlemi sırasında hata oluştu:", error);
    });
}
