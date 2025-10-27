//Mostrar sidebar left bottom position fixed
function showSidebarLeftBottom() {
  const sidebarHTML = `
    <div class="sidebar-left-bottom">
      <a href="https://vaion.neositio.com/" target="_blank">
        <button class="btn-close" id="btn-close-sidebar-left-bottom">
          <h3>PAUSAS</h3>
          <p>Pausas</p>
        </button>
      </a>
      <a href="https://secure.debttrakker.net/" target="_blank">
        <button class="btn-close" id="btn-close-sidebar-left-bottom">
          <h3>DTK</h3>
          <p>Debttracker</p>
        </button>
      </a>  
      <a href="https://cftconnect4.debtmanagersoft.com/help01/system/home.php" target="_blank">
        <button class="btn-close" id="btn-close-sidebar-left-bottom">
          <h3>DMG</h3>
          <p>DMG HFG</p>
        </button>
      </a>
      <a href="https://cftconnect4.debtmanagersoft.com/cca01m/system/index.php" target="_blank">
        <button class="btn-close" id="btn-close-sidebar-left-bottom">
          <h3>DMG</h3>
          <p>DMG CCA</p>
        </button>
      </a>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSfwQ0Qg65xc7Um4VPa_pmQK2IAAyvdqzsXoRK7L5v37pLLCRQ/viewform" target="_blank">
        <button class="btn-close" id="btn-close-sidebar-left-bottom">
          <h3>BITA</h3>
          <p>Bitacora</p>
        </button>
      </a>
    </div>
  `

  return sidebarHTML;
}

const sidebarHTML = showSidebarLeftBottom();


 document.body.insertAdjacentHTML('beforeend', sidebarHTML);



// Lista de usuarios que no estan autorizados
const UsersDestroyed=
      [
        "Abigail Urquía",
        "Alejandro Salgado",
        "Andre Garcia",
        "Angel Datos",
        "Charlie Meraz",
        "claudette rollins",
        "Daniel Salgado",
        "Daniela Verificacion",
        "David Santos",
        "Emely Romero",
        "Enrique Casco Murillo",
        "Ericka Martinez-Processing",
        "Evelyn Oseguera",
        "Fabiola Castillo",
        "Frank Mendez",
        "gerardo fernandez",
        "Isis Ardon",
        "Jonny Rosales",
        "Jorge Rodríguez",
        "Katerin Martinez",
        "Kenia Zambrano",
        "Luis Rojas CS",
        "Marcelo B.",
        "Mary zelaya Processing",
        "Raquel Aguirre",
        "Raul Espinoza",
        "Seth Godoy",
        "VICTOR ENRIQUE",
        "Wolfang Sosa",
        "Yorleny Maldonado"
      ];
// Función para obtener el texto del participante
function getParticipantText() {
  const panelPrincipal = document.querySelector('[data-tid="app-layout-area--unified-areas"]');
  if (!panelPrincipal) return null;

  const li = panelPrincipal.querySelector('li[data-tid^="participant-8:live:"]');
  if (!li) return null;

  const span = li.querySelector('span.fui-StyledText');
  return span ? span.textContent.trim() : null;
}

// Función para manejar el evento
function handleEvent(event) {
  const target = event.target;

  const isEditableDiv = target.classList.contains('ck-editor__editable') && target.dataset.tid === 'ckeditor';
  const isPlaceholder = target.tagName === 'P' && target.dataset.placeholder === 'Escriba un mensaje';

  if (isEditableDiv || isPlaceholder) {
    const data = getParticipantText();
    NotTrusted(data,target)
  }
}
// 🔧 Función para normalizar nombres
function normalizeName(name) {
  return name
    .normalize("NFD")                      // separa acentos
    .replace(/[\u0300-\u036f]/g, "")       // elimina acentos
    .replace(/[^\p{L}\p{N}\s]/gu, "")      // elimina emojis y símbolos
    .toLowerCase()                         // pasa a minúsculas
    .trim();                               // quita espacios
}
async function NotTrusted(data, input) {
  // Verifica con nombres normalizados
  const isDestroyed = UsersDestroyed.some(
    u => normalizeName(u) === normalizeName(data)
  );

  if (isDestroyed) {
    //si ya exite modal no mostrarlo
    if (document.getElementById('modal-overlay-main')) return;
    const username = GetStore();

    if (!username) {
      const app = ShowAlert(null, data);
      document.body.insertAdjacentHTML('beforeend', app);
      return;
    }

    const app = ShowAlert(username, data);
    document.body.insertAdjacentHTML('beforeend', app);

    requestAnimationFrame(() => {
      const countdown = document.getElementById('countdown');
      if (!countdown) return;

      document.querySelectorAll('.dgm-btn-close').forEach((btn) => {
        btn.addEventListener('click', CloseModal);
      });

      let seconds = 20;
      const timer = setInterval(() => {
        seconds--;
        countdown.textContent = `${seconds}`;

        if (seconds <= 0) {
          clearInterval(timer);
          location.reload();
        }
      }, 1000);
    });

    await SaveSupabase(username, data);
  }
}


function ShowAlert(username, data) {
  const modalHTML = `
    <div class="modal-overlay" id="modal-overlay-main">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div class="modal-title">
            <h2>Estimado usuario.</h2>
            <span class="subtitle">Acceso Restringido</span>
          </div>
        </div>

        <div class="modal-body">
          <div class="alert-message">
            <p>
              No tienes permiso para interactuar con <strong>${data}</strong> desde esta cuenta.
            </p>
          </div>

          <div class="reasons-section">
            <p>Como parte de nuestros protocolos de seguridad, se ha generado esta notificación automática. Si crees que se trata de un error, ponte en contacto con tu manager o administrador para solicitar una validación de acceso.</p><br>
            <h3>Posibles razones:</h3>
            <ul class="reasons-list">
              <li>El usuario no existe en el sistema</li>
              <li>No tiene autorización para enviar mensajes</li>
              <li>La cuenta no permite interacción externa</li>
              <li>La empresa ha restringido este usuario</li>
            </ul>
          </div>

          <div class="warning-box">
            <p>
              Por favor, evite intentarlo nuevamente y envíe mensajes solo a <strong>contactos autorizados</strong>. Gracias por su comprensión.
            </p>
          </div>
          <div class="success-box" style="margin-top: 10px;">
            <p>
              Te vamos a reinciar el sistema en: <strong id="countdown">20</strong> segundos.
            </p>
          </div>
        </div>
      </div>
    </div>
  `

  return modalHTML
}

function CloseModal() {
  const overlay = document.querySelectorAll(".modal-overlay")
  if (overlay) {
    overlay.forEach((overlay) => {
      overlay.style.animation = "fadeOut 0.2s ease-out"
    })
    setTimeout(() => {
      overlay.forEach((overlay) => {
        overlay.remove()
      })
      document.body.style.overflow = "auto"
    }, 200)
  }
}

// Event delegation for close button
// document.addEventListener("click", (event) => {
//   if (event.target.id === "btn-close-modal") {
//     CloseModal()
//   }

//   if (event.target.id === "modal-overlay-main") {
//     CloseModal()
//   }
// })

// Cerrar con tecla ESC
// document.addEventListener("keydown", (event) => {
//   if (event.key === "Escape") {
//     CloseModal()
//   }
// })


async function SaveSupabase(username, action) {
  try {
    const response = await fetch('https://api.neositio.com/ext.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, action })
    });

    const result = await response.json();
    if (result.success) {
      console.log('✅ Registro guardado vía PHP:', result.response);
    } else {
      console.warn('⚠️ Error guardando vía PHP:', result);
    }
  } catch (err) {
    console.log('❌ Error enviando a PHP:', err);
  }
}

function GetStore(){
  
  try {
    // Acceder al localStorage de la web
    const localStorage = window.localStorage;
    
      // Obtener todos los datos del localStorage
      const allStorage = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        allStorage[key] = localStorage.getItem(key);
      }
      
      // Buscar específicamente "preferred_username"
      let username = null;
      
      // Función recursiva para buscar en objetos anidados
      function buscarPreferredUsername(obj) {
        if (typeof obj === 'string') {
          try {
            obj = JSON.parse(obj);
          } catch (e) {
            return null;
          }
        }
        
        if (typeof obj === 'object' && obj !== null) {
          // Buscar preferred_username directamente
          if (obj.preferred_username) {
            return obj.preferred_username;
          }
          
          // Buscar en profile.preferred_username
          if (obj.profile && obj.profile.preferred_username) {
            return obj.profile.preferred_username;
          }
          
          // Buscar en item.profile.preferred_username
          if (obj.item && obj.item.profile && obj.item.profile.preferred_username) {
            return obj.item.profile.preferred_username;
          }
          
          // Buscar en todas las propiedades recursivamente
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              const result = buscarPreferredUsername(obj[key]);
              if (result) return result;
            }
          }
        }
        return null;
      }
      
      // Buscar en todos los valores del localStorage
      for (const key in allStorage) {
        const value = allStorage[key];
        username = buscarPreferredUsername(value);
        if (username) {
          break;
        }
      }
      
      if (username) {
        return username;
      } else {
        console.log('No se encontró preferred_username en el localStorage');
      }
    

  } catch (error) {
    console.error('Error accediendo al localStorage:', error);
  }
}
// Escuchar click y keyup usando la misma función
document.addEventListener('click', handleEvent);
document.addEventListener('keyup', handleEvent);
