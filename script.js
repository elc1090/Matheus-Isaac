const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:3000/api"
  : "https://wger-proxy-fixed.onrender.com/api"; // substitua pela URL do seu backend online, se precisar

async function fetchData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    console.error("Erro ao buscar dados:", err);
    return null;
  }
}

async function getExercises() {
  const list = document.getElementById("exercise-list");
  list.innerHTML = "Carregando...";

  const data = await fetchData(`${API_BASE}/exerciseinfo/?language=2&limit=20`);
  console.log("✅ Dados recebidos:", data); // DEBUG

  list.innerHTML = "";

  if (!data || !data.results) {
    list.innerHTML = "Nenhum exercício encontrado.";
    return;
  }

  for (const e of data.results) {
    const translation = e.translations?.find(t => t.language === 2);
    const name = translation?.name || "Sem nome";
    const description = translation?.description
      ? translation.description.replace(/<[^>]*>/g, '')
      : "Sem descrição";
    const category = e.category?.name || "Sem categoria";

    // Buscar imagem do exercício
    const images = await fetchData(`${API_BASE}/exerciseimage/?exercise=${e.id}`);
    const imgUrl = images?.results?.[0]?.image || "https://via.placeholder.com/300x200?text=Sem+Imagem";

    // Criar o card
    const card = document.createElement("div");
    card.className = "bg-white shadow-md rounded-lg overflow-hidden";

    card.innerHTML = `
      <img src="${imgUrl}" alt="${name}" class="w-full h-48 object-cover">
      <div class="p-4">
        <h2 class="text-xl font-semibold mb-2">${name}</h2>
        <p class="text-sm text-gray-600 mb-2"><strong>Categoria:</strong> ${category}</p>
        <p class="text-gray-700 text-sm">${description}</p>
      </div>
    `;

    list.appendChild(card);
  }
}

async function getWorkouts() {
  const list = document.getElementById("workout-list");
  list.innerHTML = "Carregando planos de treino...";

  const data = await fetchData(`${API_BASE}/workout/`);
  console.log("📋 Planos recebidos:", data); // DEBUG

  list.innerHTML = "";

  if (!data || !data.results) {
    list.innerHTML = "Nenhum plano de treino encontrado.";
    return;
  }

  data.results.forEach(plan => {
    const li = document.createElement("li");
    li.textContent = `Plano: ${plan.name || 'Sem nome'}`;
    list.appendChild(li);
  });
}