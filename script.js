/* ========================================================
   NEKO POKE - JAVASCRIPT FUNCIONAL COMPLETO
   Builder interativo + Carrinho + Modais + Filtros
======================================================== */

// ==========================================
// ESTADO GLOBAL DO SITE
// ==========================================
let cart = [];
let pokeBuilder = {
  base: 'Arroz Japonês (Shari)',
  proteinas: [],
  molhos: [],
  toppings: []
};

let userInfo = {
  name: '',
  email: '',
  phone: '',
  address: ''
};

// ==========================================
// 1. MENU MOBILE TOGGLE
// ==========================================
const mobileToggle = document.getElementById('mobile-toggle');
const mobileNav = document.getElementById('mobile-nav');

if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('hidden');
  });
}

// Fechar menu ao clicar em um link
document.querySelectorAll('.mobile-item').forEach(item => {
  item.addEventListener('click', () => {
    mobileNav.classList.add('hidden');
  });
});

// ==========================================
// 2. BUILDER DE POKE - SELEÇÃO DE BASE
// ==========================================
function selecionarBase(baseEscolhida) {
  pokeBuilder.base = baseEscolhida;
  
  // Atualizar UI dos botões
  document.querySelectorAll('.poke-base-btn').forEach(btn => {
    const isSelected = btn.dataset.base === baseEscolhida;
    btn.classList.toggle('border-pastel-orange', isSelected);
    btn.classList.toggle('bg-pastel-orange/10', isSelected);
    
    const checkIcon = btn.querySelector('.check-icon');
    checkIcon.classList.toggle('text-white', isSelected);
    checkIcon.classList.toggle('bg-pastel-orange', isSelected);
    checkIcon.classList.toggle('border-pastel-orange', isSelected);
  });
  
  // Atualizar summary
  document.getElementById('summary-base').textContent = baseEscolhida;
  
  console.log('✓ Base selecionada:', baseEscolhida);
}

// Selecionar base padrão ao carregar
document.addEventListener('DOMContentLoaded', () => {
  selecionarBase('Arroz Japonês (Shari)');
});

// ==========================================
// 3. BUILDER DE POKE - INGREDIENTES COM LIMITE
// ==========================================
function alternarIngrediente(categoria, ingrediente, maxLimite) {
  const lista = pokeBuilder[categoria];
  const index = lista.indexOf(ingrediente);
  
  if (index > -1) {
    // Remover se já está selecionado
    lista.splice(index, 1);
  } else {
    // Adicionar se não atingiu o limite
    if (lista.length < maxLimite) {
      lista.push(ingrediente);
    } else {
      alert(`Máximo de ${maxLimite} ${categoria} atingido!`);
      return;
    }
  }
  
  // Atualizar UI
  atualizarUIIngredientes(categoria);
  
  console.log(`✓ ${categoria}:`, pokeBuilder[categoria]);
}

function atualizarUIIngredientes(categoria) {
  const seletores = {
    proteinas: { grupo: '#group-proteinas', badge: '#badge-count-protein', summary: '#summary-proteinas', max: 2 },
    molhos: { grupo: '#group-molhos', badge: '#badge-count-molhos', summary: '#summary-molhos', max: 2 },
    toppings: { grupo: '#group-toppings', badge: '#badge-count-toppings', summary: '#summary-toppings', max: 3 }
  };
  
  const config = seletores[categoria];
  const items = pokeBuilder[categoria];
  
  // Atualizar checkboxes visuais
  document.querySelectorAll(config.grupo + ' .poke-item-btn').forEach(btn => {
    const nomeItem = btn.dataset.item;
    const isSelected = items.includes(nomeItem);
    
    btn.classList.toggle('border-pastel-orange', isSelected);
    btn.classList.toggle('bg-pastel-orange/10', isSelected);
    
    const checkIcon = btn.querySelector('.check-icon');
    checkIcon.classList.toggle('text-white', isSelected);
    checkIcon.classList.toggle('bg-pastel-orange', isSelected);
    checkIcon.classList.toggle('border-pastel-orange', isSelected);
  });
  
  // Atualizar badge de contagem
  document.querySelector(config.badge).textContent = `Escolher até ${config.max} (${items.length}/${config.max})`;
  
  // Atualizar summary
  const summaryEl = document.querySelector(config.summary);
  if (items.length === 0) {
    summaryEl.textContent = `Nenhum selecionado (escolha até ${config.max})`;
    summaryEl.classList.remove('text-charcoal-800');
    summaryEl.classList.add('text-charcoal-400');
  } else {
    summaryEl.textContent = items.join(', ');
    summaryEl.classList.remove('text-charcoal-400');
    summaryEl.classList.add('text-charcoal-800');
  }
}

// ==========================================
// 4. ADICIONAR POKE PERSONALIZADO AO CARRINHO
// ==========================================
function adicionarPokePersonalizadoAoCarrinho() {
  const item = {
    id: Date.now(),
    nome: 'Poke Personalizado Neko',
    categoria: 'Poke Personalizado',
    preco: 54.90,
    detalhes: {
      base: pokeBuilder.base,
      proteinas: pokeBuilder.proteinas,
      molhos: pokeBuilder.molhos,
      toppings: pokeBuilder.toppings
    },
    quantidade: 1
  };
  
  // Validar se tem pelo menos 1 proteína
  if (pokeBuilder.proteinas.length === 0) {
    alert('⚠️ Escolha pelo menos 1 proteína!');
    return;
  }
  
  cart.push(item);
  atualizarBadgeCarrinho();
  
  // Feedback visual
  alert('✅ Poke adicionado ao carrinho!');
  
  // Scroll para o carrinho (simulado)
  console.log('🛒 Carrinho atualizado:', cart);
}

// ==========================================
// 5. ADICIONAR ITENS DO MENU AO CARRINHO
// ==========================================
const menuItems = {
  1: { nome: 'Poke Neko Salmão Fresh', preco: 54.90, categoria: 'Pokes Prontos' },
  2: { nome: 'Poke Tuna Spicy Wave', preco: 56.90, categoria: 'Pokes Prontos' },
  3: { nome: 'Poke Green Neko (Shimeji)', preco: 48.90, categoria: 'Pokes Prontos' },
  4: { nome: 'Combo Neko Sushi Box', preco: 89.90, categoria: 'Sushis & Combinados' },
  5: { nome: 'Hot Roll Crocante Neko', preco: 38.90, categoria: 'Sushis & Combinados' },
  6: { nome: 'Suco Neko Tropical Wave', preco: 12.90, categoria: 'Sucos Naturais' }
};

function adicionarAoCarrinho(itemId) {
  const menuItem = menuItems[itemId];
  
  if (!menuItem) {
    alert('❌ Item não encontrado!');
    return;
  }
  
  const item = {
    id: Date.now(),
    menuId: itemId,
    nome: menuItem.nome,
    categoria: menuItem.categoria,
    preco: menuItem.preco,
    quantidade: 1
  };
  
  cart.push(item);
  atualizarBadgeCarrinho();
  
  // Feedback
  alert(`✅ ${menuItem.nome} adicionado ao carrinho!`);
  console.log('🛒 Carrinho:', cart);
}

// ==========================================
// 6. ATUALIZAR BADGE DO CARRINHO
// ==========================================
function atualizarBadgeCarrinho() {
  const quantidadeTotal = cart.length;
  document.getElementById('cart-badge').textContent = quantidadeTotal;
  document.getElementById('cart-badge-mobile').textContent = quantidadeTotal;
}

// ==========================================
// 7. ABRIR CARRINHO (MODAL/SIDEBAR)
// ==========================================
function abrirCarrinho() {
  if (cart.length === 0) {
    alert('🛒 Seu carrinho está vazio!\n\nAdicione um poke ou um item do cardápio.');
    return;
  }
  
  let conteudo = '🛒 SEU CARRINHO\n\n';
  let total = 0;
  
  cart.forEach((item, index) => {
    conteudo += `${index + 1}. ${item.nome}\n   R$ ${item.preco.toFixed(2)}\n\n`;
    total += item.preco;
  });
  
  conteudo += `\n━━━━━━━━━━━━━━━━━\n`;
  conteudo += `Total: R$ ${total.toFixed(2)}\n\n`;
  conteudo += `[Próxima etapa: integrar pagamento]`;
  
  alert(conteudo);
  console.log('Carrinho completo:', cart, 'Total:', total);
}

// ==========================================
// 8. MODAL DE USUÁRIO / DADOS DE ENTREGA
// ==========================================
function abrirModalUsuario() {
  const nome = prompt('👤 Qual é o seu nome?', userInfo.name);
  if (nome === null) return; // Cancelado
  userInfo.name = nome;
  
  const email = prompt('📧 Seu email:', userInfo.email);
  if (email === null) return;
  userInfo.email = email;
  
  const phone = prompt('📱 Seu telefone:', userInfo.phone);
  if (phone === null) return;
  userInfo.phone = phone;
  
  const address = prompt('🏠 Endereço de entrega:', userInfo.address);
  if (address === null) return;
  userInfo.address = address;
  
  // Atualizar label do botão
  const label = document.getElementById('nav-user-label');
  if (label) {
    label.textContent = `Olá, ${userInfo.name.split(' ')[0]}!`;
  }
  
  alert(`✅ Dados salvos!\n\n${userInfo.name}\n${userInfo.email}\n${userInfo.phone}\n${userInfo.address}`);
  console.log('Dados do usuário:', userInfo);
}

// ==========================================
// 9. FILTROS DO CARDÁPIO
// ==========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');

const categoriasMap = {
  all: ['Pokes Prontos', 'Sushis & Combinados', 'Sucos Naturais'],
  pokes: ['Pokes Prontos'],
  sushis: ['Sushis & Combinados'],
  sucos: ['Sucos Naturais']
};

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Atualizar botão ativo
    filterButtons.forEach(b => {
      b.classList.remove('bg-pastel-orange', 'text-white');
      b.classList.add('bg-retro-card', 'border', 'border-retro-border', 'text-charcoal');
    });
    btn.classList.add('bg-pastel-orange', 'text-white');
    btn.classList.remove('bg-retro-card', 'border-retro-border', 'text-charcoal');
    
    // Filtrar cards
    const filterValue = btn.dataset.filter;
    const categoriasVisiveis = categoriasMap[filterValue] || [];
    
    menuCards.forEach((card, index) => {
      const itemId = index + 1;
      const item = menuItems[itemId];
      
      if (filterValue === 'all' || categoriasVisiveis.includes(item.categoria)) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.3s ease-in';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Adicionar CSS para animação de fade
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// ==========================================
// 10. SMOOTH SCROLL COMPORTAMENTO
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Fechar menu mobile se aberto
      if (mobileNav && !mobileNav.classList.contains('hidden')) {
        mobileNav.classList.add('hidden');
      }
    }
  });
});

// ==========================================
// 11. INICIALIZAR ESTADO
// ==========================================
console.log('✅ NEKO POKE - Script carregado e ativo!');
console.log('📋 Funcionalidades disponíveis:');
console.log('   - Builder de Poke com validação');
console.log('   - Carrinho de compras');
console.log('   - Modal de usuário/entrega');
console.log('   - Filtros de cardápio');
console.log('   - Menu mobile responsivo');
