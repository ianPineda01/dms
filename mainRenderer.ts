const {ipcRenderer} = require("electron");
interface sell{
    quantity:number
    code:string
    price:number
    timeStamp:number
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
    tr.appendChild(createCell(input.quantity.toString()));
    tr.appendChild(createCell(input.code));
    tr.appendChild(createCell(input.code));//to-do Check name from database
    tr.appendChild(createCell(input.price.toString()));
    tr.appendChild(createCell((input.price * input.quantity).toString()));
    tr.appendChild(createCell(input.timeStamp.toString()));
    return tr;
}

const createTableHeader: () => HTMLTableRowElement = () =>{
    const tr = document.createElement("tr");
    tr.appendChild(createHeader("Cantidad"));
    tr.appendChild(createHeader("Codigo"));
    tr.appendChild(createHeader("Nombre"));
    tr.appendChild(createHeader("Precio"));
    tr.appendChild(createHeader("Total"));
    tr.appendChild(createHeader("timeStamp"));
    return tr;
}
const createTable: (db:sell[]) => HTMLTableElement = (db) =>{
    const table = document.createElement("table");
    table.appendChild(createTableHeader());
    console.log(db)
    db.map((value) =>{
        table.appendChild(createRow(value));
    });
    return table;
}

document.addEventListener("dragover", (e)=> {
    e.preventDefault();
});

document.addEventListener("drop", (e)=> {
    e.preventDefault();
    ipcRenderer.send("fileDropped", e.dataTransfer.files[0].path);
});

ipcRenderer.on("fileNotSupported",()=>{
    alert("Archivo no soportado");
});

ipcRenderer.on("file", (e,data:string)=>{
    document.body.appendChild(createTable(JSON.parse(data).ventas));
});