document.addEventListener("DOMContentLoaded", () => {
  // Se já estiver logado, vai direto para a home
  const currentUser = JSON.parse(localStorage.getItem("roblox_current_user"));
  if (currentUser) {
    window.location.href = "../dashboard/home.html";
    return;
  }

  const loginForm = document.getElementById("loginForm");
  const loginUsernameInput = document.getElementById("loginUsername");
  const loginPasswordInput = document.getElementById("loginPassword");
  const loginError = document.getElementById("loginError");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      loginError.textContent = "";

      const username = loginUsernameInput.value.trim();
      const password = loginPasswordInput.value;

      // Puxa a lista de usuários cadastrados
      const registeredUsers = JSON.parse(localStorage.getItem("roblox_users") || "[]");

      // Procura uma conta que combine o nome de usuário e a senha
      const foundUser = registeredUsers.find(
        (user) => user.username.toLowerCase() === username.toLowerCase() && user.password === password
      );

      if (!foundUser) {
        loginError.textContent = "Nome de usuário ou senha incorretos.";
        return;
      }

      // Define como usuário logado atual
      localStorage.setItem("roblox_current_user", JSON.stringify(foundUser));

      // Redireciona para a página inicial
      window.location.href = "../dashboard/home.html";
    });
  }
});