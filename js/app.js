// variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul')

// eventos
eventListeners()
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}

// clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto); // al inicio el presupuesto y restante son iguales
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 );
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        // extrae valores del parámetro (destructuring)
        const {presupuesto, restante} =  cantidad
        // insertar alores de presupuesto y resntate en el texto del div respectivo
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        // crear div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert'); // clases de bootstrap

        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // mensaje de error
        divMensaje.textContent = mensaje;

        //insertar en html
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        //quitarlo del html
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos(gastos) {
        // elimina html previo
        this.limpiarHTML();

        // iterar sobre los gastos
        gastos.forEach( gasto => {
            const {cantidad, nombre, id} = gasto;

            // crear li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            
            //nuevoGasto.setAttribute('data-id', id); // deprecated
            nuevoGasto.dataset.id = id// crea atributo data-id

            console.log(nuevoGasto)

            // agregar html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $${cantidad}</span>`

            // botón para borrar gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () => { eliminarGasto(id)};
            nuevoGasto.appendChild(btnBorrar);

            // agregar al html
            gastoListado.appendChild(nuevoGasto);

        })
    }

    limpiarHTML() {
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        // comprobar 25%: pinta el mensaje de rojo
        if((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        // comprobar 50%
        } else if ((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // si el total es 0 o menor
        if(restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

const ui = new UI(); // instancia del user interface
let presupuesto; // instancia no inicializada de presupuesto

// funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('Cual es tu presupuesto?')

    // Invalid input format handler
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload() // recarga la ventana actual
    }

    // Presupuesto válido
    presupuesto = new Presupuesto(presupuestoUsuario); // inicialización (luego de validar input) del presupuesto
    ui.insertarPresupuesto(presupuesto);
}

// agrega gastos
function agregarGasto(e) {
    e.preventDefault();

    // leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // validar
    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no válida', 'error');
        return;
    }

    // crear object literal "gasto"
    const gasto = { nombre, cantidad, id: Date.now() } // une nombre y cantidad al object literal "gasto"
    // agrega nuevo gasto
    presupuesto.nuevoGasto(gasto);
    // muestra mensaje de éxito
    ui.imprimirAlerta('Gasto agregado correctamente');

    // imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    // reinicia el formulario
    formulario.reset();
}

function eliminarGasto(id) {
    // elimina gasto del objeto
    presupuesto.eliminarGasto(id);
    // elimina gasto del html
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}