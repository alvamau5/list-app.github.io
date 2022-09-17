/**
 * Seleccionador de Items
 */

const alert = document.querySelector(".alert");
const form = document.querySelector(".app-form");
const app = document.getElementById("app");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".app-container");
const list = document.querySelector(".app-list");
const clearBtn = document.querySelector(".clear-btn");

/**
 * Opciones de Editado
 */
let editElement;
let editFlag = false;
let editID = "";

/**
 * Eventos
 */
// Submit Form
form.addEventListener("submit", addItem);
// Limpiar Elementos
clearBtn.addEventListener("click", clearItems);
//Cargar Elementos
window.addEventListener('DOMContentLoaded', setupItems);

/**
 * Funciones
 */
// Agregar Item
function addItem(e) {
  e.preventDefault();
  const value = app.value;
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    createListItem(id,value)

    // Aviso Alerta
    displayAlert("elemento agregado a la lista", "success");

    //Mostrar Container
    container.classList.add("show-container");

    // Agregar a Local Storage
    addToLocalStorage(id, value);

    // Set Back to Default
    setBackToDefault();

  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("elemento editado", "success");
    
    //Edicion de LocalStorage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("por favor agrega un valor", "danger");
  }
}

//Aviso de alerta
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  //Remover Alerta
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

//Limpiador de Elementos
function clearItems() {
  const items = document.querySelectorAll(".app-item");

  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  //Remover boton limpiador
  container.classList.remove("show-container");
  displayAlert("Lista Limpia", "danger");
  setBackToDefault();
  localStorage.removeItem('list');
}

// Funcion Editar
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // set form value
  app.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "editar";
}

// Funcion Borrar
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("elementos removidos", "danger");

  setBackToDefault();
  // remover del Local Storage
  removeFromLocalStorage(id);
}

//Set back to default
function setBackToDefault() {
  app.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Enter";
}

/**
 * Local Storage
 */

//Agregas valores a la base local del navegador
function addToLocalStorage(id, value) {
  const app = { id, value };
  let items = getLocalStorage();

  items.push(app);
  localStorage.setItem("list", JSON.stringify(items));
}

// Eliminas los valores agregados a la base local del navegador
function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !==id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// Editas los valores agregados a la base local del navegador
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id ===id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem('list', JSON.stringify(items));
}

// Lee los valores agregados a la base local del navegador
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

/**
 * Setup Items
 */
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id,item.value)
    })
    container.classList.add('show-container')
  }
}

//Contenedor de elementos en ventana (despues de recargar servidor)
function createListItem(id,value) {
  const element = document.createElement("article");
    // Agregando Clase
    element.classList.add("app-item");

    // Agregando id
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = ` <p class="title">${value}</p>
    <div class="btn-container">
      <!-- edit btn -->
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <!-- delete btn -->
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    `;

    //Funcion Borrar
    const deleteBtn = element.querySelector(".delete-btn");
    //Funcion Editar
    const editBtn = element.querySelector(".edit-btn");
    //Evento Click en boton borar
    deleteBtn.addEventListener("click", deleteItem);
    //Evento Click en boton editar
    editBtn.addEventListener("click", editItem);
    // Apendice hijo
    list.appendChild(element);
}