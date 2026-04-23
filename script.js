let cart = [];

function addToCart(nombre, precio){
    cart.push({nombre, precio});
    updateCart();
}

function updateCart(){
    const list = document.getElementById("cart-items");
    const total = document.getElementById("total");
    const count = document.getElementById("cart-count");

    list.innerHTML = "";
    let suma = 0;

    cart.forEach(item=>{
        const li = document.createElement("li");
        li.textContent = item.nombre + " - $" + item.precio;
        list.appendChild(li);
        suma += item.precio;
    });

    total.textContent = "Total: $" + suma;
    count.textContent = cart.length;
}

function toggleCart(){
    const panel = document.getElementById("cartPanel");
    panel.style.display = panel.style.display === "block" ? "none" : "block";
}

function mostrarSeccion(seccion){
    document.getElementById("inicio").classList.add("hidden");
    document.getElementById("componentes").classList.add("hidden");
    document.getElementById("pcs").classList.add("hidden");

    document.getElementById(seccion).classList.remove("hidden");
}

function buscarProducto(texto){
    let productos = document.querySelectorAll(".card");

    productos.forEach(p=>{
        let nombre = p.innerText.toLowerCase();
        p.style.display = nombre.includes(texto.toLowerCase()) ? "block" : "none";
    });
}

function toggleTheme(){
    document.body.classList.toggle("dark");

    const icon = document.getElementById("themeIcon");
    const isDark = document.body.classList.contains("dark");

    localStorage.setItem("modo", isDark ? "dark" : "light");

    if(isDark){
        icon.classList.replace("ri-sun-line","ri-moon-line");
    } else {
        icon.classList.replace("ri-moon-line","ri-sun-line");
    }
}

window.onload = function(){
    const modo = localStorage.getItem("modo");
    const icon = document.getElementById("themeIcon");

    if(modo === "dark"){
        document.body.classList.add("dark");
        if(icon){
            icon.classList.replace("ri-sun-line","ri-moon-line");
        }
    }
}
