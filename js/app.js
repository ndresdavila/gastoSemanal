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
        this.gastos = [...this.gastos, gasto]
        console.log(this.gastos)
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
    // reinicia el formulario
    formulario.reset();
}