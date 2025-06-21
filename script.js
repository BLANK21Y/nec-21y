function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
}

(function () {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
  }
})();

function redirectToDetails() {
  const year = document.getElementById("yearSelect").value;
  const branch = document.getElementById("branchSelect").value;
  if (!year || !branch) {
    alert("Please select both year and branch.");
    return;
  }
  window.location.href = `details.html?year=${year}&branch=${branch}`;
}

let allStudents = [];

function getStudentDetails(year, branch) {
  const filePath = `excel_sheets/${year}_batch_${branch}.xlsx`;

  fetch(filePath)
    .then(res => res.arrayBuffer())
    .then(buffer => {
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);
      allStudents = data;
      displayStudents(data);
    })
    .catch(err => {
      alert("Failed to load the file. Make sure it exists.");
      console.error(err);
    });
}

function displayStudents(students) {
  const container = document.getElementById("studentList");
  container.innerHTML = "";

  if (!students.length) {
    container.innerHTML = `<p>No students found.</p>`;
    return;
  }

  students.forEach(student => {
    const roll = student["Roll No./Register No."] || student["Roll Number"] || "unknown";
    const fullName = `${student["First Name"] || ""} ${student["Last Name"] || ""}`.trim();
    const father = `${student["Father Name"] || ""} ${student["Father Last Name"] || ""}`.trim();
    const studentMobile = student["Mobile No."] || "";
    const parentMobile = student["Father Address Mobile Number"] || student["Father Address Phone Number"] || "";
    const email = student["Email"] || "";

    const div = document.createElement("div");
    div.className = "student-card";

    div.innerHTML = `
      <img class="zoom-img" src="img/${roll}.jpg" alt="${roll}" onerror="this.onerror=null;this.src='img/default.jpg';" />
      <div class="student-info">
        <h3>${fullName}</h3>
        <p><strong>Roll No:</strong> ${roll}</p>
        ${father ? `<p><strong>Father:</strong> ${father}</p>` : ""}
        ${studentMobile ? `
          <p>
            <strong>Student:</strong> ${studentMobile}
            <span class="inline-btns">
              <a href="tel:${studentMobile}">📞</a>
              <a href="sms:${studentMobile}">💬</a>
            </span>
          </p>` : ""}
        ${parentMobile ? `
          <p>
            <strong>Parent:</strong> ${parentMobile}
            <span class="inline-btns">
              <a href="tel:${parentMobile}">📞</a>
              <a href="sms:${parentMobile}">💬</a>
            </span>
          </p>` : ""}
        ${email ? `
          <p>
            <strong>Email:</strong>
            <a href="mailto:${email}" style="color: var(--accent); font-size: 12px;">${email}</a>
            <span class="inline-btns">
              <a href="mailto:${email}">✉️</a>
            </span>
          </p>` : ""}
      </div>
    `;
    container.appendChild(div);
  });
}

function filterStudents() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const filtered = allStudents.filter(student =>
    Object.values(student).some(
      value => value && value.toString().toLowerCase().includes(search)
    )
  );
  displayStudents(filtered);
}
