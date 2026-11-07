document.addEventListener("DOMContentLoaded", async () => {
  // Verifica se já existe uma sessão ativa na nuvem ou no sessionStorage do utilizador logado
  const activeUserJson = localStorage.getItem("roblox_current_user");
  if (activeUserJson) {
    window.location.href = "../dashboard/home.html";
    return;
  }

  setupBirthDateSelectors();

  const registerForm = document.getElementById("registerForm");
  const usernameInput = document.getElementById("username");
  const usernameError = document.getElementById("usernameError");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      usernameError.textContent = "";

      const username = usernameInput.value.trim();
      const password = document.getElementById("password").value;
      const day = document.getElementById("birthDay").value;
      const month = document.getElementById("birthMonth").value;
      const year = document.getElementById("birthYear").value;

      // Captura o género selecionado nos botões de rádio
      const genderSelected = document.querySelector('input[name="gender"]:checked');
      const gender = genderSelected ? genderSelected.value : "Não informado";

      const userLower = username.toLowerCase();

      try {
        // 1. Validação de Unicidade na Nuvem (Verifica se o utilizador já existe no Firestore)
        const userRef = window.fbDoc(window.db, "utilizadores", userLower);
        const userSnap = await window.fbGetDoc(userRef);

        if (userSnap.exists()) {
          usernameError.textContent = "Esse nome já foi usado, use outro";
          return;
        }

        // 2. Registo da data e hora da criação
        const now = new Date();
        const formattedShortDate = now.toLocaleDateString("pt-BR");
        const formattedTime = now.toLocaleTimeString("pt-BR");
        const formattedFullDate = `Criado em: ${formattedShortDate} às ${formattedTime}`;
        const birthdateFormatted = `${day}/${month}/${year}`;

        // Estrutura completa da nova conta compatível com a auditoria e transações
        const newUser = {
          username: username,
          password: password,
          passwordHistory: [password],
          gender: gender,
          birthdate: birthdateFormatted,
          createdAtShort: formattedShortDate,
          createdAtFull: formattedFullDate,
          createdAtTimestamp: now.getTime(),
          robux: 250,
          txLogs: [{
            id: Date.now(),
            type: "rewards",
            title: "Bônus de Criação de Conta",
            amount: 250,
            timestamp: now.getTime(),
            dateStr: `${formattedShortDate} ${formattedTime}`
          }],
          friends: []
        };

        // 3. Salva o documento completo do utilizador na nuvem (Firestore)
        await window.fbSetDoc(userRef, newUser);

        // Guarda a sessão localmente apenas para saber quem está logado neste dispositivo atual
        localStorage.setItem("roblox_current_user", JSON.stringify(newUser));

        // 4. Redireciona para a página inicial após criar a conta com sucesso
        window.location.href = "../dashboard/home.html";

      } catch (error) {
        console.error("Erro ao registrar conta na nuvem:", error);
        usernameError.textContent = "Erro de conexão com a nuvem. Tente novamente.";
      }
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
  const minYear = 1889;

  for (let y = currentYear; y >= minYear; y--) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }
}