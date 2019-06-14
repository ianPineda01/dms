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
const createRow: (input:dbEntry) => HTMLTableRowElement = (input) =>{
    const tr = document.createElement("tr");
    tr.appendChild(createCell(input.quantity.toString()));
    tr.appendChild(createCell(input.code));
    tr.appendChild(createCell(input.price.toString()));
    tr.appendChild(createCell(input.timeStamp.toString()));
    return tr;
}
const createTable: (db:dbEntry[]) => HTMLTableElement = (db) =>{
    const table = document.createElement("table");
    db.map((value) =>{
        table.appendChild(createRow(value));
    });
    return table;
}
document.body.appendChild(createTable([
    {
        quantity:1,
        code:"Pro",
        price:200,
        timeStamp:0
    }
]));