const createDiv: (input:string) => HTMLDivElement = (input) =>{
    let div = document.createElement("div");
    div.id = input;
    return div;
}
const createSvg: (input:string) => HTMLImageElement = (input) =>{
    let svg = document.createElement("img");
    svg.src = input;
    return svg;
}
const createMenu: () => HTMLDivElement = () =>{
    let menu = createDiv("menu");
    ["cash", "credit", "debit", "transfer", "invoice", "transfer"].map((item) =>{
        const svg = createSvg(item + ".svg");
        svg.id = item;
        svg.height = 36;
        svg.width = 36;
        menu.appendChild(svg);
    });
    return menu;
}
const createAddHeaderCell: (input:string) => HTMLTableHeaderCellElement = (input) =>{
    const th = document.createElement("th");
    th.appendChild(document.createTextNode(input));
    return th;
}
const createAddHeader: () => HTMLTableRowElement = () =>{
    const tr = document.createElement("tr");
    tr.appendChild(createAddHeaderCell("Cantidad"));
    tr.appendChild(createAddHeaderCell("Codigo"));
    tr.appendChild(createAddHeaderCell("Nombre"));
    tr.appendChild(createAddHeaderCell("Precio"));
    tr.appendChild(createAddHeaderCell("Total"));
    return tr;
}
const createTableCell: () => HTMLTableCellElement = () =>{
    const td = document.createElement("td");
    td.contentEditable = "true";
    return td;
}
const createTableRow: () => HTMLTableRowElement = () =>{
    const tr = document.createElement("tr");
    tr.appendChild(createTableCell());
    tr.appendChild(createTableCell());
    tr.appendChild(createTableCell());
    tr.appendChild(createTableCell());
    tr.appendChild(createTableCell());
    return tr;
}
const createAddTable: () => HTMLTableElement = () =>{
    const table = document.createElement("table");
    table.appendChild(createAddHeader());
    table.appendChild(createTableRow());
    return table;
}
const createWrapper: () =>HTMLDivElement = () =>{
    let wrapper = createDiv("wrapper");
    wrapper.appendChild(createMenu());
    wrapper.appendChild(createAddTable());
    return wrapper;
}
window.onload = () =>{
    document.body.appendChild(createWrapper());
    setTimeout(()=>{document.getElementsByTagName("td")[0].focus()},1);
}