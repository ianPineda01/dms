//==================== ====================
let {ipcRenderer} = require("electron");

//====================Interfaces====================

interface sell{
    quantity:number
    code:string
    price:number
    timeStamp:number
    paymentMethod:string
}

interface factura{
    cliente:client
    usoCFDI:string
    ticketTimeStamp:number
}

interface client{
    razonSocial:string
    rfc:string
    nombre:string
    telefono:number
}

interface dms{
    ventas:sell[]
    facturas:factura[]
    cotizaciones:sell[]
    clientes:client[]
}

//====================Functions====================
const createCell: (input:string) => HTMLTableDataCellElement = (input) =>{
    const td = document.createElement("td");
    td.appendChild(document.createTextNode(input));
    return td;
}

const createHeader: (input:string) => HTMLTableHeaderCellElement = (input) =>{
    const th = document.createElement("th");
    th.appendChild(document.createTextNode(input));
    return th;
}

const createRow: (input:sell) => HTMLTableRowElement = (input) =>{
    const tr = document.createElement("tr");
    [`${input.quantity.toString()}`,`${input.code}`,`${input.price.toString()}`,`${input.code}`,`${(input.price * input.quantity).toString()}`, `${input.timeStamp.toString()}`].map((item:string) =>{
        tr.appendChild(createCell(item))
    });
    return tr;
}

const createEditableRow = () =>{
    const tr = document.createElement("tr");
    ["true", "true", "true", "false", "false", "false"].map((item) =>{
        const td = document.createElement("td");
        td.contentEditable = item;
        tr.appendChild(td);
    });
    return tr;
}

const createTableHeader: () => HTMLTableRowElement = () =>{
    const tr = document.createElement("tr");
    ["Cantidad", "Codigo", "Precio", "Nombre", "Total", "timeStamp"].map((item:string) =>{
        tr.appendChild(createHeader(item));
    });
    return tr;
}

const createTable: (db:sell[]) => HTMLTableElement = (db) =>{
    const table = document.createElement("table");
    table.appendChild(createTableHeader());
    db.map((value) =>{
        table.appendChild(createRow(value));
    });

    return table;
}

const createAddTable: () => HTMLTableElement = () =>{
    const table = document.createElement("table");
    table.appendChild(createTableHeader());
    table.appendChild(createEditableRow());
    table.id = "addTable";
    return table;
}

const createSvg: (input:string) => HTMLImageElement = (input) =>{
    const svg = document.createElement("img");
    svg.src = input + ".svg";
    svg.height = 36;
    return svg;
}

const createAddSideBar: () => HTMLDivElement = () =>{
    const div = document.createElement("div");
    ["cash", "credit", "debit", "transfer", "invoice"].map((item) =>{
        div.appendChild(createSvg(item));
    });
    div.id = "sideBar";
    return div;
}

const createAdd: () => HTMLDivElement = () =>{
    const wrapper = document.createElement("div");
    wrapper.appendChild(createAddSideBar());
    wrapper.appendChild(document.createElement("div"));
    wrapper.appendChild(createAddTable());
    wrapper.id = "add";
    return wrapper;
}

const dragoverListenerFunction = (e) =>{
    e.preventDefault();
}

const dropListenerFunction = (e) =>{
    e.preventDefault();
    ipcRenderer.send("fileDropped", e.dataTransfer.files[0].path);
}

const addKeyboardListenerFunction = (e:KeyboardEvent) =>{
    if(e.key === "Enter"){
        e.preventDefault();
        document.getElementById("addTable").appendChild(createEditableRow()); 
    }
}

//====================Event listeners====================

document.addEventListener("dragover", dragoverListenerFunction);

document.addEventListener("drop", dropListenerFunction);


//====================Electron listeners====================

ipcRenderer.on("fileNotSupported",()=>{
    alert("Archivo no soportado");
});

ipcRenderer.on("main", (e,data:string)=>{
    document.body.innerHTML = "";
    document.body.appendChild(createTable(JSON.parse(data).ventas));
    document.removeEventListener("dragover", dragoverListenerFunction);
    document.removeEventListener("drop", dropListenerFunction);
});

ipcRenderer.on("noFile", () =>{
    alert("No hay archivo");
});

ipcRenderer.on("add", () =>{
    document.body.innerHTML = "";
    document.body.appendChild(createAdd());
    document.getElementById("add").style.display = "block";
    document.addEventListener("keypress", addKeyboardListenerFunction);
    setTimeout(() => {
        document.querySelector("td").focus();
    }, 0);
});

ipcRenderer.on("saveAdd", () =>{
    console.log(document.querySelector("div"));
});