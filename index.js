

const productos = [
  {
    id: 1,
    name: "Sillón Moderno",
    price: 9799.99,
    image:
      "/images/sillon-moderno.jpg",
  },



  { 
    id: 2, 
    name: "Sillón Relax", 
    price: 8299.99,
    image: 
      "/images/sillon-relax.jpg",
  },

  {
    id: 3,
    name: "Sillón Elegante",
    price: 93899.99,
    image: "/images/sillon-elegante.jpg",
  },


  {
    id: 4,
    name: "Sillón Clasico", 
    price: 100899.99,
    image: "/images/sillon-clasico.jpg",
  },

];







let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let seccionActual = "home";






const carritoCount = document.getElementById("contador-carrito");
const productosContainer = document.getElementById("contenedor-productos");
const carritoItems = document.getElementById("elementos-carrito");
const carritoTotal = document.getElementById("total-carrito");
const botonFinalizar = document.getElementById("boton-finalizar");
const formularioCompra = document.getElementById("formulario-compra");
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

function saveCarritoToStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function showToast(message, duration = 3000) {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  toastContainer.appendChild(toast);
  
  toast.offsetHeight;
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, duration);
}



function init()  { 
  renderProducts();   
  setupEventListeners();   
  showSection("home"); 
  updateCartUI();  
}



function renderProducts()  {
  productosContainer.innerHTML = productos
    .map(  
      (product) => `
        <div class="tarjeta-producto">
            <img src="${product.image}" alt="${product.name}" class="imagen-producto">
            <div class="informacion-producto">

                <h3 class="titulo-producto">${product.name}</h3>

                <p class="precio-producto">$${product.price}</p>

                <button class="boton-primario" onclick="addToCart(${product.id})">
                    Agregar al Carrito
                </button>

            </div>


        </div>
    `

    )
    .join("");
}



function addToCart(productId) {
  const product = productos.find((p) => p.id === productId);
  const carritoItem = carrito.find((item) => item.id === productId);

  if (carritoItem) {
    carritoItem.quantity++;
  } else {
    carrito.push({ ...product, quantity: 1 });
  }

  updateCartUI(); 
  saveCarritoToStorage();  
  showToast(`¡${product.name} agregado al carrito!`); 


}


function incrementQuantity(productId) {  
  const carritoItem = carrito.find((item) => item.id === productId); 
  if (carritoItem) { 
    carritoItem.quantity++; 
    updateCartUI();
    saveCarritoToStorage(); 

  }

}

function decrementQuantity(productId) {  
  const carritoItem = carrito.find((item) => item.id === productId);
  if (carritoItem && carritoItem.quantity > 1) { 
    carritoItem.quantity--; 

    updateCartUI();
    saveCarritoToStorage();  

  }
}



function updateCartUI() { 
  carritoCount.textContent = carrito.reduce((sum, item) => sum + item.quantity, 0);


  carritoItems.innerHTML = carrito
    .map(
      (item) => `
        <div class="carrito-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="carrito-item-info">
                <h3>${item.name}</h3>
                <p>$${item.price}</p>
                <div class="controles-cantidad">
                    <button class="boton-cantidad" onclick="decrementQuantity(${item.id})">-</button>
                    <span>${item.quantity}</span>
                    <button class="boton-cantidad" onclick="incrementQuantity(${item.id})">+</button>
                </div>
                <button class="boton-primario" onclick="removeFromCart(${item.id})">
                    Eliminar
                </button>
            </div>
        </div>
    `
    )
    .join("");

  const total = carrito.reduce((sum, item) => sum + item.price * item.quantity, 0);
  carritoTotal.textContent = total.toFixed(2);

}

 
 

function removeFromCart(productId) { 
  carrito = carrito.filter((item) => item.id !== productId); 
  updateCartUI();  
  saveCarritoToStorage();  
} 
 

   

function showSection(sectionId) { 
  document.querySelectorAll("section").forEach((section) => {
    section.classList.remove("active");
  });

  document.getElementById(sectionId).classList.add("active");

  seccionActual = sectionId;
}


 

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const section = this.getAttribute("href").substring(1);
    const element = document.getElementById(section);
    element.scrollIntoView({ behavior: "smooth" });
  });

});



function setupEventListeners()  {
  

  document.querySelector(".icono-carrito").addEventListener("click", () => {
    showSection("carrito");
  }); 

  

  botonFinalizar.addEventListener("click", ()  => {
    if (carrito.length > 0) { 
      showSection("checkout"); 
    }

  });

  
  formularioCompra.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("¡Gracias por tu compra! Procesando el pedido...", 3000);
    setTimeout(() => {

      carrito = [];

      updateCartUI();
      saveCarritoToStorage(); 
      showSection("home");
    }, 3000);
  });

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.classList.remove('active');
      }
    });
  });

}
init();
