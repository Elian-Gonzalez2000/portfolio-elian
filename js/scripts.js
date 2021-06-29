const d = document,
  w = window;

function hamburguerMenu(menu, menubtn, menuLink) {
	d.addEventListener("click", (e) => {
  	if (e.target.matches(menubtn) || e.target.matches(`${menubtn} *`)) {
    	d.querySelector(menu).classList.toggle("is-active");
    	d.querySelector(menubtn).classList.toggle("btn-effect");
  	}

  	if (e.target.matches(menuLink)) {
    	d.querySelector(menu).classList.remove("is-active");
    	d.querySelector(menubtn).classList.remove("btn-effect");
  	}
	});
}

function textoAnimado(id, objetivo){
	const texto = d.getElementById(id),
		disparador = d.getElementById(objetivo);

	let separarTexto = texto.textContent.split("");
	//console.log(texto, separarTexto);
	texto.textContent = "";

	separarTexto.forEach((letra)=>{
		let caracter = letra === " "? '&nbsp;': letra;

		texto.innerHTML = texto.innerHTML +
		`<div>
			<span>${caracter}</span>
			<span class="second-child">${caracter}</span>
		</div>`;
	});


	disparador.addEventListener("mouseover",(e)=>{
		let cuenta = 0;
		const intervalo = setInterval(() => {
				if(cuenta < texto.children.length){
					texto.children[cuenta].classList.add('animation');
					cuenta += 1;
					//console.log(texto.children);
				} else {
					clearInterval(intervalo);
				}
			}, 30);
	});

	disparador.addEventListener("mouseout",(e)=>{
		let cuenta = 0;
		const intervalo = setInterval(() => {
			if(cuenta < texto.children.length){
				texto.children[cuenta].classList.remove('animation');
				cuenta += 1;
				//console.log(texto.children);
			} else {
				clearInterval(intervalo);
			}
		}, 30);
	});
}

/* Scroll Spy para los enlaces del menu, colocar data-scroll-spy en los enlaces y secciones que se quieran vincular*/

function scrollSpy() {
  const $section = d.querySelectorAll("section[data-scroll-spy]");
  const cb = (entries) => {
    //console.log("entries", entries);

    entries.forEach((entry) => {
      //console.log("entry", entry);
      const id = entry.target.getAttribute("id");
      //console.log(id);

      if (entry.isIntersecting) {
        d.querySelector(`a[data-scroll-spy][href="#${id}"]`).classList.add(
          "active"
        );
      } else {
        d.querySelector(`a[data-scroll-spy][href="#${id}"]`).classList.remove(
          "active"
        );
      }
    });
  };

  const observer = new IntersectionObserver(cb, {
    //root
    //rootMargin
    threshold: [0.5, 0.75],
  });

  $section.forEach((el) => observer.observe(el));
}

/*Validaciones de los elementos del formulario, colocar atributo required, pattern y title en el HTML a los inputs que quieran ser validados*/

function contactFormValidation() {
  const $form = d.querySelector(".contact-form"),
    $inputs = d.querySelectorAll(".contact-form [required]");

  //console.log($inputs);

  $inputs.forEach((input) => {
    const $span = d.createElement("span");
    $span.id = input.name;
    $span.textContent = input.title;
    $span.classList.add("contact-form-error");
    input.insertAdjacentElement("afterend", $span);
  });

  d.addEventListener("keyup", (e) => {
    if (e.target.matches(".contact-form [required]")) {
      let $input = e.target,
        pattern = $input.pattern || $input.dataset.pattern;

      //console.log($input, pattern);
      if (pattern && $input.value !== "") {
        //console.log("Este input tiene patron");
        let regEx = new RegExp(pattern);
        return !regEx.exec($input.value)
          ? $input.nextElementSibling.classList.add("is-active")
          : $input.nextElementSibling.classList.remove("is-active");
          console.log($input.nextElementSibling);
      }

      if (!pattern) {
        //console.log("Este input NO tiene patron");
        return $input.value === ""
          ? $input.nextElementSibling.classList.add("is-active")
          : $input.nextElementSibling.classList.remove("is-active");
      }
    }
  });
}

/*Envio del formulario mediante AJAX y la API de FormSubmit*/

function sendContactForm(){
  document.addEventListener("submit", (e) => {
    e.preventDefault();
    const $gracias = document.getElementById("gracias"),
     $errorResponse = document.getElementById("error"),
     $formResponse = document.querySelector(".modal#gracias .modal-content"),
     $formLoader = document.querySelector(".contact-form-loader");

    $gracias.classList.remove("opacity-visibility");
    $formLoader.classList.remove("none");

    //console.log(e.target);
    fetch("https://formsubmit.co/ajax/eliancarlogm@gmail.com", {
      method: "POST",
      body: new FormData(e.target),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        //console.log(data);
        $formResponse.classList.remove("opacity-visibility");
        e.target.reset();
      })
      .catch((error) => {
        //console.log(error);
        $errorResponse.classList.remove("opacity-visibility");
      })
      .finally(() => {
        $formLoader.classList.add("none");
        if (
          $formResponse.classList.contains("opacity-visibility") &&
          $errorResponse.classList.contains("opacity-visibility")
        ) {
          $gracias.classList.add("opacity-visibility");
        } else {
          setTimeout(() => {
            $formResponse.classList.add("opacity-visibility");
            $errorResponse.classList.add("opacity-visibility");
            $gracias.classList.add("opacity-visibility");
          }, 2000);
        }
      });
  });
}

document.addEventListener("DOMContentLoaded",()=>{
	hamburguerMenu(".nav", ".menu-btn", ".nav ul li a");
	textoAnimado("logo", "logotipo");
	scrollSpy();
	contactFormValidation();
   sendContactForm();
});
