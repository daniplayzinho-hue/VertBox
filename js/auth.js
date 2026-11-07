document.addEventListener("DOMContentLoaded", () => {
  // Se já tiver uma conta logada, vai direto para a página inicial
  const currentUser = JSON.parse(localStorage.getItem("roblox_current_user"));
  if (currentUser) {
    window.location.href = "../dashboard/home.html";
    return;
  }

  setupBirthDateSelectors();

  const registerForm = document.getElementById("registerForm");
  const usernameInput = document.getElementById("username");
  const usernameError = document.getElementById("usernameError");

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      usernameError.textContent = "";

      const username = usernameInput.value.trim();
      const password = document.getElementById("password").value;
      const day = document.getElementById("birthDay").value;
      const month = document.getElementById("birthMonth").value;
      const year = document.getElementById("birthYear").value;

      // 1. Validação de Unicidade (Nome único)
      const registeredUsers = JSON.parse(localStorage.getItem("roblox_users") || "[]");
      const userExists = registeredUsers.some(
        (user) => user.username.toLowerCase() === username.toLowerCase()
      );

      if (userExists) {
        usernameError.textContent = "Esse nome já foi usado, use outro";
        return;
      }

      // 2. Registro da data e hora da criação
      const now = new Date();
      const formattedShortDate = now.toLocaleDateString("pt-BR");
      const formattedFullDate = `Criado em: ${now.toLocaleDateString("pt-BR")} às ${now.toLocaleTimeString("pt-BR")}`;

      const newUser = {
        username: username,
        password: password,
        birthDate: `${year}-${month}-${day}`,
        createdAtShort: formattedShortDate,
        createdAtFull: formattedFullDate,
        robux: 0
      };

      registeredUsers.push(newUser);
      localStorage.setItem("roblox_users", JSON.stringify(registeredUsers));
      localStorage.setItem("roblox_current_user", JSON.stringify(newUser));

      // 3. Redireciona para o Início após criar a conta
      window.location.href = "../dashboard/home.html";
    });
  }
});

function setupBirthDateSelectors() {
  const daySelect = document.getElementById("birthDay");
  const yearSelect = document.getElementById("birthYear");

  if (!daySelect || !yearSelect) return;

  for (let i = 1; i <= 31; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    daySelect.appendChild(opt);
  }

  const currentYear = new Date().getFullYear();
  const minYear = 1895;

  for (let y = currentYear; y >= minYear; y--) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }
}