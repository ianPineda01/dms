const {ipcRenderer} = require("electron");
interface dbEntry{
    quantity:number
    code:string
    price:number
    timeStamp:number
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
const createRow: (input:dbEntry) => HTMLTableRowElement = (input) =>{
    const tr = document.createElement("tr");
    tr.appendChild(createCell(input.quantity.toString()));
    tr.appendChild(createCell(input.code));
    tr.appendChild(createCell(input.price.toString()));
    tr.appendChild(createCell(input.timeStamp.toString()));
    return tr;
}
const createTableHeader: () => HTMLTableRowElement = () =>{
    const tr = document.createElement("tr");
    tr.appendChild(createHeader("Cantidad"));
    tr.appendChild(createHeader("Codigo"));
    tr.appendChild(createHeader("Precio"));
    tr.appendChild(createHeader("timeStamp"));
    return tr;
}
const createTable: (db:dbEntry[]) => HTMLTableElement = (db) =>{
    const table = document.createElement("table");
    table.appendChild(createTableHeader());
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