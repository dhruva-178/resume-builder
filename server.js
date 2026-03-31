async function saveData() {
  const msg = document.getElementById("msg");
  msg.innerText = "Saving...";

  const formData = new FormData();
  formData.append("name", document.getElementById("name").value);
  formData.append("email", document.getElementById("email").value);
  formData.append("phone", document.getElementById("phone").value);
  formData.append("education", document.getElementById("education").value);
  formData.append("skills", document.getElementById("skills").value);
  formData.append("projects", document.getElementById("projects").value);

  const photoFile = document.getElementById("photo").files[0];
  if (photoFile) {
    formData.append("photo", photoFile);
  }

  try {
    const response = await fetch("/save", {
      method: "POST",
      body: formData
    });

    const result = await response.text();
    msg.innerText = result;

    if (response.ok) {
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("phone").value = "";
      document.getElementById("education").value = "";
      document.getElementById("skills").value = "";
      document.getElementById("projects").value = "";
      document.getElementById("photo").value = "";

      loadResumes();
    }
  } catch (error) {
    console.log(error);
    msg.innerText = "Error saving data";
  }
}

async function loadResumes() {
  const resumeList = document.getElementById("resumeList");
  if (!resumeList) return;

  resumeList.innerHTML = "Loading...";

  try {
    const response = await fetch("/resumes");
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      resumeList.innerHTML = "<p>No resumes saved yet.</p>";
      return;
    }

    let html = "";
    data.forEach((item) => {
      html += `
        <div class="card">
          <h3>${item.name || ""}</h3>
          <p><b>Email:</b> ${item.email || ""}</p>
          <p><b>Phone:</b> ${item.phone || ""}</p>
          <p><b>Education:</b> ${item.education || ""}</p>
          <p><b>Skills:</b> ${item.skills || ""}</p>
          <p><b>Projects:</b> ${item.projects || ""}</p>
          ${item.photo ? `<img src="/uploads/${item.photo}" alt="Photo">` : ""}
        </div>
      `;
    });

    resumeList.innerHTML = html;
  } catch (error) {
    console.log(error);
    resumeList.innerHTML = "<p>Error loading resumes.</p>";
  }
}

window.onload = loadResumes;