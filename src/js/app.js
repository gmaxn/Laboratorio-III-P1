window.addEventListener("load", initialize, false);

function initialize() {

    getMaterias();
}

function trigger(requsetMethod, url, actions, data = null) {

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4 && xhr.status === 200) {

            var response = JSON.parse(xhr.responseText);
            actions(response);
        }
    }

    xhr.open(requsetMethod, url, true);

    if (requsetMethod.toUpperCase() == "GET") {

        xhr.send();
    }

    if (requsetMethod.toUpperCase() == "POST") {

        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
        loading();
    }
}

//////////
// READ //
//////////
function getMaterias(e) {

    trigger("GET", "http://localhost:3000/materias", generateMateriasGrid);
}
function generateMateriasGrid(response) {

    var materias = response;

    var gridWrapper = document.getElementById("person-grid-wrapper");

    var grid = generateTable(["id", "nombre", "cuatrimestre", "fechaFinal", "turno"], materias);

    gridWrapper.appendChild(grid);
}
function generateTable(fields, values) {

    var table = document.createElement("table");
    table.id = "person-table";

    var thead = parseTableHead(fields);
    var tbody = parseTableBody(values);

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}
function parseTableHead(fields) {

    var thead = document.createElement("thead");
    var tr = document.createElement("tr");

    fields.forEach(name => {

        var th = document.createElement("th");
        var textNode = document.createTextNode(name);
        th.appendChild(textNode);
        tr.appendChild(th);

    });

    thead.appendChild(tr);

    return thead;
}
function parseTableBody(values) {

    var exists = document.getElementById("person-table");
    console.log(exists);

    if (exists) {
        exists.parentNode.removeChild(exists);
    }

    var tbody = document.createElement("tbody");

    values.forEach(obj => {

        var tr = document.createElement("tr");
        tr.setAttribute("id", obj.id);
        tr.addEventListener("dblclick", createForm);
        var td = document.createElement("td");

        var textNode = document.createTextNode(obj.id);
        td.appendChild(textNode);
        tr.appendChild(td);

        var td = document.createElement("td");
        var textNode = document.createTextNode(obj.nombre);
        td.appendChild(textNode);
        tr.appendChild(td);

        var td = document.createElement("td");
        var textNode = document.createTextNode(obj.cuatrimestre);
        td.appendChild(textNode);
        tr.appendChild(td);

        var td = document.createElement("td");
        var textNode = document.createTextNode(obj.fechaFinal);
        td.appendChild(textNode);
        tr.appendChild(td);

        var td = document.createElement("td");
        var textNode = document.createTextNode(obj.turno);
        td.appendChild(textNode);
        tr.appendChild(td);
        tbody.appendChild(tr);

    });

    return tbody;
}

////////////
// UPDATE //
////////////

function updateGrid(e) {

    getMaterias();


}

function updateMateria() {

    var materia = fetchEditForm();

    if (validateFields(materia)) {

        trigger("POST", "http://localhost:3000/editar", loadingRoquetupdatetPersonas, materia);
    }
}
function createForm(e) {

    var eventData = e.target.parentNode ?? null;
    var id = eventData.childNodes[0].innerHTML ?? null;
    var materia = eventData.childNodes[1].innerHTML ?? null;
    var cuatrimestre = eventData.childNodes[2].innerHTML ?? null;
    var fechaFinal = eventData.childNodes[3].innerHTML ?? null;
    var turno = eventData.childNodes[4].innerHTML ?? null;

    var form = document.createElement("div");
    form.id = "create-form";

    var title = document.createElement("p");
    title.innerHTML = "Edición de Materias";
    title.className = "form-title";

    form.appendChild(title);

    var idControl = createInputTextControl("text", "id", "Ingrese id . . .", id, true);
    idControl.setAttribute("hidden", true);
    form.appendChild(idControl);
    var materiaControl = createInputTextControl("text", "materia", "Ingrese materia . . .", materia);
    form.appendChild(materiaControl);
    var cuatrimestreControl = createInputSelect("cuatrimestre", { values: ["1", "2", "3", "4"] }, cuatrimestre);
    form.appendChild(cuatrimestreControl);
    var fechaFinalControl = createInputDateControl("Fecha Examen Final", fechaFinal);
    form.appendChild(fechaFinalControl);
    var turnoControl = createInputRadioControl("Turno", { name: "turno", values: ["Mañana", "Noche"] }, turno);
    form.appendChild(turnoControl);

    var buttonWrap = document.createElement("div");
    buttonWrap.className = "btn-group btn-small";

    if (e.target.parentNode.childNodes[1].tagName == "DIV") {

        var signup = document.createElement("button");
        signup.classList.add("btn", "btn-success", "form-buttons");
        signup.id = "create";
        signup.href = "#";
        signup.type = "button";
        signup.innerHTML = "Sign Up";
        signup.addEventListener("click", fetchAndDestroy);
        buttonWrap.appendChild(signup);

        var clear = document.createElement("button");
        clear.classList.add("btn", "btn-info", "form-buttons");
        clear.id = "clear";
        clear.href = "#";
        clear.type = "button";
        clear.innerHTML = "Clear";
        clear.addEventListener("click", clearEditForm);
        buttonWrap.appendChild(clear);
    }


    if (e.target.parentNode.childNodes[0].tagName == "TD") {

        var update = document.createElement("button");
        update.classList.add("btn", "btn-success", "form-buttons");
        update.id = "update";
        update.href = "#";
        update.type = "button";
        update.innerHTML = "Update";
        update.addEventListener("click", updateMateria);
        buttonWrap.appendChild(update);

        var clear = document.createElement("button");
        clear.classList.add("btn", "btn-info", "form-buttons");
        clear.id = "clear";
        clear.href = "#";
        clear.type = "button";
        clear.innerHTML = "Clear";
        clear.addEventListener("click", clearEditForm);
        buttonWrap.appendChild(clear);

        var remove = document.createElement("button");
        remove.classList.add("btn", "btn-danger", "form-buttons");
        remove.id = "delete";
        remove.href = "#";
        remove.type = "button";
        remove.innerHTML = "delete";
        remove.addEventListener("click", deleteMateria);
        buttonWrap.appendChild(remove);

    }

    form.appendChild(buttonWrap);

    var positioner = document.createElement("div");

    positioner.id = "create-form-wrapper";

    positioner.appendChild(form);

    document.body.appendChild(positioner);

    var main = document.getElementById("main-screen");
    main.addEventListener("click", rocket);
}
function createInputTextControl(inputType, inputName, placeholder, defaultValue = null, disabled = false) {

    // Create control container
    var control = document.createElement("div");
    control.classList.add("input-text-control");

    // Create control label
    var label = document.createElement("label");
    label.htmlFor = inputName.toLowerCase();
    label.appendChild(document.createTextNode(capitalizeFLetter(inputName) + ":"));
    label.classList.add("mr-sm-2");

    // Create control input
    var input = document.createElement("input");
    input.type = inputType;
    input.name = inputName.toLowerCase();
    input.disabled = disabled;
    input.placeholder = placeholder;
    input.classList.add("form-control");
    input.classList.add("mb-2");
    input.classList.add("mr-sm-2");
    input.id = "input-" + inputName.toLowerCase();

    if (defaultValue != null) {

        input.value = defaultValue;
    }

    control.appendChild(label);
    control.appendChild(input);

    return control;
}
function createInputDateControl(controlName, defaultValue = null, disabled = false) {

    // Create control container
    var control = document.createElement("div");
    control.classList.add("input-date-control");

    // Create control label
    var label = document.createElement("label");
    label.htmlFor = "fechafinal";
    label.appendChild(document.createTextNode(controlName + ":"));
    label.classList.add("mr-sm-2");

    // Create control input
    var input = document.createElement("input");
    input.name = "fechafinal";
    input.type = "date";
    input.disabled = disabled;
    input.classList.add("form-control");
    input.classList.add("mb-2");
    input.classList.add("mr-sm-2");
    input.id = "input-" + "fechafinal";

    if (defaultValue != null) {

        var aux = defaultValue.split("/");
        aux = aux[2] + "-" + aux[1] + "-" + aux[0];
        input.value = aux;
    }

    control.appendChild(label);
    control.appendChild(input);

    return control;
}
function createInputRadioControl(controlName, options, defaultValue = null, disabled = false) {

    // Create control container
    var control = document.createElement("div");
    control.classList.add("input-radio-control");

    var label = document.createElement("label");
    label.appendChild(document.createTextNode(controlName + ":"));
    label.classList.add("mr-sm-2");

    control.appendChild(label);

    var radiosWrapper = document.createElement("div");
    radiosWrapper.classList.add("radio-wrapper");


    var i = 0;
    options.values.forEach(option => {

        var container = document.createElement("div");

        // Create label for radio button
        var label = document.createElement("label");
        label.htmlFor = options.name.toLowerCase();
        label.appendChild(document.createTextNode(option));
        label.classList.add("mr-sm-2");

        container.appendChild(label);

        // Create radio button
        var radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.name = options.name;
        radioButton.value = options.values[i];
        radioButton.id = "input-" + options.values[i].toLowerCase();

        if (defaultValue != null && (defaultValue.toLowerCase() == options.values[i].toLowerCase())) {

            radioButton.checked = true;
        }

        container.appendChild(label);
        container.appendChild(radioButton);

        radiosWrapper.appendChild(container);

        control.appendChild(radiosWrapper);
        i++;
    });

    return control;
}
function createInputSelect(inputName, options, defaultValue = null, disabled = false) {

        // Create control container
        var control = document.createElement("div");
        control.classList.add("input-select-control");
    
        // Create control label
        var label = document.createElement("label");
        label.htmlFor = inputName.toLowerCase();
        label.appendChild(document.createTextNode(capitalizeFLetter(inputName) + ":"));
        label.classList.add("mr-sm-2");
    
        // Create control input
        var input = document.createElement("select");
        input.name = inputName.toLowerCase();
        input.disabled = disabled;
        input.classList.add("form-control");
        input.classList.add("mb-2");
        input.classList.add("mr-sm-2");
        input.id = "input-" + inputName.toLowerCase();

        // Create option group
        var i = 0;
        options.values.forEach(option => {
    
            var option = document.createElement("option");
            option.value = options.values[i];
            option.appendChild(document.createTextNode(options.values[i]));
    
            if (defaultValue != null && (defaultValue.toLowerCase() == options.values[i].toLowerCase())) {
    
                option.selected = true;
            }
    
            input.appendChild(option);
            i++;
        });

        control.appendChild(label);
        control.appendChild(input);

    
        return control;
}

function fetchEditForm() {


    var materia = {
        id: document.getElementById("input-id").value,
        materia: document.getElementById("input-materia").value,
        cuatrimestre: document.getElementById("input-cuatrimestre").value,
        fechaFinal: document.getElementById("input-fechafinal").value
    };

    if (document.getElementById("input-mañana").checked) {
        materia.turno = document.getElementById("input-mañana").value;
    }

    if (document.getElementById("input-noche").checked) {
        materia.turno = document.getElementById("input-noche").value;
    }

    return materia;
}
function clearEditForm() {

    document.getElementById("input-materia").value = null;
    document.getElementById("input-cuatrimestre").value = null;
    document.getElementById("input-fechafinal").value = null;
    document.getElementById("input-mañana").checked = false;
    document.getElementById("input-noche").checked = false;

    var form = document.getElementById("create-form");
    form.style.animation = "shake 0.4s";

}
function loading(onLoading = true) {

    var spinner = document.getElementById("loading-spinner-wrapper");

    if (onLoading) {
        spinner.hidden = false;
    }
    else {
        spinner.hidden = true;
    }
}

function capitalizeFLetter(string) {

    var normalized = string.toLowerCase();
    return normalized[0].toUpperCase() + normalized.slice(1);
}
function fetchSingInData() {
    var materia = document.getElementById("materia").value;
    var cuatrimestre = document.getElementById("cuatrimestre").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    sendSignIn(materia, cuatrimestre, email, password);
}
function rocket() {

    var form = document.getElementById("create-form-wrapper");

    if (form) {
        form.addEventListener("animationend", destroy);
        form.style.animation = "rocket 0.5s ease-out";
    }
}
function destroy() {
    var elem = document.getElementById("create-form-wrapper");
    elem.parentNode.removeChild(elem);
}
function fetchAndDestroy() {
    fetchSingInData();
    rocket();
}


function deleteMateria() {

}

function deleteMateria() {

    var materia = fetchEditForm();

    trigger("POST", "http://localhost:3000/eliminar", loadingRoquetgetPersonas, { id: materia.id });
}


function loadingRoquetgetPersonas(response) {
    loading(false);
    rocket();
    getMaterias();
}


function loadingRoquetupdatetPersonas(response) {
    loading(false);
    rocket();
    getMaterias();
}

/////////////
// HELPERS //
/////////////


function validateFields(materia) {



    var returnAux = true;


    if (materia.materia.length < 6) {
        document.getElementById("input-materia").classList.add("is-invalid");
        returnAux = false;
    }
    else {
        document.getElementById("input-materia").classList.remove("is-invalid");
    }

    if (materia.acutrimestre < 1 || materia.acutrimestre > 4 || materia.cuatrimestre == "" || materia.cuatrimestre == null) {
        var input = document.getElementById("input-cuatrimestre")
        input.setAttribute("disabled", true);
        var option = document.createElement("option");
        option.value = 1;
        option.appendChild(document.createTextNode("1"));
        input.appendChild(option);
        document.getElementById("input-cuatrimestre").childNodes[5].setAttribute("selected", true);
        returnAux = false;
    }
    else {
        document.getElementById("input-cuatrimestre").classList.remove("is-invalid");
    }

    var now = new Date();
    var inputDate = new Date();

    console.log(materia.fechaFinal);


    if(materia.fechaFinal != "" && materia.fechaFinal != null) {

        inputDate.setFullYear(materia.fechaFinal.split("-")[0]);
        inputDate.setMonth(materia.fechaFinal.split("-")[1] - 1);
        inputDate.setDate(materia.fechaFinal.split("-")[2]);

    }


    if (inputDate > now || materia.fechaFinal == "" || materia.fechaFinal == null) {

        document.getElementById("input-fechafinal").classList.add("is-invalid");
        returnAux = false;
    }
    else {

        document.getElementById("input-fechafinal").classList.remove("is-invalid");
    }

    if (materia.turno.toLowerCase() != "mañana" && materia.turno.toLowerCase() != "noche") {

        document.getElementById("input-mañana").classList.add("is-invalid-radio");
        document.getElementById("input-noche").classList.add("is-invalid-radio");

        returnAux = false;
    }
    else {
        document.getElementById("input-mañana").classList.remove("is-invalid-radio");
        document.getElementById("input-noche").classList.remove("is-invalid-radio");
    }

    return returnAux;
}