function updatePreview() {
  document.getElementById("pName").innerText = document.getElementById("name").value;
  document.getElementById("pEmail").innerText = document.getElementById("email").value;
  document.getElementById("pPhone").innerText = document.getElementById("phone").value;
  document.getElementById("pEducation").innerText = document.getElementById("education").value;
  document.getElementById("pSkills").innerText = document.getElementById("skills").value;
  document.getElementById("pProjects").innerText = document.getElementById("projects").value;
}

function previewImage(event) {
  const reader = new FileReader();
  reader.onload = function() {
    document.getElementById("previewPhoto").src = reader.result;
  }
  reader.readAsDataURL(event.target.files[0]);
}

async function saveData() {
  const formData = new FormData();

  formData.append("name", document.getElementById("name").value);
  formData.append("email", document.getElementById("email").value);
  formData.append("phone", document.getElementById("phone").value);
  formData.append("education", document.getElementById("education").value);
  formData.append("skills", document.getElementById("skills").value);
  formData.append("projects", document.getElementById("projects").value);

  const file = document.getElementById("photo").files[0];
  if (file) formData.append("photo", file);

  const res = await fetch("http://localhost:5000/save", {
    method: "POST",
    body: formData
  });

  const data = await res.text();
  alert(data);

  loadResumes();
}

function downloadPDF() {
  const element = document.querySelector(".resume");
  html2pdf().from(element).save("Resume.pdf");
}

async function loadResumes() {
  const res = await fetch("http://localhost:5000/resumes");
  const data = await res.json();

  let html = "";
  data.forEach(r => {
    html += `<div><b>${r.name}</b><br>${r.email}</div>`;
  });

  document.getElementById("list").innerHTML = html;
}

window.onload = loadResumes;